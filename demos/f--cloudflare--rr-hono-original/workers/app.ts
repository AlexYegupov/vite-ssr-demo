import { Hono } from "hono";
import { createRequestHandler } from "react-router";

const app = new Hono();

// Add more routes here
app.get("/test", (c) => c.text("hello"));

app.get("*", async (c) => {
  const requestHandler = createRequestHandler(
    () => import("virtual:react-router/server-build"),
    import.meta.env.MODE
  );

  // Call the test endpoint handler directly instead of making HTTP request
  const testResponse = await app.fetch(
    new Request(new URL("/test", c.req.url)),
    { cf: c.req.cf }
  );

  return requestHandler(c.req.raw, {
    cloudflare: { env: c.env, ctx: c.executionCtx },
    testResponse: await testResponse.text(),
  });
});

export default app;
