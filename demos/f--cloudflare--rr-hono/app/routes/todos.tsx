import { useLoaderData, Link } from "react-router-dom";
import styles from "./todos.module.css";

export function meta() {
  return [
    { title: "The todolist" },
    { name: "description", content: "Manage your todos" },
  ];
}

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

export async function loader({ request }: { request: Request }) {
  // Create a new URL based on the request URL
  const url = new URL("/api/todos.json", request.url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }
  return response.json();
}

export default function TodosPage() {
  const todos = useLoaderData() as Todo[];

  return (
    <div className={styles.container}>
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
