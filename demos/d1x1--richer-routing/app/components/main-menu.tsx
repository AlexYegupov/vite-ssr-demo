import { Link, useLocation } from "react-router";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import styles from "./main-menu.module.css";

export function MainMenu() {
  const location = useLocation();
  
  const menuItems: MenuProps["items"] = [
    {
      key: "/",
      label: <Link to="/">Home</Link>,
    },
    {
      key: "/mypage",
      label: <Link to="/mypage">My Page</Link>,
    },
  ];

  return (
    <nav className={styles.menuContainer}>
      <div className={styles.menuContent}>
        <div className={styles.logo}>
          React Router App
        </div>
        
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ 
            flex: 1, 
            backgroundColor: "transparent",
            borderBottom: "none"
          }}
        />
      </div>
    </nav>
  );
}
