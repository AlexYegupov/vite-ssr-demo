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
            className={styles.navIcon}
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
            className={styles.navIcon}
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
        <div className={styles.buttonContainer}>
          <Button size="3" variant="solid" color="violet">
            Get Started
          </Button>
          <Button
            size="3"
            variant="outline"
            color="gray"
            className={styles.secondaryButton}
          >
            Learn More
          </Button>
        </div>
        <header className={styles.header}>
          <div className={styles.logoContainer}>
            <div className={styles.logoWrapper}>
              <Logo />              
            </div>
          </div>
        </header>
        <div className={styles.content}>
          <nav className={styles.nav}>
            <p className={styles.navTitle}>What&apos;s next?</p>
            <ul className={styles.navList}>
              {resources.map(({ href, text, icon }) => (
                <li key={href} className={styles.navItem}>
                  <a
                    className={styles.navLink}
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
