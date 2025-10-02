import {
  Link,
  useFetcher,
  useLoaderData,
  useActionData,
  useNavigation,
  useSubmit,
  Form,} from "react-router";
import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { Button, TextField, IconButton } from "@radix-ui/themes";
import {
  Pencil1Icon,
  Cross2Icon,
  CheckIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import * as Checkbox from "@radix-ui/react-checkbox";
import { useToast } from "../context/toast-context";
import styles from "./todos.module.css";

export function meta() {
  return [
    { title: "Todo List" },
    { name: "description", content: "Manage your todos" },
  ];
}

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
  pendingDelete?: boolean;
  pendingDeletion?: boolean;
  deleteTimer?: number;
}

export async function loader({
  request,
  context,
}: {
  request: Request;
  context: any;
}) {
  try {
    const response = await context.fetchInternal("/api/todos");
    if (!response.ok) throw new Error("Failed to load todos");
    const todos = await response.json();
    return { todos };
  } catch (error) {
    console.error("Error in todos loader:", error);
    throw error;
  }
}

export async function action({
  request,
  context,
}: {
  request: Request;
  context: any;
}) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    switch (intent) {
      case "create": {
        const title = formData.get("title")?.toString().trim();
        if (!title) throw new Error("Title is required");

        const newTodo = {
          title,
          completed: false,
          createdAt: new Date().toISOString(),
        };

        const response = await context.fetchInternal("/api/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTodo),
        });

        if (!response.ok) throw new Error("Failed to create todo");
        return await response.json();
      }

      case "update": {
        const id = formData.get("id")?.toString();
        const title = formData.get("title")?.toString();
        const completed = formData.get("completed");

        if (!id) throw new Error("Todo ID is required");

        const updates: any = { id };
        if (title !== null) updates.title = title;
        if (completed !== null) updates.completed = completed === "true";

        const response = await context.fetchInternal(`/api/todos/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        if (!response.ok) throw new Error("Failed to update todo");
        return await response.json();
      }

      case "delete": {
        const id = formData.get("id")?.toString();
        if (!id) throw new Error("Todo ID is required");

        const response = await context.fetchInternal(`/api/todos/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete todo");
        return { id };
      }

      default:
        throw new Error(`Unknown intent: ${intent}`);
    }
  } catch (error) {
    console.error(`Error in todo action (${intent}):`, error);
    return {
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

interface LoaderData {
  todos: Todo[];
}

export default function TodosPage() {
  const { todos: initialTodos } = useLoaderData<{ todos: Todo[] }>();
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const actionData = useActionData<{
    error?: string;
    id?: string;
    title?: string;
    completed?: boolean;
  }>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editTodoTitle, setEditTodoTitle] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  // Handle action responses
  useEffect(() => {
    if (actionData?.error) {
      addToast({
        title: "Error",
        description: actionData.error,
        duration: 3000,
      });
    }
  }, [actionData, addToast]);

  // Reset form after successful submission
  useEffect(() => {
    if (navigation.state === "idle" && formRef.current) {
      formRef.current.reset();
      setNewTodoTitle("");
    }
  }, [navigation.state]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    const formData = new FormData();
    formData.append("intent", "create");
    formData.append("title", newTodoTitle);

    submit(formData, { method: "post", action: "/todos" });
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    const formData = new FormData();
    formData.append("intent", "update");
    formData.append("id", id);
    formData.append("completed", String(!completed));

    submit(formData, { method: "post", action: "/todos" });
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditTodoTitle(todo.title);
    setTimeout(() => {
      editInputRef.current?.focus();
    }, 0);
  };

  const handleSaveEdit = () => {
    if (!editingTodoId || !editTodoTitle.trim()) return;

    const formData = new FormData();
    formData.append("intent", "update");
    formData.append("id", editingTodoId);
    formData.append("title", editTodoTitle);

    submit(formData, {
      method: "post",
      action: "/todos",
      onSuccess: () => {
        setEditingTodoId(null);
        setEditTodoTitle("");
      },
    });
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setEditTodoTitle("");
  };

  const handleDeleteTodo = (id: string) => {
    const todoToDelete = todos.find((t) => t.id === id);
    if (!todoToDelete) return;

    // Mark todo as pending deletion for visual feedback
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, pendingDeletion: true } : todo
      )
    );

    // Create a unique ID for this toast
    const toastId = `todo-delete-${id}`;

    // Add toast with onDismiss callback
    addToast({
      id: toastId,
      title: "Todo deleted",
      description: `"${todoToDelete.title}" is about to be removed`,
      action: {
        label: "Undo",
        onClick: () => handleUndoDelete(id),
      },
      duration: 3000, // 3 seconds to undo
      onDismiss: () => {
        const formData = new FormData();
        formData.append("intent", "delete");
        formData.append("id", id);

        submit(formData, {
          method: "post",
          action: "/todos",
          onSuccess: () => {
            setTodos((todos) => todos.filter((t) => t.id !== id));
          },
          onError: () => {
            addToast({
              title: "Error",
              description: "Failed to delete todo from server",
              duration: 3000,
            });
          },
        });
      },
    });
  };

  const { removeToastById } = useToast();

  const handleUndoDelete = (id: string) => {
    console.log("Undo delete for todo:", id);
    // Clear the pendingDeletion flag to restore the todo
    setTodos((prevTodos) => {
      const updated = prevTodos.map((todo) =>
        todo.id === id ? { ...todo, pendingDeletion: false } : todo
      );
      console.log("Updated todos after undo:", updated);
      return updated;
    });

    // Find and remove the toast for this todo
    const toastId = `todo-delete-${id}`;
    removeToastById(toastId);
  };

  return (
    <main className={styles.container}>
      <nav className={styles.headerContainer}>
        <Link to="/">Back to Home</Link>
      </nav>
      <header>
        <h1>Todo List</h1>
      </header>

      <section aria-labelledby="add-todo-heading">
        <h2 id="add-todo-heading" className={styles.visuallyHidden}>
          Add New Todo
        </h2>
        <Form
          method="post"
          action="/todos"
          onSubmit={handleAddTodo}
          className={styles.todoForm}
          ref={formRef}
        >
          <fieldset className={styles.todoFormContent}>
            <legend className={styles.visuallyHidden}>
              New Todo Information
            </legend>
            <div className={styles.todoInput}>
              <label htmlFor="new-todo-input" className={styles.visuallyHidden}>
                Todo title
              </label>
              <input type="hidden" name="intent" value="create" />
              <TextField.Root
                id="new-todo-input"
                name="title"
                value={newTodoTitle}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNewTodoTitle(e.target.value)
                }
                placeholder="Add a new todo..."
                size="3"
                disabled={navigation.state === "submitting"}
              />
            </div>
            <Button
              type="submit"
              size="3"
              variant="solid"
              disabled={navigation.state === "submitting"}
            >
              {navigation.state === "submitting" ? "Adding..." : "Add"}
            </Button>
          </fieldset>
        </Form>
      </section>

      <section aria-labelledby="todo-list-heading">
        <h2 id="todo-list-heading" className={styles.visuallyHidden}>
          Your Todos
        </h2>
        <ul className={styles.todoList} aria-label="Todo items">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`${styles.todoItem} ${
                todo.completed ? styles.completed : ""
              }`}
              data-pending-deletion={todo.pendingDeletion || false}
            >
              <article className={styles.todoContent}>
                <Checkbox.Root
                  checked={todo.completed}
                  onCheckedChange={() =>
                    handleToggleComplete(todo.id, todo.completed)
                  }
                  className={styles.todoCheckbox}
                  id={`todo-${todo.id}`}
                >
                  <Checkbox.Indicator className={styles.checkboxIndicator}>
                    ✓
                  </Checkbox.Indicator>
                </Checkbox.Root>

                {editingTodoId === todo.id ? (
                  <div className={styles.todoEditInput}>
                    <TextField.Root
                      value={editTodoTitle}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setEditTodoTitle(e.target.value)
                      }
                      ref={editInputRef}
                      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "Enter") handleSaveEdit();
                        if (e.key === "Escape") handleCancelEdit();
                      }}
                      size="3"
                    />
                  </div>
                ) : (
                  <span className={styles.todoText}>{todo.title}</span>
                )}
                <footer className={styles.todoDates}>
                  <span>
                    Created:{" "}
                    <time dateTime={todo.createdAt}>
                      {new Date(todo.createdAt).toLocaleString()}
                    </time>
                  </span>
                  {todo.updatedAt && (
                    <span>
                      Updated:{" "}
                      <time dateTime={todo.updatedAt}>
                        {new Date(todo.updatedAt).toLocaleString()}
                      </time>
                    </span>
                  )}
                </footer>
              </article>
              <aside
                className={styles.todoActions}
                aria-label="Todo item actions"
              >
                {editingTodoId === todo.id ? (
                  <>
                    <IconButton
                      onClick={handleSaveEdit}
                      color="green"
                      variant="soft"
                      size="3"
                      className={styles.saveEditButton}
                      aria-label="Save edit"
                    >
                      <CheckIcon width="24" height="24" />
                    </IconButton>
                    <IconButton
                      onClick={handleCancelEdit}
                      color="gray"
                      variant="soft"
                      size="3"
                      aria-label="Cancel edit"
                    >
                      <Cross2Icon width="24" height="24" />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleEditTodo(todo);
                      }}
                      color="blue"
                      variant="ghost"
                      size="3"
                      className={styles.editActionButton}
                      aria-label="Edit todo"
                    >
                      <Pencil1Icon width="24" height="24" />
                    </IconButton>
                    <IconButton
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleDeleteTodo(todo.id);
                      }}
                      color="red"
                      variant="ghost"
                      size="3"
                      aria-label="Delete todo"
                    >
                      <TrashIcon width="24" height="24" />
                    </IconButton>
                  </>
                )}
              </aside>{" "}
              {/* End of todo actions */}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
