import type { Route } from "./+types/mypage";
import styles from "./mypage.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Page - React Router App" },
    { name: "description", content: "This is my custom page!" },
  ];
}

export default function MyPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Page</h1>
      <p className={styles.paragraph}>Welcome to your custom page!</p>
      <p className={styles.paragraph}>This is a new page with the /mypage route.</p>
      <p className={styles.paragraph}>You can navigate between pages using the main menu above.</p>
    </div>
  );
}
