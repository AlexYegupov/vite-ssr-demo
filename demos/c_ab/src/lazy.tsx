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

function LazyPage() {
  let data = useLoaderData() as LazyLoaderData;

  return (
    <>
      <h2>Lazy Route!1</h2>
      <p>Date from loader: {data.name}</p>
    </>
  );
}

export const element = <LazyPage />;
