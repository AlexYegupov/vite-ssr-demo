import { Hono } from "hono";
import { serveStatic } from "hono/cloudflare-workers";
import { createRequestHandler } from "react-router";

interface Env {
  ASSETS: { fetch: typeof fetch };
  VALUE_FROM_CLOUDFLARE: string;
}

const app = new Hono<{ Bindings: Env }>();

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
