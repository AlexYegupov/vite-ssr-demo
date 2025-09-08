import { Hono } from "hono";
import { createRequestHandler } from "react-router";
import type { IncomingRequestCfProperties } from "@cloudflare/workers-types";

const app = new Hono();

const createInternalFetch =
  (app: Hono, baseUrl: string, cf?: IncomingRequestCfProperties) =>
  async (path: string) => {
    return await app.fetch(new Request(new URL(path, baseUrl)), {
      cf,
    });
  };

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
  const response = await requestHandler(c.req.raw, {
    cloudflare: { env: c.env, ctx: c.executionCtx },
    internalFetch: createInternalFetch(
      app,
      c.req.url,
      (c.req.raw as unknown as { cf?: IncomingRequestCfProperties }).cf
    ),
  });
  return response;
});

export default app;
