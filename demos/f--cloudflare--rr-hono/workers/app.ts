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

// Preload all mock data files at build time
const mockDataModules = import.meta.glob("../mock-data/*.json", {
  query: "?raw",
  import: "default",
  eager: true,
});

// Load mock data from files
async function loadMockData(c: AppContext, filename: string): Promise<any> {
  console.log("Environment variables:", c.env);

  // Check if mock API is enabled
  if (c.env.MOCK_API !== "true") {
    throw new Error("Mock API is disabled");
  }

  // Security check - only allow alphanumeric filenames (with optional .json extension)
  if (!/^[a-zA-Z0-9-]+(\.json)?$/.test(filename)) {
    throw new Error("Invalid filename");
  }

  // Add .json extension if missing
  const normalizedFilename = filename.endsWith(".json")
    ? filename
    : `${filename}.json`;
  const filePath = `../mock-data/${normalizedFilename}`;

  try {
    // Try to fetch from assets first (production)
    if (c.env.ASSETS) {
      const response = await c.env.ASSETS.fetch(
        new URL(`/mock-data/${normalizedFilename}`, c.req.url)
      );
      if (response.ok) {
        return await response.json();
      }
    }

    // Use preloaded modules in development
    if (mockDataModules[filePath]) {
      return JSON.parse(mockDataModules[filePath]);
    }

    throw new Error("File not found");
  } catch (error) {
    console.error(`Error loading mock data file ${filename}:`, error);
    throw error;
  }
}

// API route for mock data files
app.get("/api/:filename", async (c: AppContext) => {
  const { filename } = c.req.param();

  try {
    const data = await loadMockData(c, filename);
    return c.json(data);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Invalid filename") {
        return c.json({ error: error.message }, 400);
      }
      if (error.message === "Mock API is disabled") {
        return c.json({ error: error.message }, 403);
      }
    }
    console.error(`Error loading mock data file ${filename}:`, error);
    return c.json({ error: "File not found" }, 404);
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
