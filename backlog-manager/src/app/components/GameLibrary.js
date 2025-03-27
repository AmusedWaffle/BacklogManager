// components/GameLibrary.js
"use client";
import React, { useState, useEffect } from "react";
import "../styles/game_library.css";

const GameLibrary = () => {
  const [userGames, setUserGames] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // NOTE TO CODE REVIEWERS: This code has not been fully tested yet
  // I simply wanted to get everything committed and pushed before the code review

  // Check if user is logged in and fetch games on component mount
  // redirects to homepage if user is not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    fetchUserGames(token);
  }, []);

  // Function to load in the games a user has when page is loaded
  // sends token as authentication for backend to check
  // Receives a JSON with the user's games from backend
  const fetchUserGames = async (token) => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://128.113.126.87:5000/get-games-library",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      if (response.ok) {
        setUserGames(data.games || []);
      } else {
        setError(data.message || "Failed to fetch games");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Search games request to be used when searching for a game to add
  // Gets run when the user hits enter on the Add Game pop-up
  // Sends the token as authentication
  // Receives JSON of unowned games that match the search query
  const searchGames = async (query) => {
    const token = localStorage.getItem("token");
    if (!token || !query.trim()) return;

    try {
      setSearchLoading(true);
      const response = await fetch("http://128.113.126.87:5000/search-games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      if (response.ok) {
        setSearchResults(data.results || []);
      } else {
        setSearchResults([]);
        console.error(data.message || "Search failed");
      }
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Opens add game pop-up
  const openGamePopup = () => {
    setShowPopup(true);
    setSearchQuery("");
    setSelectedGame("");
    setSearchResults([]);
  };

  // Closes add game pop-up
  const closeGamePopup = () => {
    setShowPopup(false);
  };

  // Sends search query to backend
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchGames(searchQuery);
  };

  // Tells backend to add the selected game to the user's library
  // Sends token for authentication
  // Receives a JSON with the selected game
  const addSelectedGame = async () => {
    if (!selectedGame) {
      alert("Please select a game before adding.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    try {
      const response = await fetch("http://128.113.126.87:5000/add-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ game: selectedGame }),
      });

      const data = await response.json();
      if (response.ok) {
        setUserGames([...userGames, selectedGame]);
        closeGamePopup();
      } else {
        alert(data.message || "Failed to add game");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  // Loading page for the game library
  if (loading) {
    return <div className="loading">Loading your game library...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Returns a row of button in the middle of the screen
  // One displays the add game pop-up
  // The other changes the ordering of the displayed game <-- not functional yet
  // Also displays added games in the user's library below the button
  // Also returns the pop-up
  return (
    <div>
      <div className="game-library-box">Game Library</div>

      <div className="middle-buttons">
        <button onClick={openGamePopup}>+ Add Game</button>
        <button onClick={() => {}}>A-Z</button>
      </div>

      <div className="added-games-container">
        {userGames.length > 0 ? (
          userGames.map((game, index) => (
            <div key={index} className="added-game">
              {game}
            </div>
          ))
        ) : (
          <p>
            No games in your library yet. Click '+ Add Game' to get started!
          </p>
        )}
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Add Games</h2>
            <form className="search-container" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for games..."
                autoFocus
              />
              <button type="submit" className="search-button">
                {searchLoading ? "⌛" : "🔍"}
              </button>
            </form>
            <div className="search-results">
              {searchLoading ? (
                <div className="loading">Searching...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((game, index) => (
                  <div
                    key={index}
                    className={`search-result ${
                      selectedGame === game ? "selected" : ""
                    }`}
                    onClick={() => setSelectedGame(game)}
                  >
                    {game}
                  </div>
                ))
              ) : (
                <p className="no-results">
                  {searchQuery
                    ? "No games found. Try a different search."
                    : "Enter a search term to find games."}
                </p>
              )}
            </div>
            <button
              className="add-btn"
              onClick={addSelectedGame}
              disabled={!selectedGame}
            >
              + Add Selected Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameLibrary;
