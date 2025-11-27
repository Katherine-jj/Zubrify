// src/pages/UserProfile.jsx

import "../css/ChildProfile.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCurrentUser,
  logoutUser
} from "../directusApi";

import img1 from "../assets/images/1.png";

import arrowAcc from "../assets/images/iconProfile/arrow_acc.svg";
import exitIcon from "../assets/images/iconProfile/exit.svg";
import favHeart from "../assets/images/iconProfile/fav_heart.svg";
import progressIcon from "../assets/images/iconProfile/progress.svg";
import settingsIcon from "../assets/images/iconProfile/settings.svg";
import supportIcon from "../assets/images/iconProfile/support.svg";
import Notification from "../assets/images/iconProfile/NotificationIcon.svg";

export default function UserProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const me = await getCurrentUser();

    if (!me) {
      navigate("/login");
      return;
    }

    setUser(me);

    // 🔥 временная статистика, чтобы профиль работал
    setStats({
      learned: 0,
      planned: 0,
      progress: [],
      history: []
    });
  } 


  async function handleLogout() {
    await logoutUser();
    localStorage.clear();
    navigate("/login");
  }

  if (!user || !stats) return <p>Загрузка...</p>;

  return (
    <div className="child-wrapper">

      {/* HEADER */}
      <div className="child-header">
        <div className="child-user-info">
          <img src={user.avatar || img1} className="child-avatar" />
          <div>
            <div className="child-role">Ученик</div>
            <div className="child-class">{user.grade?.title}</div>
            <div className="child-name">
              {user.first_name} {user.last_name}
            </div>
          </div>
        </div>
        <button className="child-bell"><img src={Notification} /></button>
      </div>

      {/* CARDS */}
      <div className="child-cards">
        <div className="child-card blue">
          <div className="child-card-number">{stats.learned}</div>
          <div className="child-card-text">Выучено</div>
          <img src={arrowAcc} className="child-card-arrow" />
        </div>

        <div className="child-card orange">
          <div className="child-card-number">{stats.planned}</div>
          <div className="child-card-text"
          onClick={() => navigate("/favorites")}>В планах</div>
          
          <img src={arrowAcc} className="child-card-arrow" />
        </div>
      </div>

      {/* MENU */}
      <div className="child-menu">
        <div
          className="child-menu-item"
          onClick={() => navigate("/favorites")}
        >
        <img src={favHeart} /> Избранное
        </div>
        <div className="child-menu-item">
          <img src={settingsIcon} /> Настройка
        </div>
        <div className="child-menu-item">
          <img src={supportIcon} /> Поддержка
        </div>
      </div>

      {/* PROGRESS */}
      <div className="child-block-title">Прогресс стихов</div>
      <div className="child-progress">
        {[5, 25, 7].map((v, i) => (
          <div className="child-progress-item" key={i}>
            <div className="child-progress-bg">
              <div
                className="child-progress-fill"
                style={{ height: `${Math.min(v, 50) / 50 * 100}%` }}
              >
                {v}
              </div>
            </div>
            <div className="child-progress-month">
              {["Май", "Июнь", "Июль"][i]}
            </div>
          </div>
        ))}
      </div>


      {/* HISTORY */}
      <div className="child-block-title">История изучения</div>
      <div className="child-history">
        {stats.history.length === 0 ? (
          <div className="child-empty">Пока пусто</div>
        ) : (
          stats.history.map(h => (
            <div className="child-history-item" key={h.id}>
              <img src={h.image || img1} className="child-history-img" />
              <div className="child-history-info">
                <div className="child-history-title">{h.title}</div>
                <div className="child-history-author">{h.author}</div>
              </div>
              <div className="child-history-time">{h.time || 0} мин</div>
            </div>
          ))
        )}
      </div>

      {/* UPLOADED (для твоих будущих загрузок) */}
      <div className="child-block-title">Загруженные стихи</div>
      <div className="child-empty">Пока пусто</div>

      {/* LOGOUT */}
      <div className="child-exit" onClick={handleLogout}>
        <img src={exitIcon} /> Выйти
      </div>

    </div>
  );
}
