import { Outlet, Link, useLoaderData, redirect, useRouteError, isRouteErrorResponse } from "react-router";
import { todosLoader, todoItemLoader, todosAction, Todos, TodoItem } from './todos';
import { About } from './about';
import { Wiki } from './wiki';


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
        // catch-all redirect route (should be configured on server) for dynamic url entry poins for SSG sites
        path: "/catch-all-redirect",
        element: null
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
            action: todosAction,
            loader: todosLoader,
            element: <Todos />,
          },
          {
            path: ':id',
            loader: todoItemLoader,
            action: async ({ params, request }) => {
              let formData = await request.formData();
              console.log('todo item action', formData)
              return {'a': 10}
            },
            element: <TodoItem />
          }
        ]
      },
      {
        path: 'wiki',
        children: [
          {
            path: '*',
            element: <Wiki />
          }
        ]
      },
      {
        path: "*",
        element: <NoMatch />,
      },
    ],
  }
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
  return <Outlet />;
}

//const sleep = (n = 500) => new Promise((r) => setTimeout(r, n));
const sleep = () => {}

//const rand = () => Math.round(Math.random() * 100);

async function homeLoader() {
  await sleep();
  return { data: `Home loader server data` };
}

function Home() {
  let data = useLoaderData();
  return (
    <div>
      <h2>Home</h2>

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
            <Link to="/todos/1">Todo: 1 </Link>
          </li>
          <li>
            <Link to="/todos/UNKNOWN">Todo: unknown </Link>
          </li>
          <li>
            <Link to="/wiki/my page1/my page 2/">Splat subroutes</Link>
          </li>
          <li>
            <Link to="/nothing-here">Nothing Here</Link>
          </li>
        </ul>
      </nav>

      {/* <p>Loader Data: {data.data}</p> */}
    </div>
  );
}

async function dashboardLoader() {
  await sleep();
  return { data: `Dashboard loader server data` };
}

function Dashboard() {
  let data = useLoaderData();
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Loader Data: {data.data}</p>
    </div>
  );
}

async function redirectLoader({ request }) {
  const url = new URL(request.url);
  const to = url.searchParams.get("to") || '/';
  console.log(`redirectLoader`, to)

  return redirect(to);
}


function NoMatch() {
  console.log(`NoMatch!`)
  const data = useLoaderData()

  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
