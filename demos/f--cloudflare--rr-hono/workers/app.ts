import { Hono } from "hono";
import { serveStatic } from "hono/cloudflare-workers";
import { createRequestHandler } from "react-router";

interface Env {
  ASSETS: { fetch: typeof fetch };
  VALUE_FROM_CLOUDFLARE: string;
}

const app = new Hono<{ Bindings: Env }>();

// Todos data for both API and React Router data requests
const todosData = [
  {
    "id": 1,
    "title": "Complete project setup",
    "completed": false,
    "createdAt": "2025-08-20T10:00:00Z"
  },
  {
    "id": 2,
    "title": "Add API routes",
    "completed": true,
    "createdAt": "2025-08-21T09:30:00Z"
  },
  {
    "id": 3,
    "title": "Implement todo list UI",
    "completed": false,
    "createdAt": "2025-08-21T14:15:00Z"
  },
  {
    "id": 4,
    "title": "Write tests",
    "completed": false,
    "createdAt": "2025-08-21T15:45:00Z"
  },
  {
    "id": 5,
    "title": "Deploy to production",
    "completed": false,
    "createdAt": "2025-08-22T10:00:00Z"
  }
];

// Direct API handler for todos.json
app.get("/api/todos.json", (c) => {
  return c.json(todosData);
});

// Handle React Router data requests
app.get("/todos.data", (c) => {
  return c.json(todosData);
});

// Try to serve other static assets if available
app.get("/api/*", async (c) => {
  try {
    if (c.env.ASSETS) {
      const response = await c.env.ASSETS.fetch(c.req.raw);
      if (response.ok) {
        return response;
      }
    }
    return c.notFound();
  } catch (error) {
    return c.notFound();
  }
});

// Handle all other routes with React Router
app.get("*", (c) => {
  const requestHandler = createRequestHandler(
    () => import("virtual:react-router/server-build"),
    import.meta.env.MODE
  );

  return requestHandler(c.req.raw, {
    cloudflare: { env: c.env, ctx: c.executionCtx },
  });
});

export default app;
