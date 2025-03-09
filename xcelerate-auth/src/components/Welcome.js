import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const Welcome = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="welcome-box">
        <h2>Hello, {username}!</h2>
        <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Welcome;
