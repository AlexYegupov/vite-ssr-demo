import { Outlet, Link, redirect, useRouteError, isRouteErrorResponse, useParams, useLoaderData, useFetcher, Form, useNavigation } from "react-router";
import React, { Suspense, useState } from 'react';
import { isRenderStatic, RENDER_TYPE, RENDER_TYPE_STATIC } from './render-utils'

import { addTodo, deleteTodo, getTodos } from "./todos";

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
        action: todosAction,
        loader: todosLoader,
        Component: TodosList,
        ErrorBoundary: TodosBoundary,
        children: [
          {
            path: ':id',
            /* loader: todoItemLoader, */
            /* action: async ({ params, request }) => {
             *   let formData = await request.formData();
             *   console.log('todo item action', formData)
             *   return {'a': 10}
             * }, */
            loader: todoLoader,
            Component: Todo,
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

/////////
// Todos
export async function todosAction({ request }) {
  await sleep();

  let formData = await request.formData();

  // Deletion via fetcher
  if (formData.get("action") === "delete") {
    let id = formData.get("todoId");
    if (typeof id === "string") {
      deleteTodo(id);
      return { ok: true };
    }
  }

  // Addition via <Form>
  let todo = formData.get("todo");
  if (typeof todo === "string") {
    addTodo(todo);
  }

  return new Response(null, {
    status: 302,
    headers: { Location: "/todos" },
  });
}

export async function todosLoader() {
  console.log(`todosLoader`)
  await sleep();
  return getTodos();
}

export function TodosList() {
  let todos = useLoaderData();
  let navigation = useNavigation();
  let formRef = React.useRef(null);

  // If we add and then we delete - this will keep isAdding=true until the
  // fetcher completes it's revalidation
  let [isAdding, setIsAdding] = React.useState(false);
  React.useEffect(() => {
    if (navigation.formData?.get("action") === "add") {
      setIsAdding(true);
    } else if (navigation.state === "idle") {
      setIsAdding(false);
      formRef.current?.reset();
    }
  }, [navigation]);

  return (
    <>
      <h2>Todos</h2>
      <p>
        This todo app uses a &lt;Form&gt; to submit new todos and a
        &lt;fetcher.form&gt; to delete todos. Click on a todo item to navigate
        to the /todos/:id route.
      </p>
      <ul>
        <li>
          <Link to="/todos/junk">
            Click this link to force an error in the loader
          </Link>
        </li>
        {Object.entries(todos).map(([id, todo]) => (
          <li key={id}>
            <TodoItem id={id} todo={todo} />
          </li>
        ))}
      </ul>
      <Form method="post" ref={formRef}>
        <input type="hidden" name="action" value="add" />
        <input name="todo"></input>
        <button type="submit" disabled={isAdding}>
          {isAdding ? "Adding..." : "Add"}
        </button>
      </Form>
      <Outlet />
    </>
  );
}

export function TodosBoundary() {
  let error = useRouteError();
  return (
    <>
      <h2>Error 💥</h2>
      <p>{error.message}</p>
    </>
  );
}

export function TodoItem({ id, todo }) {
  let fetcher = useFetcher();

  let isDeleting = fetcher.formData != null;
  return (
    <>
      <Link to={`/todos/${id}`}>{todo}</Link>
    &nbsp;
    <fetcher.Form method="post" style={{ display: "inline" }}>
      <input type="hidden" name="action" value="delete" />
      <button type="submit" name="todoId" value={id} disabled={isDeleting}>
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </fetcher.Form>
    </>
  );
}

export async function todoLoader({ params }) {
  await sleep();
  let todos = getTodos();
  if (!params.id) {
    throw new Error("Expected params.id");
  }
  let todo = todos[params.id];
  if (!todo) {
    throw new Error(`Uh oh, I couldn't find a todo with id "${params.id}"`);
  }
  return todo;
}

export function Todo() {
  let params = useParams();
  let todo = useLoaderData();
  return (
    <>
      <h2>Nested Todo Route:</h2>
      <p>id: {params.id}</p>
      <p>todo: {todo}</p>
    </>
  );
}
