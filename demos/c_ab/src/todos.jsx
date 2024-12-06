import { useParams } from 'react-router';
import { useLoaderData, Link } from "react-router-dom";
import React, { Suspense, useState } from 'react';


//import l from 'underscore';
const sleep = (n = 500) => new Promise((r) => setTimeout(r, n));


const TODO_ITEMS = [
  {id: 1, caption: 'todo item 1', done: false},
  {id: 2, caption: 'todo item 2', done: true},
  {id: 3, caption: 'todo item 3', done: false}
]

export async function todosLoader() {
  await sleep(0);

  return TODO_ITEMS
}


export async function todoItemLoader({ params }) {
  const { id } = params;
  console.log(`!!`,id)
  return TODO_ITEMS.find(item => item.id === Number(id) )
}

async function importTest() {
  const t = await import('./test')
}

const LazyComponent = React.lazy(() => import('./test-lazy-component'));


export function Todos() {
  let data = useLoaderData();
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


export function TodoItem() {
  console.log(`TI:`, useLoaderData())
  const { id, caption } = useLoaderData()
  return (
    <div>
      <h2>Todo item</h2>
        {caption} ({id})
    </div>
  );
}
