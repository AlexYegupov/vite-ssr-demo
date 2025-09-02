import { Welcome } from "../welcome/welcome";
import { Link } from "react-router";
import styles from "./todos.module.css";

export function meta() {
  return [
    { title: "Todo Listddd" },
    { name: "description", content: "Manage your todos" },
  ];
}

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
};

type LoaderData = {
  message: string;
};

export function loader({
  context,
}: {
  context: { cloudflare: { env: { VALUE_FROM_CLOUDFLARE: string } } };
}) {
  return { message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE };
}

export default function TodosPage({ loaderData }: { loaderData: LoaderData }) {
  const { message } = loaderData;
  const todos: Todo[] = [
    {
      id: 1,
      title: "Complete project setup",
      completed: false,
      createdAt: "2025-08-20T10:00:00Z",
    },
    {
      id: 2,
      title: "Add API routes",
      completed: true,
      createdAt: "2025-08-21T09:30:00Z",
    },
    {
      id: 3,
      title: "Implement todo list UI",
      completed: false,
      createdAt: "2025-08-21T14:15:00Z",
    },
  ];

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
