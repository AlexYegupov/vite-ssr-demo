import { Link, useFetcher, useLoaderData } from "react-router";
import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { Button, TextField, IconButton } from "@radix-ui/themes";
import { Pencil1Icon, Cross2Icon, CheckIcon } from "@radix-ui/react-icons";
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

export async function loader({ request }: { request: Request }) {
  const url = new URL("/api/todos", request.url);
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to load todos");
  }
  const todos = await response.json();
  return { todos };
}

interface LoaderData {
  todos: Todo[];
}

export default function TodosPage() {
  const { todos: initialTodos } = useLoaderData<{ todos: Todo[] }>();
  const [todos, setTodos] = useState<Todo[]>([]);
  const fetcher = useFetcher();
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editTodoTitle, setEditTodoTitle] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  // Initialize todos from loader data
  useEffect(() => {
    setTodos(initialTodos);
  }, [initialTodos]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTodoTitle,
          completed: false
        })
      });

      if (!response.ok) throw new Error('Failed to create todo');
      
      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
      setNewTodoTitle('');
    } catch (error) {
      console.error('Error creating todo:', error);
      addToast({
        title: 'Error',
        description: 'Failed to create todo',
        duration: 3000
      });
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
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
      const response = await fetch(`/api/todos/${editingTodoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTodoTitle })
      });

      if (!response.ok) throw new Error('Failed to update todo');
      
      const updatedTodo = await response.json();
      setTodos(todos.map(todo => 
        todo.id === editingTodoId ? updatedTodo : todo
      ));
      setEditingTodoId(null);
      setEditTodoTitle('');
    } catch (error) {
      console.error('Error updating todo:', error);
      addToast({
        title: 'Error',
        description: 'Failed to update todo',
        duration: 3000
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
        onDismiss: () => {
          console.log("onDismiss called for todo:", id);
          // Always remove the todo when toast is dismissed
          setTodos((currentTodos) => {
            console.log("Removing todo:", id, "from todos");
            return currentTodos.filter((t) => t.id !== id);
          });
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
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <Link to="/">Back to Home</Link>
      </div>
      <h1>Todo List</h1>

      <form onSubmit={handleAddTodo} className={styles.todoForm}>
        <div className={styles.todoFormContent}>
          <div className={styles.todoInput}>
            <TextField.Root
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
        </div>
      </form>

      <ul className={styles.todoList}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`${styles.todoItem} ${
              todo.completed ? styles.completed : ""
            }`}
            data-pending-deletion={todo.pendingDeletion || false}
          >
            <div className={styles.todoContent}>
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
              <div className={styles.todoDates}>
                <span>
                  Created: {new Date(todo.createdAt).toLocaleString()}
                </span>
                {todo.updatedAt && (
                  <span>
                    Updated: {new Date(todo.updatedAt).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <div className={styles.todoActions}>
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
                    <Cross2Icon width="24" height="24" />
                  </IconButton>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
