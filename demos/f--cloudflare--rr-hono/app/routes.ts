// File-based routing is configured by the file system
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
