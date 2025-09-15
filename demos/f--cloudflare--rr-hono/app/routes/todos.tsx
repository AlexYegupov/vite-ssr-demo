import { useLoaderData, Link, useFetcher } from "react-router";
import { useState, useEffect } from "react";
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
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Add a new todo..."
          className={styles.todoInput}
        />
        <button type="submit" className={styles.addButton}>Add</button>
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
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id, todo.completed)}
                className={styles.todoCheckbox}
              />
              <span className={styles.todoText}>{todo.title}</span>
              <div className={styles.todoDates}>
                <span>Created: {new Date(todo.createdAt).toLocaleString()}</span>
                {todo.updatedAt && (
                  <span>Updated: {new Date(todo.updatedAt).toLocaleString()}</span>
                )}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTodo(todo.id);
              }}
              className={styles.deleteButton}
              aria-label="Delete todo"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
