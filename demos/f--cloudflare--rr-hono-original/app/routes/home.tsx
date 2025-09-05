import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { Link } from "react-router";

type LoaderContext = {
  cloudflare: {
    env: {
      VALUE_FROM_CLOUDFLARE: string;
    };
    ctx: ExecutionContext;
  };
  honoApp: any;
  request: Request;
  internalFetch: any;
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ context }: { context: LoaderContext }) {
  console.log("<loader> Home");
  const testResponse = await context.internalFetch(
    "/test?val=home",
    context.request
  );
  console.log("__", testResponse);
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
