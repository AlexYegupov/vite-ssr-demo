import {
  Link,
  useFetcher,
  useLoaderData,
  useActionData,
  useNavigation,
  useSubmit,
  Form,
} from "react-router";
import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
  useCallback,
  useMemo,
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
interface ActionData {
  shouldRevalidate?: boolean;
}

export function shouldRevalidate({
  actionResult,
  defaultShouldRevalidate,
}: {
  actionResult?: ActionData;
  defaultShouldRevalidate: boolean;
}) {
  console.log("shouldRevalidate", actionResult, defaultShouldRevalidate);

  if (actionResult?.shouldRevalidate === false) {
    return false;
  }

  return defaultShouldRevalidate;
}

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: number; // 1 = highest priority
  createdAt: string;
  updatedAt?: string;
  pendingDelete?: boolean;
  pendingDeletion?: boolean;
  pendingUpdate?: boolean;
  deleteTimer?: number;
}

function getPreferredLocale(acceptLanguage: string | null): string {
  if (!acceptLanguage) return "en-US";
  // Get the first language from the Accept-Language header
  const preferredLang = acceptLanguage.split(",")[0].trim().split("-");
  const language = preferredLang[0];
  const region = preferredLang[1] || language.toUpperCase();
  return `${language}-${region}`;
}

export async function loader({
  request,
  context,
}: {
  request: Request;
  context: any;
}) {
  console.log("loader (todos)");
  try {
    const response = await context.fetchInternal("/api/todos");
    if (!response.ok) throw new Error(`Failed to load todos (Status: ${response.status} ${response.statusText})`);
    const todos = await response.json();

    // Get the preferred locale from the Accept-Language header
    const acceptLanguage = request.headers.get("accept-language");
    const locale = getPreferredLocale(acceptLanguage);

    return { todos, locale };
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

  console.log("action", request.url, formData);

  // Get the base URL for the API
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  // Create a fetch function that works in both server and client contexts
  const fetchApi = async (path: string, options: RequestInit = {}) => {
    if (context?.fetchInternal) {
      console.log("fetchApi:fetchInternal");
      // Use the internal fetch when available (server-side)
      return context.fetchInternal(`/api${path}`, options);
    }

    console.log("fetchApi:fetch");
    // Fallback to direct fetch (client-side)
    const apiUrl = new URL(`/api${path}`, baseUrl).toString();
    return fetch(apiUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  };

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

        const response = await fetchApi("/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTodo),
        });

        if (!response.ok) throw new Error(`Failed to create todo (Status: ${response.status} ${response.statusText})`);
        return {
          intent: "create",
          data: await response.json(),
          shouldRevalidate: false,
        };
      }

      case "update": {
        const id = formData.get("id")?.toString();
        const title = formData.get("title")?.toString();
        const completed = formData.get("completed");

        if (!id) throw new Error("Todo ID is required");

        const updates: any = { id };
        if (title !== null) updates.title = title;
        if (completed !== null) updates.completed = completed === "true";

        const response = await fetchApi(`/todos/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          throw new Error(`Failed to update todo (Status: ${response.status} ${response.statusText})`);
        }

        try {
          const result = await response.json();
          return { intent: "update", data: result, shouldRevalidate: false };
        } catch (e) {
          console.error("Failed to parse update response:", e);
          throw new Error("Invalid response from server");
        }
      }

      case "delete": {
        console.log("Deleting todo", formData);
        const id = formData.get("id")?.toString();
        if (!id) throw new Error("Todo ID is required");

        const response = await fetchApi(`/todos/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error(`Failed to delete todo (Status: ${response.status} ${response.statusText})`);
        return { intent: "delete", data: { id }, shouldRevalidate: false };
      }

      default:
        throw new Error(`Unknown intent: ${intent}`);
    }
  } catch (error) {
    console.error(`Error in todo action (${intent}):`, error);
    return {
      intent: "error",
      data: {
        error: error instanceof Error ? error.message : "An error occurred",
      },
    };
  }
}

type ActionData =
  | { intent: "create"; data: Todo }
  | { intent: "update"; data: Todo }
  | { intent: "delete"; data: { id: string } }
  | { intent: "error"; data: { error: string } };

interface LoaderData {
  todos: Todo[];
  locale: string;
}

