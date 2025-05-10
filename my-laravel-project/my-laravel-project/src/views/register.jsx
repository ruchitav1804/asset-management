import { Link } from "react-router-dom";
import "./register.css";
import { useRef } from "react";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";

export default function Register() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef(); // Added confirm password field

  const { setUser, setToken } = useStateContext();

  const Submit = async (ev) => {
    ev.preventDefault();
    try {
      // Send POST request to Laravel backend for user registration
      const response = await axiosClient.post("/register", {
        name: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
        password_confirmation: confirmPasswordRef.current.value, // Include password confirmation
      });

      // Set user data and token in context for global state management
      setUser(response.data.user);
      setToken(response.data.token);
      
      // Redirect user to dashboard or home after successful registration
      navigate("/login"); // Adjust URL as needed

    } catch (error) {
      if (error.response) {
        console.log("Server Error:", error.response.data);
        alert(error.response.data.errors || "Registration failed!");
      } else {
        alert("Successfull Registration");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-left">
          <div className="content">
            <h1>TBEA</h1>
            <h2>Power Transmission and Transformation Industry</h2>
            <p>Leader in Energy-Saving Power Transmission and Transformation</p>
          </div>
        </div>

        <div className="register-right">
          <h2 className="form-title">Register</h2>
          <form onSubmit={Submit}>
            <input ref={nameRef} type="text" placeholder="Name" required />
            <input ref={emailRef} type="email" placeholder="Email" required />
            <input ref={passwordRef} type="password" placeholder="Password" required />
            <input ref={confirmPasswordRef} type="password" placeholder="Confirm Password" required />
            <button type="submit">Register</button>
            <p className="message">
              Already registered? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
