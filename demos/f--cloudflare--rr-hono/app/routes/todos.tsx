import { useLoaderData, Link } from "react-router";
import styles from "./todos.module.css";
import type { LoaderFunctionArgs } from "react-router";

export function meta() {
  return [
    { title: "The todolist222" },
    { name: "description", content: "Manage your todos" },
  ];
}

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
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

  const response = await context.fetchInternal("/api/todos");

  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }

  const todos = await response.json();

  return {
    todos,
    weatherData,
  };
}

interface LoaderData {
  todos: Todo[];
  weatherData: {
    generationtime_ms: number;
    current: {
      temperature_2m: number;
      wind_speed_10m: number;
    };
  };
}

export default function TodosPage() {
  const { todos, weatherData } = useLoaderData() as LoaderData;

  return (
    <div className={styles.container}>
      <div className={styles.weatherInfo}>
        <h3>Weather Data</h3>
        <p>Data generated in {weatherData?.generationtime_ms?.toFixed(2)}</p>
        <p>
          Current temperature:{" "}
          {weatherData?.current?.temperature_2m?.toFixed(2)}
        </p>
        <p>Wind speed: {weatherData?.current?.wind_speed_10m?.toFixed(2)}</p>
      </div>
      <div className={styles.headerContainer}>
        <Link to="/">Back to Home</Link>
      </div>
      <h1>Todo List</h1>
      <ul className={styles.todoList}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`${styles.todoItem} ${
              todo.completed ? styles.completed : ""
            }`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              readOnly
              className={styles.checkbox}
            />
            <span className={styles.todoTitle}>{todo.title}</span>
            <span className={styles.todoDate}>
              {new Date(todo.createdAt).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
