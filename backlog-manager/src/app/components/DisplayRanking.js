"use client";
import React, { useState, useEffect } from "react";
import GameStats from "./GameStats";
import "../styles/display_ranking.css";

const DisplayRanking = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameStats, setGameStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(null);

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
      const response = await fetch(
        "http://128.113.126.87:5000/receive-ranking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        // Ensure games have both id and name
        const validatedGames = (data.ranked_games || []).map((game) => ({
          id: game.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
          name: game.name || `Unknown Game`,
          ...game,
        }));
        setGames(validatedGames);
      } else {
        setError(data.message || "Failed to fetch ranking");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchGameStats = async (gameId, gameName) => {
    const token = localStorage.getItem("token");
    if (!token || !gameId) {
      console.error("Missing token or game ID");
      return;
    }

    try {
      setStatsLoading(true);
      setStatsError(null);

      const response = await fetch(
        "http://128.113.126.87:5000/get-game-stats",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            game_id: gameId,
            game_name: gameName,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setGameStats({
          ...data.game_stats,
          id: gameId,
          title: gameName,
        });
      } else {
        throw new Error(data.message || "Failed to fetch game stats");
      }
    } catch (err) {
      console.error("Error fetching game stats:", err);
      setStatsError(err.message);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleGameClick = (game) => {
    if (!game?.id) {
      console.error("Game object missing ID:", game);
      return;
    }
    fetchGameStats(game.id, game.name);
  };

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
      switch (rank) {
        case 1:
          return <h1>#{rank}:</h1>;
        case 2:
          return <h2>#{rank}:</h2>;
        case 3:
          return <h3>#{rank}:</h3>;
        case 4:
          return <h4>#{rank}:</h4>;
        case 5:
          return <h5>#{rank}:</h5>;
        default:
          return <h6>#{rank}:</h6>;
      }
    };

    return (
      <div
        key={game.id}
        className={`${placeClass} has-hover-card`}
        onClick={() => handleGameClick(game)}
      >
        {renderHeading()}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleGameClick(game);
          }}
        >
          {game.name || `Game ${rank}`}
        </button>
        <div className="hover-card">
          <p>Click for details</p>
          {game.playtime && <p>Playtime: {game.playtime} hrs</p>}
          {game.completion && <p>Completion: {game.completion}%</p>}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading your ranking...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

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
                {remainingGames.map((game, index) =>
                  renderGame(game, index + 5),
                )}
              </div>
            )}
          </>
        ) : (
          <p>No games in your ranking yet.</p>
        )}
      </div>

      {gameStats && (
        <GameStats gameStats={gameStats} onClose={() => setGameStats(null)} />
      )}

      {statsLoading && (
        <div className="stats-loading">Loading game details...</div>
      )}
      {statsError && <div className="stats-error">{statsError}</div>}
    </div>
  );
};

export default DisplayRanking;
