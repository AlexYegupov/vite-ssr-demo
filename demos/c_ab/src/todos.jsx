import { useLoaderData } from "react-router-dom";

const sleep = (n = 500) => new Promise((r) => setTimeout(r, n));


export async function todosLoader() {
  await sleep(0);

  return [
    {caption: 't1', done: false},
    {caption: 't2', done: true},
    {caption: 't3', done: false}
  ]
}

export function Todos() {
  let data = useLoaderData();
  return (
    <div>
      <h2>Todos+2</h2>
      <ul>
        { data.map( (item, i) =>
          <li key={`${item.caption}-${i}`}>{item.caption}</li>
        )}
      </ul>
    </div>
  );
}
