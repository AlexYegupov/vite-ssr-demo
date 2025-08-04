import { Typography } from "antd";
import type { Route } from "./+types/mypage";
import styles from "./mypage.module.css";

const { Title, Paragraph } = Typography;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Page - React Router App" },
    { name: "description", content: "This is my custom page!" },
  ];
}

export default function MyPage() {
  return (
    <div className={styles.container}>
      <Title level={1} className={styles.title}>My Page</Title>
      <Paragraph className={styles.paragraph}>Welcome to your custom page!</Paragraph>
      <Paragraph className={styles.paragraph}>This is a new page with the /mypage route.</Paragraph>
      <Paragraph className={styles.paragraph}>You can navigate between pages using the main menu above.</Paragraph>
    </div>
  );
}
