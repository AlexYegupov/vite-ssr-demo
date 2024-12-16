import { useParams } from 'react-router';
import { useLoaderData, Link } from "react-router-dom";
import React, { Suspense, useState } from 'react';
import { isRenderStatic, RENDER_TYPE, RENDER_TYPE_STATIC } from './render-utils'

//import l from 'underscore';
const sleep = (n = 500) => new Promise((r) => setTimeout(r, n));


const TODO_ITEMS = [
  {id: 1, caption: 'todo item 1', done: false},
  {id: 2, caption: 'todo item 2', done: true},
  {id: 3, caption: 'todo item 3', done: false}
]


async function importTest() {
  const t = await import('./test')
}

const LazyComponent = React.lazy(() => import('./test-lazy-component'));


export async function todosLoader({ request }) {
  await sleep(0);

  console.log(`todosLoader`, isRenderStatic(request.headers))

  return TODO_ITEMS
}

export function Todos() {
  let data = useLoaderData();

  console.log(`Todos`, data)
  const [lazyLoaded, setLazyLoaded] = useState(null);

  return (
    <div>
      <h2>Todos</h2>
      <ul>
        { data?.map( item =>
          <li key={item.id}>
            <Link to={`/todos/${item.id}`}>{item.caption}</Link>
          </li>
        )}
      </ul>

      <button onClick={importTest}>load Test module</button>

      <button onClick={() => setLazyLoaded(true)}>load Test2 module</button>
      { lazyLoaded &&
        <Suspense fallback={<div>Loading Test2Component...</div>}>
          <LazyComponent />
        </Suspense>
      }
    </div>
  );
}


export async function todoItemLoader({ request, params }) {
  console.log(`TIL0`)
  const { id } = params;

  const isStaticRender = request.headers.get(RENDER_TYPE) === RENDER_TYPE_STATIC;

  console.log(`TIL`, isStaticRender, params)

  // if (isStaticRender) {
  //   return 'need reload'
  // }

  // if (isStaticRender) { //return null
  //   //throw new Response(null, {status: 302, headers: { Location: "." } });
  //   throw new Error('Skipped todoItem for static render');
  // }

  const item = TODO_ITEMS.find(item => item.id === Number(id) )
  if (!item) {
    throw new Response("Not found", { status: 404 });
    //w throw new Error('Failed to fetch home data');
    //? new Response(null, { status: 302, headers: { Location: "/login" } });
  }

  console.log(`IIIIIIII`, {...item, AAAAAAAAAAA: 10})

  return item
}


export function TodoItem() {
  const item = useLoaderData()

  //if (!item) {
  //   redirect(window.location.pathname)

  console.log(`todoItem`, item)

  //if (!item) return; //??
  const { id, caption } = item
  return (
    <div>
      <h2>Todo item</h2>
        {caption} ({id})
    </div>
  );
}
