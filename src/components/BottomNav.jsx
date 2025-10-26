// BottomNav.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/BottomNav.css";

const BottomNav = () => {
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav">
      <button onClick={() => navigate("/")} className="nav-btn">
        Главн
      </button>

      <button onClick={() => navigate("/library")} className="nav-btn">
        Библиотека
      </button>

      <button onClick={() => navigate("/profile")} className="nav-btn">
        Профиль
      </button>
    </nav>
  );
};

export default BottomNav;
