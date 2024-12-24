# IMPLEMENTED

* SSG with:
 - multiple entrypoints
 - dynamical routes entrypoints on catch-all-redirect behavior

* routing (react-router 6)
 * hot reload with keeping react state (Vite built-in)
 * sourcemap debug (Vite built-in)
 * assets 
 * basic favicons



# DONE temporarily (need implement & document)
 * (todos->load test module[2]) dynamic lazy loading
 * chunking & dynamic loading


# TODO
 * splat paths

 * styling (allow several popular libs) & theming

 * fetch api (+react-query?)

 * tables, paginators

 * unlimited loading


 * generate(?) static routes with params

*useRouteError (https://dev.to/vikram-boominathan/react-router-routes-loaders-and-errors-1nee)

 * recursive subroutes

 * error handling cli
 * error handling serv
 * error handling cli dyn


 * fetch data & modify data (todolist probably)
 * client caching data (?tanstack-query))

 * vitest

 * login & url security (Auth.js etc?)

 * SSR|SSG + redux toolkit

 * helmet
 * internationalization

 * server caching

 * -> yc_vite_ssr-react
 * -> multidemo

 * internal: organize
 * internal: organize submodules to see on s
 * internal: think about make prerender work as caching results that actually return locally-run server (to avoid duplicate server render behavior)


 * try SSR + configure

## TODO: later
 * SSG SOME of dynamical routes (like /todos/1/index.html, todos/2/index.html but not all) statically (for faster loading for the sake of SEO)

 * web manifest

 * favicons automatically generation (from SVG probably?)

 * stage favicon
