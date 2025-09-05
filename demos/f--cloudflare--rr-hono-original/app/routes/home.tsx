import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import type { InternalFetcher } from "../utils/internalFetch";
import { Link } from "react-router";

type LoaderContext = {
  cloudflare: {
    env: {
      VALUE_FROM_CLOUDFLARE: string;
    };
    ctx: ExecutionContext;
  };
  internalFetch: InternalFetcher;
  request: Request;
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ context }: { context: LoaderContext }) {
  const testResponse = await context.internalFetch("/test?val=home", context.request);
  console.log("<loader> Home", testResponse);
  return {
    message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE,
    testResponse,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  console.log("<Home>", loaderData);
  return (
    <>
      <Welcome message={loaderData.message} />
      <Link to="/page2">Go to Page 2</Link>
    </>
  );
}
