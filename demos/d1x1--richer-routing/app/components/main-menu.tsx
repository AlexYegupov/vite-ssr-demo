import { Link, useLocation } from "react-router";
import styles from "./main-menu.module.css";

export function MainMenu() {
  const location = useLocation();
  
  const menuItems = [
    { path: "/", label: "Home" },
    { path: "/mypage", label: "My Page" },
  ];

  return (
    <nav className={styles.menuContainer}>
      <div className={styles.menuContent}>
        <div className={styles.logo}>
          React Router App
        </div>
        
        <ul className={styles.menuItems}>
          {menuItems.map((item) => (
            <li key={item.path} className={styles.menuItem}>
              <Link 
                to={item.path} 
                className={`${styles.menuLink} ${location.pathname === item.path ? styles.menuLinkActive : ''}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
