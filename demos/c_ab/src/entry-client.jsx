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


hydrate();


async function hydrate() {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);

  console.log(`hydrate`, url, params, window.__staticRouterHydrationData)

  // reload page same url (to fix 404 code) with client-side only rendering
  if (params.get('__noHydrate')) {
    console.log(`__noHydrate param`)
    let router = createBrowserRouэter(routes)   //??
    //?? createStaticRouter(dataRoutes, context);
    //console.log(`context:`, context, router)

    /* const Root = () => (
     *   <React.StrictMode>
     *     <RouterProvider router={router} />
     *   </React.StrictMode>
     * );

     * ReactDOM.createRoot(document.getElementById('app')).render(<Root />);
     */
    ReactDOM.createRoot(
      document.getElementById("app")
    ).render(
      <React.StrictMode>
        <RouterProvider router={router} fallbackElement={null} />
      </React.StrictMode>
    );

    return
  }





  // Determine if any of the initial routes are lazy
  let lazyMatches = matchRoutes(routes, window.location)?.filter(
    (m) => m.route.lazy
  );

  console.log(`lazyMatches`, lazyMatches)
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

  // EXP:
  const matches = matchRoutes(routes, window.location)
  console.log(`matches`, matches)

  const isRouteMatched = !matches.some(m => m.route._notFound)
  console.log(`isRouteMatched:`, isRouteMatched, window.__notFound)

  //!! Complete rendering (not hydrating!) for route with params
  if (window.__notFound && isRouteMatched) {

    console.log(`404 but route matched. Rendering on client side`)

    // hack to ignore rendered data for hydration
    window.__staticRouterHydrationData = undefined

    //?? Createstaticrouter(dataRoutes, context);
    //console.log(`context:`, context, router)

    // url.searchParams.set('__noHydrate', '1');
    // window.location = window.location.pathname
    // return ;


    // const url = new URL(window.location.href);
    // const params = new URLSearchParams(url.search);
    //
    // const  = params.get('MYKEY');

    // // re-navigate to same url to change http code
    // if (typeof window !== "undefined"
    //     && !window?.__navigated != window.location.pathname
    //    ) {
    //   console.log(`Locating to`, window.location.pathname)
    //   //navigate(location.pathname);
    //   window.__navigated = window.location.pathname
    //   window.location = window.location.pathname
    //   return ;
    // }



    //? NEED REDIRECT to aboid 404
    /* let { query, dataRoutes } = createStaticHandler(routes);
     * let remixRequest = new Request(
     *   window.location.href,
     *   //{ headers: { RENDER_TYPE: RENDER_TYPE_STATIC } }
     * )
     * console.log(`remixRequest`, remixRequest) */
    //? let context = await query(remixRequest)
    let router = createBrowserRouter(routes)   //??
        //?? createStaticRouter(dataRoutes, context);
    //console.log(`context:`, context, router)

    /* const Root = () => (
     *   <React.StrictMode>
     *     <RouterProvider router={router} />
     *   </React.StrictMode>
     * );

     * ReactDOM.createRoot(document.getElementById('app')).render(<Root />);
     */
    ReactDOM.createRoot(
      document.getElementById("app")
    ).render(
      <React.StrictMode>
        <RouterProvider router={router} fallbackElement={null} />
      </React.StrictMode>
    );


    redirect('/todos/1')
    //nw useNavigate()('/todos/2')
  } else {
    console.log(`hydrate actually`)
    let router = createBrowserRouter(routes);

    ReactDOM.hydrateRoot(
      document.getElementById("app"),
      <React.StrictMode>
        <RouterProvider router={router} fallbackElement={null} />
      </React.StrictMode>
    );
  }

}
