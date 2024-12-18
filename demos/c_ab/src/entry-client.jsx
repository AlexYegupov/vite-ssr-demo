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
  const CLIENT_RENDER_URL_PARAM = 'url'
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  console.log(`hydrate()`, url, window.location, params, window.__staticRouterHydrationData)

  // render on client specific url without hydrating
  const clientRenderUrl = params.get(CLIENT_RENDER_URL_PARAM)

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

  //1
  // // reload page same url (to fix 404 code) with client-side only rendering
  // if (params.get('__noHydrate')) {
  //   console.log(`__noHydrate param`)
  //
  //
  //   // replace url to "to" param but without actually redirecting
  //   //const newUrl = '/todos/3' //window.location.pathname;
  //   window.history.replaceState(null, '', '/todos/3')
  //
  //   //nw window.location.replace("/dashboard");
  //
  //   console.log(`after replaced url:`, window.location.pathname)
  //
  //   // hack: ignore data for hydrating (because use client render)
  //   window.__staticRouterHydrationData = undefined
  //
  //   let router = createBrowserRouter(routes)   //??
  //   //?? createStaticRouter(dataRoutes, context);
  //
  //   ReactDOM.createRoot(
  //     document.getElementById("app")
  //   ).render(
  //     <React.StrictMode>
  //       <RouterProvider router={router} fallbackElement={null} />
  //     </React.StrictMode>
  //   );
  //
  //
  //   //redirect('/dashboard')
  //
  //   return
  // }




  // EXP:
  const matches = matchRoutes(routes, window.location)
  console.log(`matches`, matches)

  const isRouteMatched = !matches.some(m => m.route._notFound)
  console.log(`isRouteMatched:`, isRouteMatched, window.__notFound)

  if (clientRenderUrl) {
    // hack: ignore hydrate data
    window.__staticRouterHydrationData = undefined

    window.history.replaceState(null, '', clientRenderUrl)

    //? let context = await query(remixRequest)
    let router = createBrowserRouter(routes)   //??
    //?? createStaticRouter(dataRoutes, context);
    //console.log(`context:`, context, router)

    ReactDOM.createRoot(
      document.getElementById("app")
    ).render(
      <React.StrictMode>
        <RouterProvider router={router} fallbackElement={null} />
      </React.StrictMode>
    );

    return
  }

  // If url is mathing any route then refresh this page with flag
  if (window.__notFound && isRouteMatched) {

    console.log(`404 but route matched. Rendering on client side`)

    //?? Createstaticrouter(dataRoutes, context);
    //console.log(`context:`, context, router)

    // ?? no need when redirecting
    //window.__staticRouterHydrationData = undefined

    //1 url.searchParams.set('__noHydrate', '1');
    // return ;
    // hack to ignore rendered data for hydration

    const redirectToClientRenderParams = new URLSearchParams({
      [CLIENT_RENDER_URL_PARAM]: url.pathname,
    })


    // redirect same url (to change 404 to 200)
    //url.searchParams.set('__noHydrate', 1)
    //1 window.location = '/?__noHydrate=1'
    window.location = '/?' + redirectToClientRenderParams.toString()
    return ;

    //window.history.pushState(null, '', '/todos/3')
    //window.history.replaceState(null, '', '/todos/3')
    //window.location.replace("/todos/3");

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


    //nw? redirect('/todos/1')
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
