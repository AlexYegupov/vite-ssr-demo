import { useLoaderData, Link } from "react-router";
import styles from "./todos.module.css";

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

export async function loader({ request }: { request: Request }) {
  try {
    /*     // Fetch weather data
    const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
    weatherUrl.searchParams.append("latitude", "52.52");
    weatherUrl.searchParams.append("longitude", "13.41");
    weatherUrl.searchParams.append("current", "temperature_2m,wind_speed_10m");
    weatherUrl.searchParams.append(
      "hourly",
      "temperature_2m,relative_humidity_2m,wind_speed_10m"
    );

    console.log("Fetching weather data from:", weatherUrl);
    const weatherResponse = await fetch(weatherUrl.toString());
    console.log("R:", weatherResponse);

    if (!weatherResponse.ok) {
      throw new Error(
        `Failed to fetch weather data: ${weatherResponse.status}`
      );
    }
    const weatherData = await weatherResponse.json();
 */
    const weatherData = {};

    const url = new URL(request.url);
    // Fetch todos
    const todosUrl = `${url.origin}/api/todos.json`;
    console.log("Fetching todos from:", todosUrl);
    const todosResponse = await fetch(todosUrl);
    console.log("R:", todosResponse);

    if (!todosResponse.ok) {
      throw new Error(`Failed to fetch todos: ${todosResponse.status}`);
    }

    const todos = await todosResponse.json();

    return { todos, weatherData };
  } catch (error) {
    console.error("Error in loader:", error);
    throw new Response("Error loading data", { status: 500 });
  }
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
  //console.log('Todos:', todos)
  //console.log('Weather', weatherData)

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
