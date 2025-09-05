import { Hono } from "hono";
import { createRequestHandler } from "react-router";

const app = new Hono();

const createInternalFetch =
  (app: Hono) =>
  async (
    path: string,
    request: { url: string; cf?: any },
    options: { json?: boolean } = { json: false }
  ) => {
    const response = await app.fetch(new Request(new URL(path, request.url)), {
      cf: request.cf,
    });
    return options.json ? response.json() : response.text();
  };

const internalFetch = createInternalFetch(app);

// Cache the request handler
const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

// Add routes
app.get("/test", (c) => {
  const val = c.req.query("val");
  return c.text(val || "No val parameter provided");
});

app.get("*", async (c) => {
  console.log("app.get *");
  return requestHandler(c.req.raw, {
    cloudflare: { env: c.env, ctx: c.executionCtx },
    internalFetch,
    request: {
      url: c.req.url,
      cf: (c.req.raw as any).cf,
    },
  });
});

export default app;
