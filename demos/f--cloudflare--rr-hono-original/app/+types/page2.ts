import type { Hono } from "hono";

export interface MetaArgs {}

export interface ComponentProps {
  loaderData: {
    message: string;
    testResponse: string;
  };
}

type LoaderContext = {
  cloudflare: {
    env: {
      VALUE_FROM_CLOUDFLARE: string;
    };
    ctx: ExecutionContext;
  };
  honoApp: Hono & {
    internalFetch: (
      path: string,
      request: { url: string, cf?: any },
      options?: { json?: boolean }
    ) => Promise<any>;
  };
  request: Request;
};

export type Route = {
  MetaArgs: MetaArgs;
  ComponentProps: ComponentProps;
  LoaderContext: LoaderContext;
};
