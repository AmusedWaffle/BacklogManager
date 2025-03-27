"use client";
import React from "react";
import "../styles/top-buttons.css";

// This component will be imported in every page
// Instead of copying code over and over
// Serves as navigation
const TopButtons = ({ fixed = false }) => {
  const navigateToHome = () => {
    window.location.href = "/"; // Navigate to the home page
  };

  const navigateToCreateRanking = () => {
    window.location.href = "/create-ranking"; // Navigate to the create ranking page
  };

  const navigateToGameLibrary = () => {
    window.location.href = "/game-library";
  };

  // Returns the buttons to be display
  // Position is set to fixed on the Game Library page only
  return (
    <div className={`top-buttons ${fixed ? "fixed" : ""}`}>
      <button onClick={navigateToHome}>Home Page</button>
      <button onClick={navigateToCreateRanking}>Create Ranking</button>
      <button onClick={navigateToGameLibrary}>Game Library</button>
    </div>
  );
};

export default TopButtons;
