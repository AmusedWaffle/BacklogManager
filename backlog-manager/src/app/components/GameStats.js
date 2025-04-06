"use client";
import React from "react";
import "../styles/game_stats.css";

const GameStats = ({ gameStats, onClose }) => {
  if (!gameStats) return null;

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="game-popup">
        <div className="popup-header">
          <h2>{gameStats.title}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="popup-body">
          {gameStats.cover && (
            <img src={gameStats.cover} alt="Game Cover" className="game-cover" />
          )}
          
          <div className="game-details">
            {gameStats.releaseDate && (
              <p><strong>Released:</strong> {gameStats.releaseDate}</p>
            )}
            
            {gameStats.developer && (
              <p><strong>Developer:</strong> {gameStats.developer}</p>
            )}

            {gameStats.rating && (
                <p><strong>ESRB Rating:</strong> {gameStats.rating}</p>
            )}

            {gameStats.platforms && (
                <p><strong>Platforms:</strong> {gameStats.platforms}</p>
            )}

            {gameStats.genres && (
                <p><strong>Genres:</strong> {gameStats.genres}</p>
            )}
            
            <div className="reviews-section">
              <h3>Player Reviews</h3>
              {gameStats.reviews?.length > 0 ? (
                <div className="review-stats">
                  {gameStats.reviews.map((review, index) => (
                    <div key={index} className="review-category">
                      <div className="review-header">
                        <span className="review-title">{review.title}</span>
                        <span className="review-percent">{review.percent}%</span>
                      </div>
                      <div className="review-bar">
                        <div 
                          className="review-bar-fill"
                          style={{ width: `${review.percent}%` }}
                        ></div>
                      </div>
                      <div className="review-count">({review.count} players)</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No review data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameStats;