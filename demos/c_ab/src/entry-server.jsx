import * as React from "react";
import ReactDOMServer from 'react-dom/server'
import {
  StaticRouter,
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider
} from 'react-router'
import { RENDER_TYPE, RENDER_TYPE_STATIC } from './render-utils'

import { routes } from "./App";
export { routes }; // for SSG

export async function render(
  request,
  response
) {
  console.log(`render()`)
  let { query, dataRoutes } = createStaticHandler(routes);  //?? move globally
  let remixRequest = createFetchRequest(request, response);
  let context = await query(remixRequest);
  if (context instanceof Response) {
    throw context;
  }
  let router = createStaticRouter(dataRoutes, context);

  return ReactDOMServer.renderToString(
    <React.StrictMode>
      <StaticRouterProvider
        router={router}
        context={context}
        nonce="the-nonce"
      />
    </React.StrictMode>
  );
}

export async function renderStatic(url) {
  console.log(`renderStatic()`)
  let { query, dataRoutes } = createStaticHandler(routes);
  let remixRequest = new Request(
    url,
    { headers: { RENDER_TYPE: RENDER_TYPE_STATIC } }
  )
  let context = await query(remixRequest)
  if (context instanceof Response) {
    throw context;
  }
  let router = createStaticRouter(dataRoutes, context);

  return ReactDOMServer.renderToString(
    <React.StrictMode>
       <StaticRouterProvider
         router={router}
         context={context}
         nonce="the-nonce"
       />
    </React.StrictMode>
  );
}


export function createFetchRequest(req, res) {
  let origin = `${req.protocol}://${req.get("host")}`;
  // Note: This had to take originalUrl into account for presumably vite's proxying
  let url = new URL(req.originalUrl || req.url, origin);

  let controller = new AbortController();
  res.on("close", () => controller.abort());

  let headers = new Headers();

  for (let [key, values] of Object.entries(req.headers)) {
    if (values) {
      if (Array.isArray(values)) {
        for (let value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }

  let init = {
    method: req.method,
    headers,
    signal: controller.signal,
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = req.body;
  }

  return new Request(url.href, init);
};
