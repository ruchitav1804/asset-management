import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/contextprovider";
import axiosClient from "../axiosClient";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, user, token } = useStateContext();
  const navigate = useNavigate();

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    try {
      const response = await axiosClient.post("/login", {
        email,
        password,
      });

      const data = response.data;
      console.log("Login successful:", data);

      login(data.user, data.token);
      localStorage.setItem("ACCESS_TOKEN", response.data.token);

      // ✅ Check role correctly — since it's a string, not array
      if (data.user.role === "superadmin") {
        navigate("/dashboard");
      } else {
        navigate("/products");
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Login failed due to server or network error.");
      }
    }
  };

  useEffect(() => {
    if (user && token) {
      console.log("Already logged in. Redirecting...");
      if (user.role === "superadmin") {
        navigate("/dashboard");
      } else {
        navigate("/products");
      }
    }
  }, [user, token, navigate]);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-left">
          <div className="slider">
            <div className="slide active">
              <div className="caption">
                <h1>Power Transmission Solutions</h1>
                <p>Leading the industry in energy-efficient solutions.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">
          <h2>TBEA</h2>
          <h3>LOGIN</h3>
          <p>Log In To Your TBEA Account Now</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">LOG IN</button>
            <p className="message">
              Not registered? <Link to="/register">Create an account</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
