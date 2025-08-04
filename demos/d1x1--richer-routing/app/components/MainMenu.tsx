import { Link, useLocation } from "react-router";

export function MainMenu() {
  const location = useLocation();
  
  const menuItems = [
    { path: "/", label: "Home" },
    { path: "/mypage", label: "My Page" }
  ];

  return (
    <nav style={{
      backgroundColor: "#f8f9fa",
      borderBottom: "1px solid #dee2e6",
      padding: "1rem 0",
      marginBottom: "2rem"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 1rem",
        display: "flex",
        gap: "2rem",
        alignItems: "center"
      }}>
        <div style={{
          fontSize: "1.25rem",
          fontWeight: "bold",
          color: "#495057"
        }}>
          React Router App
        </div>
        
        <ul style={{
          display: "flex",
          gap: "1.5rem",
          listStyle: "none",
          margin: 0,
          padding: 0
        }}>
          {menuItems.map(({ path, label }) => {
            const isActive = location.pathname === path;
            return (
              <li key={path}>
                <Link
                  to={path}
                  style={{
                    textDecoration: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    color: isActive ? "#fff" : "#007bff",
                    backgroundColor: isActive ? "#007bff" : "transparent",
                    border: isActive ? "none" : "1px solid #007bff",
                    transition: "all 0.2s ease",
                    display: "inline-block"
                  }}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
