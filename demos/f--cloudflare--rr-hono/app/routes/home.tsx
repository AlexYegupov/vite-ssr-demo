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
    <main className={styles.container}>
      <header>
        <h1>Welcome to the App</h1>
      </header>
      <section className={styles.content}>
        <p className={styles.description}>
          Use the navigation tabs above to explore different sections of the app.
        </p>
        <div className={styles.cardGrid}>
          <Link to="/todos" className={styles.card}>
            <h2>📝 Todo List</h2>
            <p>Manage your daily tasks and stay organized</p>
          </Link>
          <Link to="/weather" className={styles.card}>
            <h2>🌤️ Weather</h2>
            <p>Check weather forecasts for cities worldwide</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
