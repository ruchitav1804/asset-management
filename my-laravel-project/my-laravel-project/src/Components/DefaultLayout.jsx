import { Navigate, Outlet, Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/contextprovider";
import "./DefaultLayout.css";
import Breadcrumbs from "./Breadcrumbs";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";

export default function DefaultLayout() {
  const { user, token, loading, logout } = useStateContext();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const today = new Date();
        const dueProducts = response.data.filter((product) => {
          const addedDate = new Date(product.date_added);
          const dueDate = new Date(addedDate);
          dueDate.setMonth(addedDate.getMonth() + 1);
          return today >= dueDate;
        });

        setNotifications(dueProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/login" />;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const role = user?.role;

  return (
    <div id="defaultLayout" className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Dashboard</h2>
        <nav>
          <ul>
            {role === "superadmin" && (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <hr />
                <li><Link to="/products">Products</Link></li>
                <hr />
                <li><Link to="/vendors">Vendors</Link></li>
                <hr />
                <li><Link to="/categories">Categories</Link></li>
                <hr />
                <li><Link to="/majors">Majors</Link></li>
                <hr />
                <li><Link to="/minors">Minors</Link></li>
                <hr />
                <li><Link to="/users">Users</Link></li>
                <hr />
              </>
            )}

            {role === "admin" && (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <hr />
                <li><Link to="/products">Products</Link></li>
                <hr />
              </>
            )}

            <li><span onClick={handleLogout}>Logout</span></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="content">
        <header className="header">
          <div className="header-left">
            <h1>Admin Panel</h1>
          </div>
          <div className="header-right">
            {/* Bell Icon */}
            <div className="notification-wrapper" onClick={() => setShowNotifications(!showNotifications)}>
              <FaBell color={notifications.length > 0 ? "red" : "gray"} size={22} />
              {notifications.length > 0 && (
                <span className="bell-count">{notifications.length}</span>
              )}

              {showNotifications && (
                <div ref={notificationRef} className="notification-dropdown">
                  <div className="notification-header">
                    <strong>Notifications</strong>
                    <button onClick={() => setShowNotifications(false)}>❌</button>
                  </div>
                  <hr />
                  {notifications.length === 0 ? (
                    <div style={{ padding: "10px 0", color: "#000" }}>No notifications</div>
                  ) : (
                    notifications.map((product) => (
                      <div key={product.id} className="notification-item">
                        <Link to={`/products/edit/${product.id}`}>
                          🔧 {product.asset_number || product.description}
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          

            <span className="user-name">{user?.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <section className="breadcrumbs-container">
          <Breadcrumbs />
        </section>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
