import type { Hono } from "hono";

export function createInternalFetcher(app: Hono) {
  return async (path: string, request: { url: string, cf?: any }) => {
    const response = await app.fetch(
      new Request(new URL(path, request.url)),
      { cf: request.cf }
    );
    return response.text();
  };
}

export type InternalFetcher = ReturnType<typeof createInternalFetcher>;
