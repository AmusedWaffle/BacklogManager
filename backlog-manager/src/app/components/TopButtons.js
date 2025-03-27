import React from "react";
import "../styles/top-buttons.css";

//this component will be imported in every page 
  //instead of copying code over and over
//serves as navigation
const TopButtons = () => {
  return (
    <div className="top-buttons">
      <button>Home Page</button>
    </div>
  );
};

export default TopButtons;
