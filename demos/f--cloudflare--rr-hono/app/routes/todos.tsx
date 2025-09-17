import { useLoaderData, Link, useFetcher } from "react-router";
import { useState, useEffect, useRef } from "react";
import { Button } from "@radix-ui/themes";
import * as Checkbox from "@radix-ui/react-checkbox";
import styles from "./todos.module.css";
import type { LoaderFunctionArgs } from "react-router";

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
}

interface WeatherData {
  generationtime_ms: number;
  current: {
    temperature_2m: number;
    wind_speed_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    wind_speed_10m: number[];
  };
}

export async function loader({ context }: LoaderFunctionArgs) {
  // Fetch weather data
  const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
  weatherUrl.searchParams.append("latitude", "52.52");
  weatherUrl.searchParams.append("longitude", "13.41");
  weatherUrl.searchParams.append("current", "temperature_2m,wind_speed_10m");
  weatherUrl.searchParams.append(
    "hourly",
    "temperature_2m,relative_humidity_2m,wind_speed_10m"
  );

  const weatherResponse = await fetch(weatherUrl.toString());

  if (!weatherResponse.ok) {
    throw new Error(`Failed to fetch weather data: ${weatherResponse.status}`);
  }
  const weatherData = await weatherResponse.json();

  return { weatherData };
}

interface LoaderData {
  weatherData: {
    generationtime_ms: number;
    current: {
      temperature_2m: number;
      wind_speed_10m: number;
    };
  };
}

export default function TodosPage() {
  const { weatherData } = useLoaderData() as LoaderData;
  const fetcher = useFetcher();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editTodoTitle, setEditTodoTitle] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  // Load todos on initial render
  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch('/api/todos');
      if (response.ok) {
        const data = await response.json() as Todo[];
        setTodos(data);
      }
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTodoTitle })
    });

    if (response.ok) {
      const newTodo = await response.json() as Todo;
      setTodos([...todos, newTodo]);
      setNewTodoTitle('');
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed })
    });

    if (response.ok) {
      const updatedTodo = await response.json() as Todo;
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
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
    
    const response = await fetch(`/api/todos/${editingTodoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTodoTitle })
    });

    if (response.ok) {
      const updatedTodo = await response.json() as Todo;
      setTodos(todos.map(todo => todo.id === editingTodoId ? updatedTodo : todo));
      setEditingTodoId(null);
      setEditTodoTitle("");
    }
  };
  
  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setEditTodoTitle("");
  };

  const handleDeleteTodo = async (id: string) => {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.weatherInfo}>
        <h3>Weather Data</h3>
        <p>Data generated in {weatherData?.generationtime_ms?.toFixed(2)}ms</p>
        <p>
          Current temperature: {weatherData?.current?.temperature_2m?.toFixed(2)}°C
        </p>
        <p>Wind speed: {weatherData?.current?.wind_speed_10m?.toFixed(2)} km/h</p>
      </div>
      <div className={styles.headerContainer}>
        <Link to="/">Back to Home</Link>
      </div>
      <h1>Todo List</h1>
      
      <form onSubmit={handleAddTodo} className={styles.todoForm}>
        <div className={styles.todoFormContent}>
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTodoTitle(e.target.value)}
            placeholder="Add a new todo..."
            className={styles.todoInput}
          />
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
          >
            <div className={styles.todoContent}>
              <Checkbox.Root
                checked={todo.completed}
                onCheckedChange={() => handleToggleComplete(todo.id, todo.completed)}
                className={styles.todoCheckbox}
                id={`todo-${todo.id}`}
              />
              
              {editingTodoId === todo.id ? (
                <input
                  type="text"
                  value={editTodoTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditTodoTitle(e.target.value)}
                  className={styles.todoEditInput}
                  ref={editInputRef}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') handleSaveEdit();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                />
              ) : (
                <span className={styles.todoText}>{todo.title}</span>
              )}
              <div className={styles.todoDates}>
                <span>Created: {new Date(todo.createdAt).toLocaleString()}</span>
                {todo.updatedAt && (
                  <span>Updated: {new Date(todo.updatedAt).toLocaleString()}</span>
                )}
              </div>
            </div>
            <div className={styles.todoActions}>
              {editingTodoId === todo.id ? (
                <>
                  <Button
                    onClick={handleSaveEdit}
                    color="green"
                    variant="soft"
                    size="2"
                    style={{ marginRight: '8px' }}
                    aria-label="Save edit"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    color="gray"
                    variant="soft"
                    size="2"
                    aria-label="Cancel edit"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTodo(todo);
                    }}
                    color="blue"
                    variant="ghost"
                    size="1"
                    style={{ marginRight: '4px' }}
                    aria-label="Edit todo"
                  >
                    ✎
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTodo(todo.id);
                    }}
                    color="red"
                    variant="ghost"
                    size="1"
                    aria-label="Delete todo"
                  >
                    ×
                  </Button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
