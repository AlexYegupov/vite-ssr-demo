import type { Route } from "./+types/mypage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Page - React Router App" },
    { name: "description", content: "This is my custom page!" },
  ];
}

export default function MyPage() {
  return (
    <div style={{ 
      fontFamily: "system-ui, sans-serif", 
      lineHeight: "1.8",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 1rem"
    }}>
      <h1>My Page</h1>
      <p>Welcome to your custom page!</p>
      <p>This is a new page with the /mypage route.</p>
      <p>You can navigate between pages using the main menu above.</p>
    </div>
  );
}
