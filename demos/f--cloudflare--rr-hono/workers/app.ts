import { Hono } from "hono";
import { serveStatic } from "hono/cloudflare-workers";
import { createRequestHandler } from "react-router";
import type { Context, Env as HonoEnv } from "hono";
import type { IncomingRequestCfProperties } from "@cloudflare/workers-types";

// Define the Cloudflare environment type
interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
  // Cloudflare Worker environment variables
  WORKER_REGION?: string;
  VALUE_FROM_CLOUDFLARE?: string;
  MOCK_API: boolean;
}

type AppContext = Context<{ Bindings: Env }>;
const app = new Hono<{ Bindings: Env }>();

// Add more routes here

// Dynamic API route for JSON files with nested paths
app.get("/api/*", async (c: AppContext) => {
  // Only enable in mock mode
  console.log("F", c.env);
  if (!c.env.MOCK_API) {
    console.log("NF", c.env);
    return c.notFound();
  }

  try {
    const path = c.req.path.replace(/^\/api\//, "").replace(/\.json$/, "");

    // Security check - allow alphanumeric paths with forward slashes
    if (!/^[a-zA-Z0-9-\/]+$/.test(path)) {
      return c.json({ error: "Invalid path" }, 400);
    }

    // Try to load the JSON file from the public directory
    const response = await c.env.ASSETS.fetch(
      new Request(new URL(`/data/${path}.json`, c.req.url))
    );

    if (!response.ok) {
      return response.status === 404
        ? c.json(
            { error: "File not found", details: "No JSON file at this path" },
            404 as const
          )
        : c.json({ error: "Failed to load data" }, response.status as 400 | 500);
    }

    try {
      const data = await response.json();
      return typeof data === "object" && data !== null
        ? c.json(data)
        : c.json({ error: "Invalid JSON format" }, 400);
    } catch (error) {
      return c.json(
        {
          error: "Invalid file format",
          details: "File exists but is not valid JSON",
        },
        404
      );
    }
  } catch (error) {
    console.error("API Error Details:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return c.json(
      {
        error: "Failed to load data",
        details: error instanceof Error ? error.message : String(error),
      },
      500
    );
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
    console.error("Error serving static file:", error);
    return c.notFound();
  }
});

// Add routes
app.get("/test", (c) => {
  const val = c.req.query("val");
  return c.text(val || "No val parameter provided");
});

const createFetchInternal =
  (
    app: Hono<{ Bindings: Env }>,
    baseUrl: string,
    cf: IncomingRequestCfProperties,
    env: Env
  ) =>
  async (path: string) => {
    return await app.fetch(new Request(new URL(path, baseUrl)), {
      ...env,
      cf,
    });
  };

// Handle all other routes with React Router
app.get("*", (c: AppContext) => {
  const requestHandler = createRequestHandler(
    () => import("virtual:react-router/server-build"),
    import.meta.env.MODE
  );

  return requestHandler(c.req.raw, {
    cloudflare: { env: c.env, ctx: c.executionCtx },
    honoApp: app,
    fetchInternal: createFetchInternal(
      app,
      c.req.url,
      c.req.raw.cf as IncomingRequestCfProperties,
      c.env
    ),
  });
});

export default app;
