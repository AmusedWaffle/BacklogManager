"use client";

import React from "react";
import Link from "next/link";
import "../styles/homepage.css";

const HomePage = () => {
  return (
    <div className="homepage">
        <div className="top-buttons">
            <button>Game Library</button>
            <button>Create Ranking</button>
        </div>

        <div className="login-container">
            <h2>Backlog Manager</h2>
            <div className="button-container">

                <Link href="/create-account" passHref>
                    <button className="signup-btn">Create Account</button>
                </Link>
            
                <button className="login-btn">Login</button>
            </div>
        </div>

        <div className="info-container">
            <div className="info-box">About</div>
            <div className="info-box">Ranking</div>
        </div>
    </div>
  );
};

export default HomePage;
