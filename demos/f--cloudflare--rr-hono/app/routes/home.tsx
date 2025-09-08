import { Welcome } from "../welcome/welcome";
import { Link } from "react-router";
import styles from "./home.module.css";
import type { LoaderFunctionArgs } from "react-router";

export function meta() {
  return [
    { title: "The todolist" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ context }: LoaderFunctionArgs) {
  console.log("<loader> Home");
  return {
    message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE,
  };
}

export default function Home({
  loaderData,
}: {
  loaderData: { message: string };
}) {
  console.log("<Home>", loaderData);
  return (
    <div>
      {/* <Welcome message={loaderData.message} /> */}
      <h1>Welcome</h1>
      <div className={styles.linkContainer}>
        <Link to="/todos">Todo List</Link>
      </div>
    </div>
  );
}
