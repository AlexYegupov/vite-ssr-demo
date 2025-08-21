import { useMemo } from "react";
import { Button } from "@radix-ui/themes";
import styles from "./welcome.module.css";
import { Logo } from "../components/logos/logo-component";

export function Welcome({ message }: { message: string }) {
  const resources = useMemo(
    () => [
      {
        href: "https://reactrouter.com/docs",
        text: "React Router Docs",
        icon: (
          <img
            src="/assets/svg/docs-icon.svg"
            className={styles["nav-icon"]}
            alt=""
            aria-hidden="true"
          />
        ),
      },
      {
        href: "https://rmx.as/discord",
        text: "Join Discord",
        icon: (
          <img
            src="/assets/svg/discord-icon.svg"
            className={styles["nav-icon"]}
            alt=""
            aria-hidden="true"
          />
        ),
      },
    ],
    []
  );

  return (
    <main className={styles.welcome}>
      <div className={styles.container}>
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <Button size="3" variant="solid" color="violet">
            Get Started
          </Button>
          <Button
            size="3"
            variant="outline"
            color="gray"
            style={{ marginLeft: "1rem" }}
          >
            Learn More
          </Button>
        </div>
        <header className={styles.header}>
          <div className={styles["logo-container"]}>
            <div className={styles["logo-wrapper"]}>
              <Logo />              
            </div>
          </div>
        </header>
        <div className={styles.content}>
          <nav className={styles.nav}>
            <p className={styles["nav-title"]}>What&apos;s next?</p>
            <ul className={styles["nav-list"]}>
              {resources.map(({ href, text, icon }) => (
                <li key={href} className={styles["nav-item"]}>
                  <a
                    className={styles["nav-link"]}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {icon}
                    {text}
                  </a>
                </li>
              ))}
              <li className={styles.message}>{message}</li>
            </ul>
          </nav>
        </div>
      </div>
    </main>
  );
}
