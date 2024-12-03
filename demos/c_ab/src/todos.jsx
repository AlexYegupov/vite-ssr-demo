import { useLoaderData } from "react-router-dom";
import React, { Suspense, useState } from 'react';


//import l from 'underscore';
const sleep = (n = 500) => new Promise((r) => setTimeout(r, n));

export async function todosLoader() {
  await sleep(0);

  return [
    {caption: 't1', done: false},
    {caption: 't2', done: true},
    {caption: 't3', done: false}
  ]
}

async function importTest() {
  const t = await import('./test')
  console.log(`t.data`, t.data)
}

const LazyComponent = React.lazy(() => import('./test-lazy-component'));


export function Todos() {
  let data = useLoaderData();

  const [lazyLoaded, setLazyLoaded] = useState(null);

  return (
    <div>
      <h2>Todos+3</h2>
      <ul>
        { data.map( (item, i) =>
          <li key={`${item.caption}-${i}`}>{item.caption}</li>
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
