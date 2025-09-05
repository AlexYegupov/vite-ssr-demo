import type { Route } from "../+types/page2";
import { Link } from "react-router";
import { Welcome } from "../welcome/welcome";
import type { InternalFetcher } from "../utils/internalFetch";

type ComponentProps = {
  loaderData: {
    message: string;
  };
};

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

export function meta() {
  return [
    { title: "Page 2" },
    { name: "description", content: "This is page 2" },
  ];
}

export async function loader({ context }: { context: LoaderContext }) {
  const testResponse = await context.internalFetch(
    "/test?val=page2",
    context.request
  );
  console.log("<loader> Page2", testResponse);
  return {
    message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE,
    testResponse,
  };
}

export default function Page2({ loaderData }: ComponentProps) {
  console.log("<Page2>", loaderData);
  return (
    <div>
      <h1>Page 2</h1>
      {/* <Welcome message={loaderData.message} /> */}
      <Link to="/">Back to Home</Link>
    </div>
  );
}
