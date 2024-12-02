import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
import ReactDOMServer from "react-dom/server";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router-dom/server.mjs";
import { useLoaderData, Link, Outlet, redirect } from "react-router-dom";
const sleep$1 = (n = 500) => new Promise((r) => setTimeout(r, n));
async function todosLoader() {
  await sleep$1(0);
  return [
    { caption: "t1", done: false },
    { caption: "t2", done: true },
    { caption: "t3", done: false }
  ];
}
function Todos() {
  let data = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h2", { children: "Todos+2" }),
    /* @__PURE__ */ jsx("ul", { children: data.map(
      (item, i) => /* @__PURE__ */ jsx("li", { children: item.caption }, `${item.caption}-${i}`)
    ) })
  ] });
}
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
        lazy: () => import("./assets/lazy-Dl82QYdp.js")
      },
      {
        path: "redirect",
        loader: redirectLoader
      },
      {
        path: "todos",
        loader: todosLoader,
        element: /* @__PURE__ */ jsx(Todos, {})
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
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/todos", children: "Todo list" }) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/nothing-here", children: "Nothing Here" }) })
    ] }) }),
    /* @__PURE__ */ jsx("hr", {}),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Outlet, {}) })
  ] });
}
const sleep = () => {
};
async function homeLoader() {
  await sleep();
  console.log(``);
  return { data: `Home loader server data` };
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
  return { data: `Dashboard loader server data` };
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
