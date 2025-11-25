import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/BottomNav.css";

import homeActive from "../assets/images/home_State=on.svg";
import homeInactive from "../assets/images/home_State=off.svg";

import libraryActive from "../assets/images/lib_State=on.svg";
import libraryInactive from "../assets/images/lib_State=off.svg";

import profileActive from "../assets/images/acc_State=on.svg";
import profileInactive from "../assets/images/acc_State=off.svg";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuth = !!localStorage.getItem("userId");

  function handleProfileClick() {
    if (isAuth) navigate("/profile");
    else navigate("/"); // стартовый экран вход/регистрация
  }

  return (
    <nav className="bottom-nav">
      {/* Главная */}
      <button onClick={() => navigate("/home")} className="nav-btn">
        <img
          src={location.pathname.startsWith("/home") ? homeActive : homeInactive}
          alt="Главная"
          className="nav-icon"
        />
      </button>

      {/* Библиотека */}
      <button onClick={() => navigate("/library")} className="nav-btn">
        <img
          src={
            location.pathname.startsWith("/library")
              ? libraryActive
              : libraryInactive
          }
          alt="Библиотека"
          className="nav-icon"
        />
      </button>

      {/* Профиль */}
      <button onClick={handleProfileClick} className="nav-btn">
        <img
          src={
            location.pathname.startsWith("/profile")
              ? profileActive
              : profileInactive
          }
          alt="Профиль"
          className="nav-icon"
        />
      </button>
    </nav>
  );
};


export default BottomNav;
