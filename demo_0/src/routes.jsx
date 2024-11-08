//const React = require("react");
import { json, useLoaderData } from "react-router-dom"
import App from './App.jsx'
import About from './pages/About.jsx'


export default routes = [
  {
    path: "/",
    loader() {
      return json({ message: "Welcome to React Router!" });
    },
    //element: App
    /* Component() {
     *   let data = useLoaderData();
     *   return <h1>11{data.message}</h1>
     * }, */
  },
  {
    path: "/about",
    Component: <About />
  },

];
