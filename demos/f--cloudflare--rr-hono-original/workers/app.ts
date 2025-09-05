import { Hono } from "hono";
import { createRequestHandler } from "react-router";
import { createInternalFetcher } from "../app/utils/internalFetch";

const app = new Hono();

// Add more routes here
app.get("/test", (c) => c.text("hello"));

app.get("/test2", (c) => c.text("hello2"));

app.get("*", async (c) => {
  const requestHandler = createRequestHandler(
    () => import("virtual:react-router/server-build"),
    import.meta.env.MODE
  );

  const internalFetch = createInternalFetcher(app);

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
