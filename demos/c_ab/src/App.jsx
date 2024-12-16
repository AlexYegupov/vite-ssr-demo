import { Outlet, Link, useLoaderData, redirect, useRouteError, isRouteErrorResponse } from "react-router-dom";
import { todosLoader, todoItemLoader, Todos, TodoItem } from './todos';

export const routes = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        loader: homeLoader,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "dashboard",
        loader: dashboardLoader,
        element: <Dashboard />,
      },
      {
        path: "lazy",
        lazy: () => import("./lazy"),
      },
      {
        path: "redirect",
        loader: redirectLoader,
      },
      {
        path: 'todos',
        children: [
          {
            index: true,
            loader: todosLoader,
            element: <Todos />,
          },
          {
            path: ':id',
            loader: todoItemLoader,
            element: <TodoItem />
          }
        ]
      },
      {
        path: "*",
        //loader: noMatchLoader,
        element: <NoMatch />,
        _notFound: true
      },
    ],
  },
];

function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Error {error.status}</h1>
        <p>{error.statusText}</p>
        {error.data ?? <pre>{JSON.stringify(error.data, null, 2)}</pre>}
      </div>
    )
  }

  console.error(error)
  return (
    <div>
      <h1>Unexpected Error</h1>
      <p>{error?.message || "Unknown error"}</p>
    </div>
  )
}

function Layout() {
  return (
    <div>
      <h1>Data Router Server Rendering Example</h1>

      <p>
        If you check out the HTML source of this page, you'll notice that it
        already contains the HTML markup of the app that was sent from the
        server, and all the loader data was pre-fetched!
      </p>

      <p>
        This is great for search engines that need to index this page. It's also
        great for users because server-rendered pages tend to load more quickly
        on mobile devices and over slow networks.
      </p>

      <p>
        Another thing to notice is that when you click one of the links below
        and navigate to a different URL, then hit the refresh button on your
        browser, the server is able to generate the HTML markup for that page as
        well because you're using React Router on the server. This creates a
        seamless experience both for your users navigating around your site and
        for developers on your team who get to use the same routing library in
        both places.
      </p>

      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/lazy">Lazy</Link>
          </li>
          <li>
            <Link to="/redirect">Redirect to Home</Link>
          </li>
          <li>
            <Link to="/todos">Todo list</Link>
          </li>
          <li>
            <Link to="/todos/:id">Todo list - :id </Link>
            <Link to="/todos/PPP">Todo list - PPP </Link>
            <Link to="/todos/1">Todo list - 1 </Link>
          </li>
          <li>
            <Link to="/nothing-here">Nothing Here</Link>
          </li>
        </ul>
      </nav>

      <hr />
      <div>
        ##########
        <Outlet />
        ##########
      </div>
    </div>
  );
}

//const sleep = (n = 500) => new Promise((r) => setTimeout(r, n));
const sleep = () => {}

//const rand = () => Math.round(Math.random() * 100);

async function homeLoader() {
  await sleep();
  console.log(``)
  return { data: `Home loader server data` };
}

function Home() {
  let data = useLoaderData();
  return (
    <div>
      <h2>Home!</h2>
      {/* <p>Loader Data: {data.data}</p> */}
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

async function dashboardLoader() {
  await sleep();
  return { data: `Dashboard loader server data` };
}

function Dashboard() {
  let data = useLoaderData();
  console.log(`DATA`, data)
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Loader Data: {data.data}</p>
    </div>
  );
}

async function redirectLoader() {
  await sleep();
  return redirect("/");
}

import { useLocation, useMatches, useNavigate } from "react-router-dom";

async function noMatchLoader({ request }) {
  const url = new URL(request.url)
  //const navigate = useNavigate();  // useNavigate to perform redirects
  //const location = useLocation();  // Get the current location
  //const matches = useMatches();

  //console.log(`noMatchLoader`, url, location, matches)
  /*
   *   // Check if any match was found
   *   if (matches.length > 0) {
   *     console.log(`navigating to`, url.pathname)
   *     // Redirect to the first matched route (you can refine this based on your needs)
   *     navigate(url.pathname);
   *   }
   *  */
  return null; // Ensure that loader doesn't continue processing

  /*
   *   console.log(`noMatchLoader`, request)
   *
   *   if (typeof window !== "undefined"
   *       && (window.__noMatchRedirected != request.url)
   *   ) {
   *     redirect(request.url);
   *     window.__noMatchRedirected = request.url
   *   }
   *  */
  /*
   *   return new Response(null, {
   *     status: 302,
   *     headers: { Location: url.pathname + url.search }, // Redirect to the same path and query parameters
   *   });
   *  */
}


function NoMatch() {
  console.log(`NoMatch!`)
  /* const location = useLocation();
   * const matches = useMatches();
   * const navigate = useNavigate();
   */
  const data = useLoaderData()

  /* console.log(`NoMatch`, location, matches, data)
   */
  /* if (typeof window !== "undefined" && !window.__navigated && location.pathname) {
   *   console.log(`redirecting to`, location.pathname)
   *   navigate(location.pathname);
   *   window.__navigated = 'YES'
   * } */

  // REDIRECT to ///...:id

  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
