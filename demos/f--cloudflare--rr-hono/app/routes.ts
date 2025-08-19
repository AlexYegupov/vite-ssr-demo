import { type RouteConfig, index } from "@react-router/dev/routes";

// File-based routing is configured by the file system
// The catch-all route is handled by the $.tsx file in the app directory
export default [
  index("routes/home.tsx"),
] satisfies RouteConfig[];
