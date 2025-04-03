"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../styles/create_ranking.css";

const CreateRanking = () => {
    const router = useRouter();
    const [preferences, setPreferences] = useState({
      genres: [],
      completionTime: null,
      esrbRatings: [],
      platforms: []
    });
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }
      setLoading(false);
    }, [router]);

    const togglePreference = (type, value) => {
      setPreferences(prev => {
        const currentValues = prev[type];
        const newValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value];
        
        return {
          ...prev,
          [type]: newValues
        };
      });
      setSubmitError(null);
    };

    const handleCompletionTimeChange = (value) => {
      setPreferences(prev => ({
        ...prev,
        completionTime: value ? parseInt(value) : null
      }));
    };

    const handleSubmit = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      if (
        preferences.genres.length === 0 && 
        preferences.esrbRatings.length === 0 && 
        preferences.platforms.length === 0
      ) {
        setSubmitError("Please select at least one preference");
        return;
      }

      setSubmitLoading(true);
      setSubmitError(null);

      try {
        const response = await fetch("http://128.113.126.87:5000/parse-preferences", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            preferences: {
              ...preferences,
              // Convert arrays to comma-separated strings if backend expects that
              genre: preferences.genres.join(","),
              esrbRating: preferences.esrbRatings.join(","),
              platforms: preferences.platforms.join(",")
            }
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Failed to process preferences");
        }

        router.push("/display-ranking");
      } catch (err) {
        console.error("Submission error:", err);
        setSubmitError(err.message || "Failed to submit preferences");
      } finally {
        setSubmitLoading(false);
      }
    };

    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    const saveDefaultPreferences = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }
    
      try {
        const response = await fetch("http://128.113.126.87:5000/save-default-preferences", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            preferences: {
              ...preferences,
              genre: preferences.genres.join(","),
              esrbRating: preferences.esrbRatings.join(","),
              platforms: preferences.platforms.join(",")
            }
          }),
        });
    
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to save default preferences");
        }
        alert("Default preferences saved successfully!");
      } catch (err) {
        console.error("Save error:", err);
        alert(err.message || "Failed to save default preferences");
      }
    };

    const isSelected = (type, value) => preferences[type].includes(value);

    return (
      <div className="create-ranking-container">
        <div className="main-header">
          <h1>Create Ranking</h1>
          {(
            preferences.genres.length > 0 || 
            preferences.esrbRatings.length > 0 || 
            preferences.platforms.length > 0 || 
            preferences.completionTime
          ) && (
            <div className="selected-preferences">
              <h3>Selected Preferences:</h3>
              {preferences.genres.length > 0 && (
                <div>
                  <strong>Genres:</strong> {preferences.genres.join(", ")}
                </div>
              )}
              {preferences.esrbRatings.length > 0 && (
                <div>
                  <strong>ESRB Ratings:</strong> {preferences.esrbRatings.join(", ")}
                </div>
              )}
              {preferences.platforms.length > 0 && (
                <div>
                  <strong>Platforms:</strong> {preferences.platforms.join(", ")}
                </div>
              )}
              {preferences.completionTime && (
                <div>
                  <strong>Completion Time:</strong> {preferences.completionTime} hours
                </div>
              )}
            </div>
          )}
        </div>

        {submitError && (
          <div className="error-message">
            {submitError}
          </div>
        )}

        <div className="pref-drop-div">
          <div className="pref-dropdwn">
            <button 
              className="pref-drop-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Preferences
              <i className="fa fa-caret-down"></i>
            </button>
            
            {showDropdown && (
              <div className="dropdown-content">
                <div id="genre">
                  <p>Genre</p>
                  {[
                    "Free Online Games", 
                    "Action", 
                    "Strategy", 
                    "RPG", 
                    "Shooter", 
                    "Adventure", 
                    "Puzzle", 
                    "Racing", 
                    "Sports"
                  ].map(genre => (
                    <a 
                      key={genre}
                      className={isSelected("genres", genre) ? "selected" : ""}
                      onClick={() => togglePreference("genres", genre)}
                    >
                      {genre}
                      {isSelected("genres", genre) && <span className="checkmark">✓</span>}
                    </a>
                  ))}
                </div>
                
                <div id="completion-time">
                  <p>Completion Time (hours)</p>
                  <input 
                      type="number" 
                      min="1"
                      placeholder="Enter hours"
                      value={preferences.completionTime || ""}
                      onChange={(e) => handleCompletionTimeChange(e.target.value)}
                  />
                </div>
                
                <div id="esrb-rating">
                  <p>ESRB Rating</p>
                  {[
                    "Everyone", 
                    "Everyone 10+", 
                    "Teen", 
                    "Mature 17+", 
                    "Adults Only 18+"
                  ].map(rating => (
                    <a 
                      key={rating}
                      className={isSelected("esrbRatings", rating) ? "selected" : ""}
                      onClick={() => togglePreference("esrbRatings", rating)}
                    >
                      {rating}
                      {isSelected("esrbRatings", rating) && <span className="checkmark">✓</span>}
                    </a>
                  ))}
                </div>
                
                <div id="platforms">
                  <p>Platforms</p>
                  {[
                    "PC", 
                    "PlayStation", 
                    "Xbox", 
                    "Nintendo", 
                    "Mobile"
                  ].map(platform => (
                    <a 
                      key={platform}
                      className={isSelected("platforms", platform) ? "selected" : ""}
                      onClick={() => togglePreference("platforms", platform)}
                    >
                      {platform}
                      {isSelected("platforms", platform) && <span className="checkmark">✓</span>}
                    </a>
                  ))}
                </div>
                
                <p className="save-default" onClick={saveDefaultPreferences}>
                  Save Default
                </p>
              </div>
            )}
          </div>
        </div>

        <button 
          className="create-ranking-btn"
          onClick={handleSubmit}
          disabled={submitLoading}
        >
          {submitLoading ? "Processing..." : "Create Ranking"}
        </button>
      </div>
    );
};

export default CreateRanking;