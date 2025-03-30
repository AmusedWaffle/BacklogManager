// components/DisplayRanking.js
"use client";
import React, { useState, useEffect } from "react";
import "../styles/display-ranking.css";

const DisplayRanking = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    fetchRanking(token);
  }, []);

  const fetchRanking = async (token) => {
    try {
      setLoading(true);
      const response = await fetch("http://128.113.126.87:5000/receive-ranking"/*, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }*/);

      //const data = await response.json();
      if (response.ok) {
        setGames(data.ranking || []);
      } else {
        setError(data.message || "Failed to fetch ranking");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading your ranking...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const renderGame = (game, index) => {
    const rank = index + 1;
    let placeClass = "";
    
    if (rank === 1) placeClass = "frst-plce";
    else if (rank === 2) placeClass = "scnd-plce";
    else if (rank === 3) placeClass = "thrd-plce";
    else if (rank === 4) placeClass = "frth-plce";
    else if (rank === 5) placeClass = "ffth-plce";
    else placeClass = "remaining-game";

    const renderHeading = () => {
      switch(rank) {
        case 1: return <h1>#{rank}:</h1>;
        case 2: return <h2>#{rank}:</h2>;
        case 3: return <h3>#{rank}:</h3>;
        case 4: return <h4>#{rank}:</h4>;
        case 5: return <h5>#{rank}:</h5>;
        default: return <h6>#{rank}:</h6>;
      }
    };

    return (
      <div key={index} className={placeClass}>
        {renderHeading()}
        <button>{game.name || `Game ${rank}`}</button>
      </div>
    );
  };

  const topGames = games.slice(0, 3);
  const middleGames = games.slice(3, 5);
  const remainingGames = games.slice(5);

  return (
    <div className="ranking-container">
      <div className="main-header">
        <h1>My Ranking</h1>
      </div>

      <div className="ranking-order">
        {games.length > 0 ? (
          <>
            <div className="top-3">
              {topGames.map((game, index) => renderGame(game, index))}
            </div>
            
            {games.length > 3 && (
              <div className="bottom-4-5">
                {middleGames.map((game, index) => renderGame(game, index + 3))}
              </div>
            )}
            
            {games.length > 5 && (
              <div className="remaining-games">
                {remainingGames.map((game, index) => renderGame(game, index + 5))}
              </div>
            )}
          </>
        ) : (
          <p>No games in your ranking yet.</p>
        )}
      </div>
    </div>
  );
};

export default DisplayRanking;