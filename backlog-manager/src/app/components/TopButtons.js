"use client";
import React from "react";
import "../styles/top-buttons.css";

const TopButtons = ({ fixed = false }) => {
  const navigateToHome = () => {
    window.location.href = "/"; // Navigate to the home page
  };

  const navigateToCreateRanking = () => {
    window.location.href = "/create-ranking"; // Navigate to the create ranking page
  };

  const navigateToGameLibrary = () => {
    window.location.href = "/game-library";
  }

  return (
    <div className={`top-buttons ${fixed ? "fixed" : ""}`}>
      <button onClick={navigateToHome}>Home Page</button>
      <button onClick={navigateToCreateRanking}>Create Ranking</button>
      <button onClick={navigateToGameLibrary}>Game Library</button>
    </div>
  );
};

export default TopButtons;