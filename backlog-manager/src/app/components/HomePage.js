"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "../styles/homepage.css";

const HomePage = () => {
  // To keep track of if the user is logged in or not
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Sets isLoggedIn when it detects a token in local storage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Removes the token from local storage; logs user out
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const navigateToLogin = () => {
    window.location.href = "/login";
  };

  const navigateToCreateAccount = () => {
    window.location.href = "/create-account";
  };

  // Returns a set of buttons at the top (to be removed when I merge my SCRUM-40 branch)
  // Returns a main container in the center with our title
  // Also displays either Login/Create Account button
  // Or if a token is detected, a logout button
  // Also displays boxes at the bottom where we'll eventually explain the website
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
            <button onClick={navigateToCreateAccount} className="signup-btn">
              Create Account
            </button>
            <button onClick={navigateToLogin} className="login-btn">
              Login
            </button>
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
