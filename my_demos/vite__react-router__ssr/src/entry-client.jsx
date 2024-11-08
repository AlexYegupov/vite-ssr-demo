import * as React from "react";
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'

import { routes } from "./routes"

let router = createBrowserRouter(routes)

ReactDOM.hydrateRoot(
    document.getElementById("app"),
    <React.StrictMode>
      <RouterProvider router={router} fallbackElement={null} />
    </React.StrictMode>
)
console.log('hydrated')
