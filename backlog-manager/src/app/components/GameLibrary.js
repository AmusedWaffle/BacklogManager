"use client";
import React, { useState, useEffect, useRef } from "react";
import "../styles/game_library.css";
import GameStats from "./GameStats";

const GameLibrary = () => {
  const [userGames, setUserGames] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGame, setSelectedGame] = useState({ id: "", name: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [gameStats, setGameStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(null);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    game: null
  });
  const contextMenuRef = useRef(null);
  const popupRef = useRef(null);

  // Check if user is logged in and fetch games on component mount
  // Redirects to homepage if user is not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    fetchUserGames(token);
  }, []);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close popup if clicking outside of it
      if (showPopup && popupRef.current && !popupRef.current.contains(event.target)) {
        closeGamePopup();
      }
      // Close context menu if clicking outside of it
      if (contextMenu.visible && contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setContextMenu({ ...contextMenu, visible: false });
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup, contextMenu]); // Dependencies ensure proper cleanup

  // Function to fetch game stats for pop-up
  const fetchGameStats = async (gameId) => {

    // Grab token from local storage
    const token = localStorage.getItem("token");

    // Really good error handling
    if (!token || !gameId) return;

    try {
      // There's no error & we're now loading what we need
      setStatsLoading(true);
      setStatsError(null);
      
      // Ask backend for stats
      const response = await fetch("http://128.113.126.87:5000/get-game-stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          token,
          game_id: gameId 
        }),
      });

      const data = await response.json();

      // Amazing error handling
      if (response.ok) {
        setGameStats(data.game_stats);
      } else {
        throw new Error(data.message || "Failed to fetch game stats");
      }
    } catch (err) {
      setStatsError(err.message);
    } finally {
      setStatsLoading(false);
    }
  };

  // Gets game stats on click
  const handleGameClick = (game) => {
    fetchGameStats(game.id);
  };


  // Function to load in the games a user has when page is loaded
  // Sends token as authentication for backend to check
  // Receives a JSON with the user's games from backend
  const fetchUserGames = async (token) => {
    try {

      // We're now loading relevant information
      setLoading(true);

      // Yell at backend for data
      const response = await fetch(
        "http://128.113.126.87:5000/get-games-library",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ token }),
        }
      );
  
      const data = await response.json();

      // Error handling based on response
      if (response.ok) {
        // Handle both response formats:
        const gamesArray = Array.isArray(data) ? data : data.games || [];
        setUserGames(gamesArray);
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
  // Response format: [{'id': game_id, 'name': game_name}, ...]
  const searchGames = async (query) => {

    // Grab token from local storage 
    const token = localStorage.getItem("token");

    // Rudimentary error handling
    if (!token || !query.trim()) return;

    try {

      // We're loading what we need
      setSearchLoading(true);

      // Annoy backend for data
      const response = await fetch("http://128.113.126.87:5000/search-games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, query }),
      });

      const data = await response.json();

      // Error handling + if response is good
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
    setSelectedGame({ id: "", name: "" });
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
  // Sends token for authentication along with game ID and name 
  // but NOT in the "authorization" header
  // Receives a JSON with the selected game
  const addSelectedGame = async () => {
    
    // Error handling
    if (!selectedGame.id || !selectedGame.name) {
      alert("Please select a game before adding.");
      return;
    }

    // Grab token from local storage 
    const token = localStorage.getItem("token");

    // Return to homepage if no token
    if (!token) {
      window.location.href = "/";
      return;
    }

    // Pester backend for data
    try {
      const response = await fetch("http://128.113.126.87:5000/add-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          token,
          game_id: selectedGame.id,
          game_name: selectedGame.name 
        }),
      });

      const data = await response.json();

      // Handle response + errors
      if (response.ok) {
        setUserGames([...userGames, { 
          id: selectedGame.id, 
          name: selectedGame.name 
        }]);
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

  // Handle right-click on game
  const handleGameRightClick = (e, game) => {
    e.preventDefault();
    console.log("Right-clicked game:", game); // Debug log
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      game: {
        id: game.id, 
        name: game.name
      }
    });
  };

  // Delete game from library
  const deleteGame = async () => {

    // Error handling
    if (!contextMenu.game || !contextMenu.game.id) {
      console.error("No game ID available for deletion");
      alert("Unable to delete - missing game ID");
      return;
    }
    
    // Get token from local storage
    const token = localStorage.getItem("token");

    // Return home if no token
    if (!token) {
      window.location.href = "/";
      return;
    }
  
    // Ask backend for data
    try {
      const response = await fetch("http://128.113.126.87:5000/delete-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          game_id: contextMenu.game.id,
          game_name: contextMenu.game.name
        }),
      });
  
      const data = await response.json();

      // Response handling
      if (response.ok) {
        setUserGames(userGames.filter(g => g.id !== contextMenu.game.id));
      } else {
        console.error("Delete failed:", data.message);
        alert(data.message || "Failed to delete game");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Network error. Please try again.");
    } finally {
      setContextMenu({ ...contextMenu, visible: false });
    }
  };

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
      </div>

      <div className="added-games-container">
        {userGames.length > 0 ? (
          userGames.map((game) => (
            <div 
              key={game.id}
              className="added-game"
            >
              {game.name}
              <div className="game-hover-card">
                <div onClick={() => handleGameClick(game)}>
                  <p>Click for details</p>
                </div>
                <div onContextMenu={(e) => handleGameRightClick(e, game)}>
                  Delete Game
                </div>
                {game.playtime && <p>Playtime: {game.playtime} hrs</p>}
                {game.completion && <p>Completion: {game.completion}%</p>}
              </div>
            </div>
          ))
        ) : (
          <p>No games in your library yet. Click '+ Add Game' to get started!</p>
        )}
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content" ref={popupRef}>
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
                      selectedGame.id === game.id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedGame(game)}
                  >
                    {game.name}
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
              disabled={!selectedGame.id}
            >
              + Add Selected Game
            </button>
          </div>
        </div>
      )}

    {contextMenu.visible && (
      <div
        ref={contextMenuRef}
        className="context-menu"
        style={{
          position: 'fixed',
          top: `${contextMenu.y}px`,
          left: `${contextMenu.x}px`,
        }}
      >
        <div className="context-menu-item" onClick={deleteGame}>
          Delete Game
        </div>
      </div>
    )}
    {gameStats && (
        <GameStats 
          gameStats={gameStats}
          onClose={() => setGameStats(null)}
        />
    )}
    {statsLoading && <div className="loading">Loading game details...</div>}
    {statsError && <div className="error">{statsError}</div>}
    </div>
  );
};

export default GameLibrary;