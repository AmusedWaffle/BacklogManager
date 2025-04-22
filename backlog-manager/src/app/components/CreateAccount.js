"use client";

import React, { useState } from "react";
import "../styles/create_account.css";

const CreateAccount = () => {
  // Declares the form to be submitted to backend
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  // Handles form data
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handles submitting form data
  // Sends a POST request to backend
  // Receives back login token
  // Saves it to local browser storage
  const handleSubmit = async (e) => {

    var assert = require("assert");
    assert(formData.password == formData.confirmPassword);

    e.preventDefault();
    console.log("Form submitted:", formData);

    try {
      const response = await fetch("http://128.113.126.87:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Account created successfully!");
        // Store the token in localStorage
        localStorage.setItem("token", data.token);
        // Redirect to the home page
        window.location.href = "/";
      } else {
        setMessage(`Error: ${data.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Error creating account:", error);
      setMessage("Server error. Please try again.");
    }
  };

  // Returns just a simple form asking for all required fields when
  // Creating an account
  return (
    <div>
      <div className="main-header">
        <h1>Create Account</h1>
      </div>
      <form className="input-grp" onSubmit={handleSubmit}>
        <label htmlFor="name">Display Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <br />
        <br />

        <label htmlFor="email">Email:</label>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <br />
        <br />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <br />
        <br />

        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <br />
        <br />

        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default CreateAccount;
