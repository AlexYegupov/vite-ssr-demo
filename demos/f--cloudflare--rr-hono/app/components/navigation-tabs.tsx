import { useLocation, useNavigation, Link } from "react-router";
import styles from "./navigation-tabs.module.css";

export function NavigationTabs() {
  const location = useLocation();
  const navigation = useNavigation();
  const isNavigating = navigation.state === "loading";

  // Determine the active tab based on the current path
  const getActiveTab = () => {
    if (location.pathname === "/todos") return "todos";
    if (location.pathname === "/weather") return "weather";
    return "home";
  };

  const activeTab = getActiveTab();

  return (
    <>
      <nav className={styles.navigationContainer}>
        <div className={styles.tabsRoot}>
          <div className={styles.tabsList} role="tablist" aria-label="Main navigation">
            <Link
              to="/"
              className={`${styles.tabsTrigger} ${activeTab === "home" ? styles.active : ""}`}
              role="tab"
              aria-selected={activeTab === "home"}
            >
              Home
            </Link>
            <Link
              to="/todos"
              className={`${styles.tabsTrigger} ${activeTab === "todos" ? styles.active : ""}`}
              role="tab"
              aria-selected={activeTab === "todos"}
            >
              Todo List
            </Link>
            <Link
              to="/weather"
              className={`${styles.tabsTrigger} ${activeTab === "weather" ? styles.active : ""}`}
              role="tab"
              aria-selected={activeTab === "weather"}
            >
              Weather
            </Link>
          </div>
        </div>
      </nav>
      {isNavigating && (
        <div className={styles.loadingBarCenter}>
          <div className={styles.loadingProgress}></div>
        </div>
      )}
    </>
  );
}
