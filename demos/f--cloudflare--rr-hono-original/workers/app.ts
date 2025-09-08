import { Hono } from "hono";
import { createRequestHandler } from "react-router";
import type { IncomingRequestCfProperties } from "@cloudflare/workers-types";

const app = new Hono();

const createFetchInternal =
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
    fetchInternal: createFetchInternal(
      app,
      c.req.url,
      c.req.raw.cf as IncomingRequestCfProperties
    ),
  });
  return response;
});

export default app;
