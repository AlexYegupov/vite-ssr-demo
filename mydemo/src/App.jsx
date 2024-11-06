import { Link, Route, Routes } from 'react-router-dom'
import React, { useState } from 'react';


// Auto generates routes from files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
//const pages = import.meta.glob('./pages/*.jsx', { eager: true })

//console.log(`PAGES`, pages)
/*
 * const routes = Object.keys(pages).map((path) => {
 *   const name = path.match(/\.\/pages\/(.*)\.jsx$/)[1]
 *   return {
 *     name,
 *     path: name === 'Home' ? '/' : `/${name.toLowerCase()}`,
 *     component: pages[path].default,
 *   }
 * })
 *  */
// pages/my/route/page.js - /my/route/

// function generateRoutes() {
//   console.log(`P:`, import.meta.glob('./pages/**/*.jsx', { eager: true }))
//   console.log(`P2:`, import.meta.glob('./pages/**/*.js*', { eager: true }))
//
//   const pages = import.meta.glob('./pages/**/*.jsx', { eager: true });
//   const routes = Object.keys(pages).map((filePath) => {
//     const Component = pages[filePath].default;
//     /* const path = filePath
//      *   .toLowerCase()
//      *   //.match(/.pages(.*)\(.(js|jsx|ts|tsx)$/)[1]
//      *   .match(/.*pages\/(.+\/)?(.+)\.(js|jsx|ts|tsx)$/);
//      */
//     const match = path.match(/.*pages\/(?<folder>.+\/)?(?<filename>.+)\.(?<extension>js|jsx|ts|tsx)$/);
//
//
//
//
//
//       .replace('page', '')
//       .replace(/(.+)\/$/, '$1')  // remove trailing slash
//
//     return {
//       path,
//       element: <Component />,
//     };
//   });
//
//   return routes;
// }


export default function App() {
  //const routes = generateRoutes()
  return (
    <>
      App
      <nav>
        <ul>
          {/* {routes.map(({ name, path }) => {
              return (
              <li key={path}>
              <Link to={path}>{name}</Link>
              </li>
              )
              })}
            */}

        </ul>
      </nav>
      {/* { useRoutes(routes) } */}

      {/* <Routes>
          <Route key={path} path={path} element={<RouteComp />}></Route>
          </Routes> */}
    </>
  )
}
