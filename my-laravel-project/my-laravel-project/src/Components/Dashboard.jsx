import React, { useEffect, useState } from "react";
import { useStateContext } from "../contexts/contextprovider";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useStateContext();
  const [counts, setCounts] = useState({
    products: 0,
    vendors: 0,
    majors: 0,
    minors: 0,
    categories: 0,
  });

  useEffect(() => {
    axiosClient.get("/dashboard-counts")
      .then(({ data }) => {
        setCounts(data);
      })
      .catch((err) => console.error("Error loading dashboard counts:", err));
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="welcome-message">Welcome, {user?.name}!</h1>
        <p className="role-info">
          Your Role: <strong>{user?.role}</strong>
        </p>

        {/* ✅ Count Cards */}
        <div className="counts-grid">
          <div className="count-card">Products: <strong>{counts.products}</strong></div>
          <div className="count-card">Vendors: <strong>{counts.vendors}</strong></div>
          <div className="count-card">Majors: <strong>{counts.majors}</strong></div>
          <div className="count-card">Minors: <strong>{counts.minors}</strong></div>
          <div className="count-card">Categories: <strong>{counts.categories}</strong></div>
        </div>

        {user?.role === "admin" && (
          <div className="panel admin-panel">
            <h2>Admin Panel</h2>
            <ul>
              <li><Link to="/products">Manage Products</Link></li>
              <li><Link to="/categories">Manage Categories</Link></li>
              <li><Link to="/users">Manage Users</Link></li>
            </ul>
          </div>
        )}

        {user?.role === "superadmin" && (
          <div className="panel superadmin-panel">
            <h2>Superadmin Panel</h2>
            <ul>
              <li><Link to="/vendors">Manage Vendors</Link></li>
              <li><Link to="/majors">Manage Majors</Link></li>
              <li><Link to="/minors">Manage Minors</Link></li>
              <li><Link to="/users">Manage All Users</Link></li>
            </ul>
          </div>
        )}

        <div className="panel general-panel">
          <h2>General Links</h2>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/profile">My Profile</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
