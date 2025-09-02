import { Link } from "react-router";

export function meta() {
  return [
    { title: "Todo List" },
    { name: "description", content: "Manage your todos" },
  ];
}

export async function loader({
  request,
  context,
}: {
  request: Request;
  context: { cloudflare: { env: { VALUE_FROM_CLOUDFLARE: string } } };
}) {
  try {
    const url = new URL("/api/todos.json", new URL(request.url).origin);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch todos");
    }

    const todos = await response.json();
    return {
      todos,
      cloudflareEnv: context.cloudflare.env.VALUE_FROM_CLOUDFLARE,
    };
  } catch (error) {
    console.error("Error fetching todos:", error);
    return {
      todos: [],
      error: "Failed to load todos",
      cloudflareEnv:
        context?.cloudflare?.env?.VALUE_FROM_CLOUDFLARE || "Not available",
    };
  }
}

export default function Todo3Page({
  loaderData,
}: {
  loaderData: {
    todos: Array<{ id: number; title: string; completed: boolean }>;
    error?: string;
    cloudflareEnv?: string;
  };
}) {
  return (
    <div>
      <h1>Todo List (v3)</h1>
      <div style={{ marginBottom: "20px" }}>
        <Link to="/">← Back to Home</Link>
      </div>

      {loaderData.error ? (
        <p style={{ color: "red" }}>{loaderData.error}</p>
      ) : (
        <>
          <p>Environment: {loaderData.cloudflareEnv}</p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {loaderData.todos.map((todo) => (
              <li
                key={todo.id}
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                  margin: "8px 0",
                  padding: "8px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                }}
              >
                {todo.title}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
