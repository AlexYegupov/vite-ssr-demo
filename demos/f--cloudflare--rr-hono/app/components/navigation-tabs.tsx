import { useLocation, useNavigate } from "react-router";
import * as Tabs from "@radix-ui/react-tabs";
import styles from "./navigation-tabs.module.css";

export function NavigationTabs() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine the active tab based on the current path
  const getActiveTab = () => {
    if (location.pathname === "/todos") return "todos";
    if (location.pathname === "/weather") return "weather";
    return "home";
  };

  const handleTabChange = (value: string) => {
    if (value === "home") {
      navigate("/");
    } else if (value === "todos") {
      navigate("/todos");
    } else if (value === "weather") {
      navigate("/weather");
    }
  };

  return (
    <nav className={styles.navigationContainer}>
      <Tabs.Root
        className={styles.tabsRoot}
        value={getActiveTab()}
        onValueChange={handleTabChange}
      >
        <Tabs.List className={styles.tabsList} aria-label="Main navigation">
          <Tabs.Trigger className={styles.tabsTrigger} value="home">
            Home
          </Tabs.Trigger>
          <Tabs.Trigger className={styles.tabsTrigger} value="todos">
            Todo List
          </Tabs.Trigger>
          <Tabs.Trigger className={styles.tabsTrigger} value="weather">
            Weather
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
    </nav>
  );
}
