import type { Route } from "../+types/page2";
import { Link } from "react-router";
import { Welcome } from "../welcome/welcome";

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
  internalFetch: any;
  request: Request;
  honoApp: any;
};

export function meta() {
  return [
    { title: "Page 2" },
    { name: "description", content: "This is page 2" },
  ];
}

export async function loader({ context }: { context: LoaderContext }) {
  console.log("<loader> Page2");
  const testResponse = await context.internalFetch(
    "/test?val=page2",
    context.request
  );
  console.log("__", testResponse);
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
