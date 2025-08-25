import { useLoaderData, Link } from "react-router-dom";
import styles from "./todos.module.css";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

export async function loader() {
  // Use the full URL for the API request
  const baseUrl = import.meta.env.DEV 
    ? 'http://localhost:5173' 
    : '';
  const response = await fetch(`${baseUrl}/api/todos.json`);
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  return response.json();
}

export default function TodosPage() {
  const todos = useLoaderData() as Todo[];
  
  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Todo List</h1>
        <Link to="/">Back to Home</Link>
      </div>
      <ul className={styles.todoList}>
        {todos.map((todo) => (
          <li key={todo.id} className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}>
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
