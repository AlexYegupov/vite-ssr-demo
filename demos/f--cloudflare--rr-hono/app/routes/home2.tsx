import { Welcome } from "../welcome/welcome";
import { Link } from "react-router";

export function meta() {
  return [
    { title: "The todolist  dffdsdsf" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export function loader({
  context,
}: {
  context: { cloudflare: { env: { VALUE_FROM_CLOUDFLARE: string } } };
}) {
  return { message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE };
}

export default function Home({
  loaderData,
}: {
  loaderData: { message: string };
}) {
  return (
    <div>
      home2
      <Welcome message={loaderData.message} />
      <div>
        <Link to="/todos">Todo List</Link>
        <br />
        <Link to="/dead">dead link</Link>
      </div>
    </div>
  );
}