export default function TodosPage() {
  const { todos: initialTodos, locale } = useLoaderData<LoaderData>();

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: "short",
        timeStyle: "short",
      }),
    [locale]
  );
  const formatDateTime = useCallback(
    (date: Date | string): string => {
      try {
        const dateObj = new Date(date);
        return dateFormatter.format(dateObj);
      } catch (error) {
        console.error("Error formatting date:", error);
        return "";
      }
    },
    [dateFormatter]
  );

  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => {
      // Sort by createdAt in descending order (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [todos]);

  // Update todos when initialTodos changes (e.g., after server actions)
  useEffect(() => {
    console.log("initialTodos changed");
    setTodos(initialTodos);
  }, [initialTodos]);

  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const newTodoInputRef = useRef<HTMLInputElement>(null);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editTodoTitle, setEditTodoTitle] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();
  const [updatingTodoId, setUpdatingTodoId] = useState<string | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<string | null>(null);
  const deletingTodoIdRef = useRef<string | null>(null);

  // Handle action responses and errors
  useEffect(() => {
    if (navigation.state === "idle") {
      if (actionData?.intent === "error") {
        addToast({
          title: "Error",
          description: actionData.data.error,
          duration: 3000,
        });
      } else if (actionData?.intent === "delete") {
        console.log("DD", actionData, navigation.state);
        setTodos((prevTodos) =>
          prevTodos.filter((todo) => todo.id !== actionData.data.id)
        );
        setDeletingTodoId(null);
        deletingTodoIdRef.current = null;
      } else if (actionData?.intent === "update") {
        console.log("uu");
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === actionData.data.id
              ? { ...todo, ...actionData.data }
              : todo
          )
        );
        setUpdatingTodoId(null);
        setEditingTodoId(null);
      } else if (actionData?.intent === "create") {
        console.log("create response", actionData.data);
        setTodos((prevTodos) => [...prevTodos, actionData.data]);
        newTodoInputRef.current?.focus();
      }
    }
  }, [actionData, navigation.state]);

  // Reset form after successful submission
  useEffect(() => {
    if (navigation.state === "idle" && formRef.current) {
      formRef.current.reset();
      setNewTodoTitle("");
    }
  }, [navigation.state]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim() || navigation.state === "submitting") return;

    const newTodo = {
      title: newTodoTitle.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    // Optimistically add the todo
    setNewTodoTitle("");

    const formData = new FormData();
    formData.append("intent", "create");
    formData.append("title", newTodo.title);

    submit(formData, {
      method: "post",
      action: "/todos",
      replace: true,
    });
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    if (updatingTodoId) return;

    setUpdatingTodoId(id);
    const newCompleted = !completed;

    const formData = new FormData();
    formData.append("intent", "update");
    formData.append("id", id);
    formData.append("completed", String(newCompleted));

    submit(formData, {
      method: "post",
      action: "/todos",
      replace: true,
    });
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditTodoTitle(todo.title);
    setTimeout(() => {
      editInputRef.current?.focus();
    }, 0);
  };

  const handleSaveEdit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!editingTodoId || !editTodoTitle.trim() || updatingTodoId) return;

    if (e && e.type !== "submit") return;

    setUpdatingTodoId(editingTodoId);
    const updatedTitle = editTodoTitle.trim();

    const formData = new FormData();
    formData.append("intent", "update");
    formData.append("id", editingTodoId);
    formData.append("title", updatedTitle);

    submit(formData, {
      method: "post",
      action: "/todos",
    });
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setEditTodoTitle("");
  };

  const handleDeleteTodo = (id: string) => {
    if (deletingTodoId) return;

    deletingTodoIdRef.current = id;

    // Set the todo being deleted for visual feedback
    console.log("handleDeleteTodo", id);
    setDeletingTodoId(id);

    // Create a unique ID for this toast
    const toastId = `todo-delete-${id}`;

    // Show toast with undo action
    addToast({
      id: toastId,
      title: "Todo Deleted",
      description: "Todo has been deleted. Click to undo.",
      duration: 1000,
      action: {
        label: "Undo",
        onClick: () => {
          handleUndoDelete(id);
          // The toast will be removed by the handleUndoDelete function
        },
      },
      onDismiss: async () => {
        if (deletingTodoIdRef.current === id) {
          const formData = new FormData();
          formData.append("intent", "delete");
          formData.append("id", id);

          await submit(formData, {
            method: "post",
            action: "/todos",
          });
        }
      },
    });
  };

  const { removeToastById } = useToast();

  const handleUndoDelete = (id: string) => {
    deletingTodoIdRef.current = null;
    console.log("Undo delete for todo:", id);
    // Clear the deleting state
    setDeletingTodoId(null);

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
                ref={newTodoInputRef}
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
          {sortedTodos.map((todo) => (
            <li
              key={todo.id}
              className={`${styles.todoItem} ${
                deletingTodoId === todo.id ? styles.pendingDelete : ""
              } ${todo.completed ? styles.completed : ""} ${
                updatingTodoId === todo.id ? styles.updating : ""
              }`}
            >
              <article className={styles.todoContent}>
                <Checkbox.Root
                  checked={todo.completed}
                  onCheckedChange={() =>
                    handleToggleComplete(todo.id, todo.completed)
                  }
                  className={styles.todoCheckbox}
                  id={`todo-${todo.id}`}
                  disabled={!!updatingTodoId}
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
                      {formatDateTime(todo.createdAt)}
                    </time>
                  </span>
                  {todo.updatedAt && (
                    <span>
                      Updated:{" "}
                      <time dateTime={todo.updatedAt}>
                        {formatDateTime(todo.updatedAt)}
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
                        if (!updatingTodoId) {
                          e.stopPropagation();
                          handleEditTodo(todo);
                        }
                      }}
                      color="blue"
                      variant="ghost"
                      size="3"
                      className={styles.editActionButton}
                      aria-label="Edit todo"
                      disabled={!!updatingTodoId}
                    >
                      <Pencil1Icon width="24" height="24" />
                    </IconButton>
                    <IconButton
                      onClick={(e: React.MouseEvent) => {
                        if (!updatingTodoId) {
                          e.stopPropagation();
                          handleDeleteTodo(todo.id);
                        }
                      }}
                      color="red"
                      variant="ghost"
                      size="3"
                      aria-label="Delete todo"
                      disabled={!!updatingTodoId}
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
