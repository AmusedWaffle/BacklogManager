"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../styles/create_ranking.css";

const CreateRanking = () => {
  // Remnant of trying to figure out React routing
  const router = useRouter();

  // Data structure to hold user preferences
  const [preferences, setPreferences] = useState({
    genres: [],
    completionTime: null,
    esrbRatings: [],
    platforms: [],
    useReviews: false,
  });

  // Booleans for loading states
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    // Gets default preferences user previously stored
    const fetchDefaultPreferences = async () => {
      // On page load, check for token
      const token = localStorage.getItem("token");

      // Return home if no token - meaning if not logged in
      if (!token) {
        router.push("/");
        return;
      }

      // If all is well then yell at backend for data
      try {
        const response = await fetch(
          "http://128.113.126.87:5000/get-default-preferences",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          },
        );

        const data = await response.json();

        // Handle response + error handling
        if (response.ok && data.preferences) {
          setPreferences({
            genres: data.preferences.genre?.split(",") || [],
            completionTime: data.preferences.completionTime || null,
            esrbRatings: data.preferences.esrbRating?.split(",") || [],
            platforms: data.preferences.platforms?.split(",") || [],
            useReviews: data.preferences.use_reviews || false,
          });
        }
      } catch (err) {
        console.error("Error fetching default preferences:", err);
      } finally {
        // Only once we've gotten the preferences is loading finished
        setLoading(false);
      }
    };

    // Then actually call the function
    fetchDefaultPreferences();
  }, [router]);

  // Adds the selected preference visually and under the hood to send to backend
  const togglePreference = (type, value) => {
    setPreferences((prev) => {
      // Previous selected values
      const currentValues = prev[type];

      // If value is already selected, remove it
      // If not, then add it
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [type]: newValues,
      };
    });
    setSubmitError(null);
  };

  // Adds the option to use reviews
  const toggleUseReviews = () => {
    setPreferences((prev) => ({
      ...prev,
      useReviews: !prev.useReviews,
    }));
  };

  // Adds completion time to selected preferences
  const handleCompletionTimeChange = (value) => {
    setPreferences((prev) => ({
      ...prev,
      completionTime: value ? parseInt(value) : null,
    }));
  };

  // Sends preferences to backend
  const handleSubmit = async () => {
    // Error checks if preferences have been accepted
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

    const token = localStorage.getItem("token");

    // Send data to backend
    try {
      const response = await fetch(
        "http://128.113.126.87:5000/parse-preferences",
        {
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
              platforms: preferences.platforms.join(","),
              use_reviews: preferences.useReviews,
            },
          }),
        },
      );

      const data = await response.json();

      // Makes sure the response is okay
      if (!response.ok) {
        throw new Error(data.message || "Failed to process preferences");
      }

      // Then take us to display the ranking
      // Display ranking page will receive the data from backend
      router.push("/display-ranking");
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitError(err.message || "Failed to submit preferences");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Defines loading page
  // Not that this is a lot of HTML
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Allows user to save their current selected preferences as default
  const saveDefaultPreferences = async () => {
    const token = localStorage.getItem("token");

    // Send preferences data to backend
    try {
      const response = await fetch(
        "http://128.113.126.87:5000/save-default-preferences",
        {
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
              platforms: preferences.platforms.join(","),
              use_reviews: preferences.useReviews,
            },
          }),
        },
      );

      const data = await response.json();

      // Check response
      if (!response.ok) {
        throw new Error(data.message || "Failed to save default preferences");
      }
      alert("Default preferences saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      alert(err.message || "Failed to save default preferences");
    }
  };

  // Keeps track of which preferences have been selected
  const isSelected = (type, value) => preferences[type].includes(value);

  return (
    <div className="create-ranking-container">
      <div className="main-header">
        <h1>Create Ranking</h1>
        {((preferences.genres && preferences.genres.length > 0) ||
          (preferences.esrbRatings && preferences.esrbRatings.length > 0) ||
          (preferences.platforms && preferences.platforms.length > 0) ||
          preferences.completionTime) && (
          <div className="selected-preferences">
            <h3>Selected Preferences:</h3>
            {preferences.genres && preferences.genres.length > 0 && (
              <div>
                <strong>Genres:</strong> {preferences.genres.join(", ")}
              </div>
            )}
            {preferences.esrbRatings && preferences.esrbRatings.length > 0 && (
              <div>
                <strong>ESRB Ratings:</strong>{" "}
                {preferences.esrbRatings.join(", ")}
              </div>
            )}
            {preferences.platforms && preferences.platforms.length > 0 && (
              <div>
                <strong>Platforms:</strong> {preferences.platforms.join(", ")}
              </div>
            )}
            {preferences.completionTime && (
              <div>
                <strong>Completion Time:</strong> {preferences.completionTime}{" "}
                hours
              </div>
            )}
            <div>
              <strong>Use Reviews:</strong>{" "}
              {preferences.useReviews ? "Yes" : "No"}
            </div>
          </div>
        )}
      </div>

      {submitError && <div className="error-message">{submitError}</div>}

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
                  "Action",
                  "Strategy",
                  "RPG",
                  "Shooter",
                  "Adventure",
                  "Puzzle",
                  "Racing",
                  "Sports",
                ].map((genre) => (
                  <a
                    key={genre}
                    className={isSelected("genres", genre) ? "selected" : ""}
                    onClick={() => togglePreference("genres", genre)}
                  >
                    {genre}
                    {isSelected("genres", genre) && (
                      <span className="checkmark">✓</span>
                    )}
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
                  "Adults Only 18+",
                ].map((rating) => (
                  <a
                    key={rating}
                    className={
                      isSelected("esrbRatings", rating) ? "selected" : ""
                    }
                    onClick={() => togglePreference("esrbRatings", rating)}
                  >
                    {rating}
                    {isSelected("esrbRatings", rating) && (
                      <span className="checkmark">✓</span>
                    )}
                  </a>
                ))}
              </div>

              <div id="platforms">
                <p>Platforms</p>
                {["PC", "PlayStation", "Xbox", "Nintendo", "Mobile"].map(
                  (platform) => (
                    <a
                      key={platform}
                      className={
                        isSelected("platforms", platform) ? "selected" : ""
                      }
                      onClick={() => togglePreference("platforms", platform)}
                    >
                      {platform}
                      {isSelected("platforms", platform) && (
                        <span className="checkmark">✓</span>
                      )}
                    </a>
                  ),
                )}
              </div>

              <p className="save-default" onClick={saveDefaultPreferences}>
                Save Default
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="reviews-toggle">
        <label>
          <input
            type="checkbox"
            checked={preferences.useReviews}
            onChange={toggleUseReviews}
          />
          Include game reviews in ranking algorithm
        </label>
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
