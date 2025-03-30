"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../styles/create-ranking.css";

const CreateRanking = () => {
    const router = useRouter();
    const [preferences, setPreferences] = useState({
      genre: "",
      completionTime: null,
      esrbRating: "",
      platforms: ""
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
  
    const handlePreferenceChange = (type, value) => {
      setPreferences(prev => ({
        ...prev,
        [type]: value
      }));
      setSubmitError(null); // Clear error when preferences change
    };
  
    const handleSubmit = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }
  
      if (!preferences.genre && !preferences.esrbRating && !preferences.platforms) {
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
            preferences
          }),
        });
  
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Failed to process preferences");
        }
  
        // Navigate to display rankings page on success
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
              preferences
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

  return (
    <div className="create-ranking-container">
      <div className="main-header">
        <h1>Create Ranking</h1>
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
                <a onClick={() => handlePreferenceChange("genre", "Free Online Games")}>Free Online Games</a>
                <a onClick={() => handlePreferenceChange("genre", "Action")}>Action</a>
                <a onClick={() => handlePreferenceChange("genre", "Strategy")}>Strategy</a>
                <a onClick={() => handlePreferenceChange("genre", "RPG")}>RPG</a>
                <a onClick={() => handlePreferenceChange("genre", "Shooter")}>Shooter</a>
                <a onClick={() => handlePreferenceChange("genre", "Adventure")}>Adventure</a>
                <a onClick={() => handlePreferenceChange("genre", "Puzzle")}>Puzzle</a>
                <a onClick={() => handlePreferenceChange("genre", "Racing")}>Racing</a>
                <a onClick={() => handlePreferenceChange("genre", "Sports")}>Sports</a>
              </div>
              
              <div id="completion-time">
                <p>Completion Time (hours)</p>
                <input 
                    type="number" 
                    min="1"
                    placeholder="Enter hours"
                    onChange={(e) => handlePreferenceChange("completionTime", parseInt(e.target.value) || null)}
                />
              </div>
              
              <div id="esrb-rating">
                <p>ESRB Rating</p>
                <a onClick={() => handlePreferenceChange("esrbRating", "Everyone")}>Everyone</a>
                <a onClick={() => handlePreferenceChange("esrbRating", "Everyone 10+")}>Everyone 10+</a>
                <a onClick={() => handlePreferenceChange("esrbRating", "Teen")}>Teen</a>
                <a onClick={() => handlePreferenceChange("esrbRating", "Mature 17+")}>Mature 17+</a>
                <a onClick={() => handlePreferenceChange("esrbRating", "Adults Only 18+")}>Adults Only 18+</a>
              </div>
              
              <div id="platforms">
                <p>Platforms</p>
                <a onClick={() => handlePreferenceChange("platforms", "PC")}>PC</a>
                <a onClick={() => handlePreferenceChange("platforms", "PlayStation")}>PlayStation</a>
                <a onClick={() => handlePreferenceChange("platforms", "Xbox")}>Xbox</a>
                <a onClick={() => handlePreferenceChange("platforms", "Nintendo")}>Nintendo</a>
                <a onClick={() => handlePreferenceChange("platforms", "Mobile")}>Mobile</a>
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