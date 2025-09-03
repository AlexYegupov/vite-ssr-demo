import { Hono } from "hono";
import { serveStatic } from "hono/cloudflare-workers";
import { createRequestHandler } from "react-router";
import type { Context } from 'hono';

// Define the Cloudflare environment type
interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
  // Cloudflare Worker environment variables
  WORKER_REGION?: string;
}

type AppContext = Context<{ Bindings: Env }>;
const app = new Hono<{ Bindings: Env }>();

// Add more routes here

// Serve todos from server-side JSON file
app.get('/api/todos.json', async (c: AppContext) => {
  try {
    // In a real Cloudflare Worker, you would use a KV store
    // For this demo, we'll use a simple in-memory array as a fallback
    const defaultTodos = [
      { id: 1, title: 'Complete project setup', completed: false, createdAt: new Date().toISOString() },
      { id: 2, title: 'Add API routes', completed: true, createdAt: new Date().toISOString() },
      { id: 3, title: 'Implement todo list UI', completed: false, createdAt: new Date().toISOString() }
    ];
    
    return c.json(defaultTodos);
  } catch (error) {
    console.error('Error in todos endpoint:', error);
    return c.json({ error: 'Failed to load todos' }, 500);
  }
});


// Serve other static files through ASSETS binding
app.get("/public/*", async (c: AppContext) => {
  try {
    if (c.env.ASSETS) {
      const response = await c.env.ASSETS.fetch(c.req.raw);
      if (response.ok) {
        return response;
      }
    }
    return c.notFound();
  } catch (error) {
    console.error('Error serving static file:', error);
    return c.notFound();
  }
});

// Handle all other routes with React Router
app.get("*", (c: AppContext) => {
  const requestHandler = createRequestHandler(
    () => import("virtual:react-router/server-build"),
    import.meta.env.MODE
  );

  return requestHandler(c.req.raw, {
    cloudflare: { env: c.env, ctx: c.executionCtx },
  });
});

export default app;
