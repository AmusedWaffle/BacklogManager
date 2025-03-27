"use client";

import React, { useState } from "react";
import "../styles/login.css";

const Login = () => {

  ///defines the form we'll send to backend
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });



  //handles form data
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //handles submitting the form with a POST request
  //receives a token from backend
  //token is stored in local browser storage
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
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
        alert("Logged in");
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("Failed");
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
        <input type="text" name="email" value={formData.email} onChange={handleChange} />
        <br /><br />

        <label htmlFor="password">Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} />
        <br /><br />

        <input type="submit" value="Login" />
      </form>
    </div>
  );
};

export default Login;