import * as React from "react";
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, matchRoutes, RouterProvider, redirect, useNavigate } from 'react-router-dom'
import {
  StaticRouter,
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider
} from 'react-router-dom/server'

import { routes } from "./App"

const CLIENT_RENDER_URL_PARAM = 'url'

hydrate();


async function hydrate() {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  console.log(`hydrate()`, url, window.location, params, window.__staticRouterHydrationData)

  // render on client specific url without hydrating
  const clientRenderUrl = params.get(CLIENT_RENDER_URL_PARAM)

  // Determine if any of the initial routes are lazy
  let lazyMatches = matchRoutes(routes, window.location)?.filter(
    (m) => m.route.lazy
  );

  // Load the lazy matches and update the routes before creating your router
  // so we can hydrate the SSR-rendered content synchronously
  if (lazyMatches && lazyMatches?.length > 0) {
    await Promise.all(
      lazyMatches.map(async (m) => {
        let routeModule = await m.route.lazy();
        Object.assign(m.route, { ...routeModule, lazy: undefined });
      })
    );
  }

  const matches = matchRoutes(routes, window.location)

  const isRouteDynamic = (
    Object.keys(matches[0].params).length > 0
  )

  const isRouteMatched = !matches.some(m => m.route._notFound)

  console.log(`matches`, matches, isRouteDynamic, isRouteMatched, window.__notFound)

  if (clientRenderUrl) {
    console.log(`clientRenderUrl`, clientRenderUrl)

    window.history.replaceState(null, '', clientRenderUrl)

    // hack: ignore hydrate data
    window.__staticRouterHydrationData = undefined
    let router = createBrowserRouter(routes)   //??

    ReactDOM.createRoot(
      document.getElementById("app")
    ).render(
      <React.StrictMode>
        <RouterProvider router={router} fallbackElement={null} />
      </React.StrictMode>
    );

    return;
  }

  if (isRouteMatched && isRouteDynamic) {

    console.log(`404 but route matched. Rendering on client side`)

    const redirectToClientRenderParams = new URLSearchParams({
      [CLIENT_RENDER_URL_PARAM]: url.pathname,
    })

    window.location = '/?' + redirectToClientRenderParams.toString()
    return;
  }

  console.log(`hydrate actually`)
  let router = createBrowserRouter(routes);

  ReactDOM.hydrateRoot(
    document.getElementById("app"),
    <React.StrictMode>
      <RouterProvider router={router} fallbackElement={null} />
    </React.StrictMode>
  );

}
