"use client";

import React, { useState } from "react";
import "../styles/login.css";

const Login = () => {

  ///defines the form we'll send to backend
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  //handles form data
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //handles submitting the form with a POST request
  //receives a token from backend
  //token is stored in local browser storage
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login form submitted:", formData);

    try {
      const response = await fetch("http://128.113.126.87:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Login successful!");
        // Store the token in localStorage
        localStorage.setItem("token", data.token);
        // Redirect to the home page
        window.location.href = "/";
      } else {
        setMessage(`Error: ${data.message || "Invalid email or password"}`);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage("Server error. Please try again.");
    }
  };

  //returns a main header for the page
  //and then the form and a submit button
  return (
    <div>
      <div className="main-header">
        <h1>Login</h1>
      </div>
      <form className="input-grp" onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br /><br />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input type="submit" value="Login" />
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Login;