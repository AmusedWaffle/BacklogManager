// components/GameLibrary.js
"use client";
import React from "react";
import "../styles/game_library.css";
import "../styles/top-buttons.css";

function changeSort() {
  //fill in later - ignore for now
}

function addGamePopUp() {
  //fill in later - ignore for now
}

const GameLibrary = () => {
  const navigateToHome = () => {
    window.location.href = "/"; // Navigate to the home page
  };

  const navigateToCreateRanking = () => {
    window.location.href = "/create-ranking"; // Navigate to the create ranking page
  };

  return (
    <div>
      <div className="game-library-box">Game Library</div>

      <div className="middle-buttons">
        <button onClick={addGamePopUp}>+ Add Game</button>
        <button onClick={changeSort}>A-Z</button>
      </div>
    </div>
  );
};

export default GameLibrary;