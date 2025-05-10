import { Link, useLocation } from "react-router-dom";
import "./DefaultLayout.css";

// PageTitle Component
const PageTitle = () => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter((part) => part !== "");

  // Get the last part of the path or default to Dashboard
  const currentPage = pathParts[pathParts.length - 1] || "Dashboard";

  // Capitalize the first letter
  const pageTitle = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

  return (
    <h2>{pageTitle}</h2>
  );
};

// Breadcrumbs Component
const Breadcrumbs = () => {
  const location = useLocation();

  const pathParts = location.pathname.split("/").filter((part) => part !== "");

  return (
    <div className="page-title-breadcrumb">
      {/* Left side - Page Title */}
      <div className="page-title">
        <PageTitle />
      </div>

      {/* Right side - Breadcrumbs */}
      <nav className="breadcrumb-container">
        <Link
          to="/dashboard"
          style={{
            textDecoration: "none",
            color: "#555",
            fontWeight: "bold",
            fontSize: "14px"
          }}
        >
          DASHBOARD
        </Link>

        {pathParts.map((part, index) => {
          const routeTo = "/" + pathParts.slice(0, index + 1).join("/");
          const name = part.toUpperCase();

          return (
            <span key={index}>
              {" "}
              &gt;{" "}
              <Link
                to={routeTo}
                style={{
                  textDecoration: "none",
                  color: index === pathParts.length - 1 ? "#000" : "#555",
                  fontWeight: index === pathParts.length - 1 ? "bold" : "normal",
                  fontSize: "14px"
                }}
              >
                {name}
              </Link>
            </span>
          );
        })}
      </nav>
    </div>
  );
};

export default Breadcrumbs;
