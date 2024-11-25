import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import ReactDOMServer from "react-dom/server";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router-dom/server.mjs";
import { Link, Outlet, useLoaderData, redirect } from "react-router-dom";
const routes = [
  {
    path: "/",
    element: /* @__PURE__ */ jsx(Layout, {}),
    children: [
      {
        index: true,
        loader: homeLoader,
        element: /* @__PURE__ */ jsx(Home, {})
      },
      {
        path: "about",
        element: /* @__PURE__ */ jsx(About, {})
      },
      {
        path: "dashboard",
        loader: dashboardLoader,
        element: /* @__PURE__ */ jsx(Dashboard, {})
      },
      {
        path: "lazy",
        lazy: () => import("./assets/lazy-Bg5VQAJW.js")
      },
      {
        path: "redirect",
        loader: redirectLoader
      },
      {
        path: "env",
        element: /* @__PURE__ */ jsx(Env, {})
      },
      {
        path: "*",
        element: /* @__PURE__ */ jsx(NoMatch, {})
      }
    ]
  }
];
function Layout() {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h1", { children: "Data Router Server Rendering Example" }),
    /* @__PURE__ */ jsx("p", { children: "If you check out the HTML source of this page, you'll notice that it already contains the HTML markup of the app that was sent from the server, and all the loader data was pre-fetched!" }),
    /* @__PURE__ */ jsx("p", { children: "This is great for search engines that need to index this page. It's also great for users because server-rendered pages tend to load more quickly on mobile devices and over slow networks." }),
    /* @__PURE__ */ jsx("p", { children: "Another thing to notice is that when you click one of the links below and navigate to a different URL, then hit the refresh button on your browser, the server is able to generate the HTML markup for that page as well because you're using React Router on the server. This creates a seamless experience both for your users navigating around your site and for developers on your team who get to use the same routing library in both places." }),
    /* @__PURE__ */ jsx("nav", { children: /* @__PURE__ */ jsxs("ul", { children: [
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/", children: "Home" }) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/about", children: "About" }) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/dashboard", children: "Dashboard" }) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/lazy", children: "Lazy" }) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/redirect", children: "Redirect to Home" }) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/env", children: "ENV" }) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/nothing-here", children: "Nothing Here" }) })
    ] }) }),
    /* @__PURE__ */ jsx("hr", {}),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Outlet, {}) })
  ] });
}
const sleep = () => {
};
const rand = () => Math.round(Math.random() * 100);
async function homeLoader() {
  await sleep();
  return { data: `Home loader - random value ${rand()}` };
}
function Home() {
  let data = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h2", { children: "Home" }),
    /* @__PURE__ */ jsxs("p", { children: [
      "Loader Data: ",
      data.data
    ] })
  ] });
}
function About() {
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h2", { children: "About" }) });
}
async function dashboardLoader() {
  await sleep();
  return { data: `Dashboard loader - random value ${rand()}` };
}
function Dashboard() {
  let data = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h2", { children: "Dashboard" }),
    /* @__PURE__ */ jsxs("p", { children: [
      "Loader Data: ",
      data.data
    ] })
  ] });
}
async function redirectLoader() {
  await sleep();
  return redirect("/");
}
function NoMatch() {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h2", { children: "Nothing to see here!" }),
    /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Link, { to: "/", children: "Go to the home page" }) })
  ] });
}
function Env() {
  let msg = "default message here";
  try {
    msg = process.env.MY_CUSTOM_SECRET || msg;
  } catch {
  }
  return /* @__PURE__ */ jsx("h1", { children: msg });
}
async function render(request, response) {
  let { query, dataRoutes } = createStaticHandler(routes);
  let remixRequest = createFetchRequest(request, response);
  let context = await query(remixRequest);
  if (context instanceof Response) {
    throw context;
  }
  let router = createStaticRouter(dataRoutes, context);
  return ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(React.StrictMode, { children: /* @__PURE__ */ jsx(
      StaticRouterProvider,
      {
        router,
        context,
        nonce: "the-nonce"
      }
    ) })
  );
}
async function renderStatic(url) {
  let { query, dataRoutes } = createStaticHandler(routes);
  let remixRequest = new Request(url);
  let context = await query(remixRequest);
  if (context instanceof Response) {
    throw context;
  }
  let router = createStaticRouter(dataRoutes, context);
  return ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(React.StrictMode, { children: /* @__PURE__ */ jsx(
      StaticRouterProvider,
      {
        router,
        context,
        nonce: "the-nonce"
      }
    ) })
  );
}
function createFetchRequest(req, res) {
  let origin = `${req.protocol}://${req.get("host")}`;
  let url = new URL(req.originalUrl || req.url, origin);
  let controller = new AbortController();
  res.on("close", () => controller.abort());
  let headers = new Headers();
  for (let [key, values] of Object.entries(req.headers)) {
    if (values) {
      if (Array.isArray(values)) {
        for (let value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }
  let init = {
    method: req.method,
    headers,
    signal: controller.signal
  };
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = req.body;
  }
  return new Request(url.href, init);
}
export {
  createFetchRequest,
  render,
  renderStatic,
  routes
};
