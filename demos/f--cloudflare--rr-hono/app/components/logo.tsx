import styles from "./logo.module.css";

export function Logo() {
  return (
    <div className={styles.logoContainer}>
      <span className={styles.logoText}>DEMO</span>
    </div>
  );
}
