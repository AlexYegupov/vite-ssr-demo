import { useEffect } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { Theme, ThemePanel } from "@radix-ui/themes";
import { ToastProvider } from "./context/toast-context";
import { GlobalToast } from "./components/toast";

import type { Route } from "./+types/root";
import "@radix-ui/themes/styles.css";
import styles from "./root.module.css";
import NotFound from "./$";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

console.log("LLL", styles["--space-5"]);
export function Layout({ children }: { children: React.ReactNode }) {
  const isDev = import.meta.env.DEV;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <Meta />
        <Links />
      </head>
      <body>
        <Theme appearance="dark" accentColor="sky">
          <ToastProvider>
            {children}
            <GlobalToast />
            {isDev && <ThemePanel defaultOpen={false} />}
          </ToastProvider>
        </Theme>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFound />;
  }

  // For other errors, show a generic error message
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = `Error ${error.status}`;
    details = error.statusText || details;
  } else if (error instanceof Error) {
    details = error.message;
    stack = import.meta.env.DEV ? error.stack : undefined;
  }

  return (
    <main className={styles.errorBoundary}>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
