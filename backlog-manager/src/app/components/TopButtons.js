//"use client";

//import { Link } from 'react-router-dom';
import React from "react";
import "../styles/top-buttons.css";
//import { useRouter } from 'next/navigation';
//import { Link } from 'react-router-dom';

// function handleReturnHome() {
//   const router = useRouter(); // next/router
//   router.push("/");
// }

const TopButtons = () => {
  return (
    <div className="top-buttons">
      <button>Home Page</button>
    </div>
  );
};

export default TopButtons;
