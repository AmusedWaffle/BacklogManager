"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "../styles/homepage.css";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };
  
  const navigateToLogin = () => {
        window.location.href = "/login";
    }

    const navigateToCreateAccount = () => {
        window.location.href = "/create-account";
    }

  return (
    <div className="homepage">

      <div className="login-container">
        <h2>Backlog Manager</h2>
        {isLoggedIn ? (
          <div className="button-container">
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="button-container">
            <button onClick={navigateToCreateAccount} className="signup-btn">Create Account</button>
            <button onClick={navigateToLogin} className="login-btn">Login</button>
          </div>
        )}
      </div>

      <div className="info-container">
        <div className="info-box">About</div>
        <div className="info-box">Ranking</div>
      </div>

    </div>
  );
};

export default HomePage;