import { createRequestHandler } from "react-router";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export default {
  fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Block sourcemap requests unless SOURCEMAPS_ACCESS_PROD env variable is set to "true"
    if (url.pathname.endsWith('.map') && env.SOURCEMAPS_ACCESS_PROD !== "true") {
      // Return 404 Not Found to hide the fact that sourcemaps exist
      return new Response('Not Found', {
        status: 404,
        statusText: 'Not Found'
      });
    }
    
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;
