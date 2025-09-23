import { Link } from "react-router";
import styles from "./home.module.css";
import type { LoaderFunctionArgs } from "react-router";
import { Button } from "@radix-ui/themes";

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
    <main className={styles.container}>
      <header>
        <h1>Welcome to the App</h1>
      </header>
      <nav className={styles.linkContainer} aria-label="Main navigation">
        <Link to="/todos" className={styles.linkButton}>
          Go to Todo List
        </Link>
        <Link to="/weather" className={`${styles.linkButton} ${styles.weatherLink}`}>
          Check Weather
        </Link>
      </nav>
    </main>
  );
}
