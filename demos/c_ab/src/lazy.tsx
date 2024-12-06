import { useLoaderData } from "react-router-dom";

interface LazyLoaderData {
  name: string;
}

export const loader = async (): Promise<LazyLoaderData> => {
  await new Promise((r) => setTimeout(r, 500));
  return {
    name: 'test value'
  };
};


async function importTest() {
  const t = await import('./test')
  console.log(`t.data`, t.data)
}

function LazyPage() {
  let data = useLoaderData() as LazyLoaderData;

  console.log(`DDD:`, data)

  return (
    <>
      <h2>Lazy Route!5</h2>
      <p>Date from loader: {data.name}</p>
      <button onClick={importTest}>testload</button>
    </>
  );
}

export const element = <LazyPage />;
