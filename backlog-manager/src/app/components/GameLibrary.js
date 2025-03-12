"use client";
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/game_library.css";
import "../styles/top-buttons.css";

function changeSort(){
    //fill in later
}

function addGamePopUp(){
    //fill in later
}

const GameLibrary = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="top-buttons">
        <button onClick={() => navigate("/")}>Home Page</button>
        <button onClick={() => navigate("/create-ranking")}>
          Create Ranking
        </button>
      </div>

      <div className="game-library-box">Game Library</div>

      <div className="middle-buttons">
        <button onClick={addGamePopUp}>+ Add Game</button>
        <button onClick={changeSort}>A-Z</button>
      </div>
    </div>
  );
};

export default GameLibrary;
