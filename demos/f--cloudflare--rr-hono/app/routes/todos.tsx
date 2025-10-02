import { Link, useFetcher, useLoaderData } from "react-router";
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
  console.log("loader");
  try {
    const url = new URL("/api/todos", request.url);

    // Use context.fetch instead of global fetch for internal requests
    const response = await context.fetchInternal("/api/todos");

    if (!response.ok) {
      console.error("Failed to load todos:", {
        status: response.status,
        statusText: response.statusText,
      });

      // Try to get error details from response
      const errorText = await response.text();
      console.error("Error response:", errorText);

      throw new Error(
        `Failed to load todos: ${response.status} ${response.statusText}`
      );
    }

    const todos = await response.json();
    return { todos };
  } catch (error) {
    console.error("Error in todos loader:", error);
    throw error;
  }
}

interface LoaderData {
  todos: Todo[];
}

export default function TodosPage() {
  const { todos: initialTodos } = useLoaderData<{ todos: Todo[] }>();
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const fetcher = useFetcher();
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editTodoTitle, setEditTodoTitle] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      // Use absolute URL for API requests
      const url = new URL("/api/todos", window.location.origin);
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTodoTitle,
          completed: false,
        }),
      });

      if (!response.ok) throw new Error("Failed to create todo");

      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
      setNewTodoTitle("");
    } catch (error) {
      console.error("Error creating todo:", error);
      addToast({
        title: "Error",
        description: "Failed to create todo",
        duration: 3000,
      });
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const url = new URL(`/api/todos/${id}`, window.location.origin);
      const response = await fetch(url.toString(), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });

      if (!response.ok) throw new Error("Failed to update todo");

      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditTodoTitle(todo.title);
    setTimeout(() => {
      editInputRef.current?.focus();
    }, 0);
  };

  const handleSaveEdit = async () => {
    if (!editingTodoId || !editTodoTitle.trim()) return;

    try {
      const url = new URL(
        `/api/todos/${editingTodoId}`,
        window.location.origin
      );
      const response = await fetch(url.toString(), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTodoTitle }),
      });

      if (!response.ok) throw new Error("Failed to update todo");

      const updatedTodo = await response.json();
      setTodos(
        todos.map((todo) => (todo.id === editingTodoId ? updatedTodo : todo))
      );
      setEditingTodoId(null);
      setEditTodoTitle("");
    } catch (error) {
      console.error("Error updating todo:", error);
      addToast({
        title: "Error",
        description: "Failed to update todo",
        duration: 3000,
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setEditTodoTitle("");
  };

  const handleDeleteTodo = (id: string) => {
    const todoToDelete = todos.find((t) => t.id === id);
    if (todoToDelete) {
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
        onDismiss: async () => {
          console.log("onDismiss called for todo:", id);
          try {
            // Make API request to delete the todo
            const url = new URL(`/api/todos/${id}`, window.location.origin);
            const response = await fetch(url.toString(), {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Failed to delete todo");

            // Remove the todo from local state after successful API call
            setTodos((currentTodos) => {
              console.log("Removing todo:", id, "from todos");
              return currentTodos.filter((t) => t.id !== id);
            });
          } catch (error) {
            console.error("Error deleting todo:", error);
            addToast({
              title: "Error",
              description: "Failed to delete todo from server",
              duration: 3000,
            });
          }
        },
      });
    }
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
        <form onSubmit={handleAddTodo} className={styles.todoForm}>
          <fieldset className={styles.todoFormContent}>
            <legend className={styles.visuallyHidden}>
              New Todo Information
            </legend>
            <div className={styles.todoInput}>
              <label htmlFor="new-todo-input" className={styles.visuallyHidden}>
                Todo title
              </label>
              <TextField.Root
                id="new-todo-input"
                value={newTodoTitle}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNewTodoTitle(e.target.value)
                }
                placeholder="Add a new todo..."
                size="3"
              />
            </div>
            <Button type="submit" size="3" variant="solid">
              Add
            </Button>
          </fieldset>
        </form>
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
