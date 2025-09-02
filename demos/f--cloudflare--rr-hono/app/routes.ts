/* import { index, layout, route } from "@react-router/dev/routes";

export default [
  layout("layouts/book-layout.jsx", [
    index("routes/books.jsx"),
    route("book/:bookId", "routes/bookId.jsx"),
    route("genre/:genreId", "routes/genreId.jsx"),
  ]),
];
 */

import {
  type RouteConfig,
  route,
  index,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("home2", "routes/home2.tsx"),
  route("todos", "routes/todos.tsx"),
  route("todo3", "routes/todo3.tsx"),

  /*   layout("./auth/layout.tsx", [
    route("login", "./auth/login.tsx"),
    route("register", "./auth/register.tsx"),
  ]),

  ...prefix("concerts", [
    index("./concerts/home.tsx"),
    route(":city", "./concerts/city.tsx"),
    route("trending", "./concerts/trending.tsx"),
  ]), */
] satisfies RouteConfig;

/* // File-based routing is configured by the file system
// The catch-all route is handled by the $.tsx file in the app directory
export default [
  {
    path: "/",
    file: "./routes/home.tsx",
  },
  {
    path: "/todos",
    file: "./routes/todos.tsx",
  },
];
 */
