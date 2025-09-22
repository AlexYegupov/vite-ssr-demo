import { Link, useFetcher, useLoaderData } from "react-router";
import { useState, useRef, useEffect, type ChangeEvent, type KeyboardEvent } from "react";
import { Button, TextField, IconButton } from "@radix-ui/themes";
import { Pencil1Icon, Cross2Icon, CheckIcon } from "@radix-ui/react-icons";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as Toast from "@radix-ui/react-toast";
import styles from "./todos.module.css";
import todosData from "../../mock-data/todos.json";

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
  deleteTimer?: number;
}

interface ToastMessage {
  id: string;
  title: string;
  createdAt: number;
}

export async function loader({ request }: { request: Request }) {
  const url = new URL('/api/todos', request.url);
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Failed to load todos');
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
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [deletedTodoTitle, setDeletedTodoTitle] = useState('');

  // Initialize todos from loader data
  useEffect(() => {
    setTodos(initialTodos);
  }, [initialTodos]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      title: newTodoTitle,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTodos([...todos, newTodo]);
    setNewTodoTitle("");
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
      });
      
      if (!response.ok) throw new Error('Failed to update todo');
      
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      );
    } catch (error) {
      console.error('Error updating todo:', error);
    }
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

    setTodos(
      todos.map((todo) =>
        todo.id === editingTodoId
          ? {
              ...todo,
              title: editTodoTitle,
              updatedAt: new Date().toISOString(),
            }
          : todo
      )
    );
    setEditingTodoId(null);
    setEditTodoTitle("");
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setEditTodoTitle("");
  };

  const handleDeleteTodo = (id: string) => {
    const todoToDelete = todos.find(t => t.id === id);
    if (todoToDelete) {
      const newToast = {
        id: `toast-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        title: todoToDelete.title,
        createdAt: Date.now()
      };
      setToasts(prev => [...prev, newToast]);
      
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 5000);
    }
    
    // Mark todo as pending delete instead of removing immediately
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, pendingDelete: true, deleteTimer: 5 } : todo
      )
    );

    // Start countdown timer
    const intervalId = setInterval(() => {
      setTodos((prevTodos) => {
        // Find the todo with this ID
        const todoToUpdate = prevTodos.find((t) => t.id === id);

        // If todo doesn't exist or is no longer pending delete, clear interval
        if (!todoToUpdate || !todoToUpdate.pendingDelete) {
          clearInterval(intervalId);
          return prevTodos;
        }

        // If timer reached 0, actually delete the todo
        if (todoToUpdate.deleteTimer === 1) {
          clearInterval(intervalId);
          // Wait for animation to complete before removing from DOM
          setTimeout(() => {
            setTodos((currentTodos) => currentTodos.filter((t) => t.id !== id));
          }, 100); // Small delay to ensure animation completes
          return prevTodos;
        }

        // Otherwise, decrement the timer
        return prevTodos.map((t) =>
          t.id === id ? { ...t, deleteTimer: (t.deleteTimer || 5) - 1 } : t
        );
      });
    }, 1000);
  };

  const handleUndoDelete = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, pendingDelete: false, deleteTimer: undefined }
          : todo
      )
    );
  };

  return (
    <Toast.Provider swipeDirection="right">
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
              } ${todo.pendingDelete ? styles.pendingDelete : ""}`}
            >
              {todo.pendingDelete && (
                <Button
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleUndoDelete(todo.id);
                  }}
                  color="red"
                  variant="outline"
                  size="2"
                  className={styles.undoButton}
                >
                  Cancel deletion ({todo.deleteTimer}s)
                </Button>
              )}
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
        {toasts.map((toast) => (
          <Toast.Root 
            key={toast.id}
            className={styles.toastRoot}
            duration={5000}
            onOpenChange={(open) => !open && setToasts(prev => prev.filter(t => t.id !== toast.id))}
          >
            <Toast.Title className={styles.toastTitle}>Todo deleted</Toast.Title>
            <Toast.Description>"{toast.title}" was removed</Toast.Description>
            <Toast.Action asChild altText="Dismiss">
              <Button size="1" variant="soft" onClick={() => 
                setToasts(prev => prev.filter(t => t.id !== toast.id))
              }>
                Dismiss
              </Button>
            </Toast.Action>
          </Toast.Root>
        ))}
        
        <Toast.Viewport className={styles.toastViewport} />
      </div>
    </Toast.Provider>
  );
}
