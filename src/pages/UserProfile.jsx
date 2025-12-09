// src/pages/UserProfile.jsx

import "../css/ChildProfile.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCurrentUser,
  logoutUser,
  getUploadedPoems,
  getUserProgress,
  getFavoritesByUser
} from "../directusApi";

import SectionHeader from "../components/SectionHeader/SectionHeader";

import img1 from "../assets/images/1.png";

const API_URL = "http://localhost:8055";

import arrowAcc from "../assets/images/iconProfile/arrow_acc.svg";
import exitIcon from "../assets/images/iconProfile/exit.svg";
import favHeart from "../assets/images/iconProfile/fav_heart.svg";
import settingsIcon from "../assets/images/iconProfile/settings.svg";
import supportIcon from "../assets/images/iconProfile/support.svg";
import Notification from "../assets/images/iconProfile/NotificationIcon.svg";
import progressIcon from "../assets/images/iconProfile/progress.svg";

export default function UserProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);

  const barColors = ["#F090F1", "#FF9F69", "#8097F0"];

  function getBarHeightPercent(value) {
    if (value <= 0) return 22;
    if (value === 1) return 32;
    if (value < 10) return 45;
    if (value < 25) return 65;
    if (value < 50) return 80;
    return 100;
  }

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const me = await getCurrentUser();
    const favorites = await getFavoritesByUser(me.id);

    if (!me) {
      navigate("/login");
      return;
    }

    setUser(me);

    const uploaded = await getUploadedPoems(me.id);
    const progress = await getUserProgress(me.id);

    const completed = progress.filter(p => p.status === "completed");
    const learning = progress.filter(p => p.status === "learning");

    const history = completed.map(p => ({
      id: p.poem.id,
      title: p.poem.title,
      author: p.poem.author,
      image: p.poem.image,
      is_user_uploaded: p.poem.is_user_uploaded,
      completed_at: p.completed_at,
      time: p.poem.time || 0
    }));

    const now = new Date();
    const months = [];

    for (let i = 0; i < 3; i++) {
      const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(m.getFullYear(), m.getMonth(), 1);
      const monthEnd = new Date(m.getFullYear(), m.getMonth() + 1, 1);

      const count = completed.filter(p => {
        const c = new Date(p.completed_at);
        return c >= monthStart && c < monthEnd;
      }).length;

      months.push({
        label: m.toLocaleString("ru", { month: "long" }),
        value: count
      });
    }

    setStats({
      learned: completed.length,
      planned: favorites.length,
      history,
      uploaded: uploaded || [],
      months: months.reverse()
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
          <img
            className="child-avatar"
            src={
              user.ava?.image?.id
                ? `${API_URL}/assets/${user.ava.image.id}`
                : img1
            }
          />
          <div>
            <div className="child-name">
              {user.first_name} {user.last_name}
            </div>
            <div className="child-class">{user.grade?.num} класс</div>
          </div>
        </div>

        <button className="child-bell">
          <img src={Notification} />
        </button>
      </div>

      {/* CARDS */}
      <div className="child-cards">
        <div className="child-card blue" onClick={() => navigate(`/history`)}>
          <div className="child-card-number">{stats.learned}</div>
          <div className="child-card-text">Выучено</div>
          <img src={arrowAcc} className="child-card-arrow" />
        </div>

        <div className="child-card orange" onClick={() => navigate(`/favorites/${user.id}`)}>
          <div className="child-card-number">{stats.planned}</div>
          <div className="child-card-text">В планах</div>
          <img src={arrowAcc} className="child-card-arrow" />
        </div>
      </div>

      {/* MENU */}
      <div className="child-menu">
        <div className="child-menu-item" onClick={() => navigate(`/favorites/${user.id}`)}>
          <img src={favHeart} /> Избранное
        </div>

        <div className="child-menu-item" onClick={() => navigate("/profile/settings")}>
          <img src={settingsIcon} /> Настройки
        </div>

        <div className="child-menu-item">
          <img src={supportIcon} /> Поддержка
        </div>
      </div>

      {/* PROGRESS */}
      <div className="child-progress-title-row">
        <img src={progressIcon} className="progress-icon-big" alt="progress" />
        <span className="child-block-title">Прогресс стихов</span>
      </div>


      <div className="child-progress-frame">
        <div className="child-progress">
          {stats.months.map((m, i) => {
            const isZero = m.value <= 0;
            const height = getBarHeightPercent(m.value);
            const color = isZero ? "#C3C3C3" : barColors[i % barColors.length];

            return (
              <div className="child-progress-item" key={i}>
                <div className="child-progress-bg">
                  <div
                    className="child-progress-fill"
                    style={{
                      height: `${height}%`,
                      backgroundColor: color
                    }}
                  >
                    {m.value >= 50 ? "50+" : m.value}
                  </div>
                </div>

                <div className="child-progress-month">{m.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* HISTORY BLOCK */}
      <SectionHeader title="История изучения" link="/history" />

      <div className="child-history">
        {stats.history.length === 0 ? (
          <div className="child-empty">Пока пусто</div>
        ) : (
          stats.history.slice(0, 4).map(h => (
            <div className="child-history-item" key={h.id}>
              <img
                src={h.is_user_uploaded ? img1 : `${API_URL}/assets/${h.image}`}
                className="child-history-img"
              />

              <div className="child-history-info">
                <div className="child-history-title">{h.title}</div>
                <div className="child-history-author">
                  {h.author?.name || ""}
                </div>
              </div>

              <div className="child-history-time">{h.time || 0} мин</div>
            </div>
          ))
        )}
      </div>

      {/* UPLOADED BLOCK */}
      <SectionHeader title="Загруженные стихотворения" link="/uploaded" />

      <div className="child-uploaded">
        {stats.uploaded.length === 0 ? (
          <div className="child-empty">Пока пусто</div>
        ) : (
          stats.uploaded.slice(0, 4).map(p => (
            <div
              className="child-history-item"
              key={p.id}
              onClick={() => navigate(`/poem/${p.id}`)}
            >
              <img
                src={p.is_user_uploaded ? img1 : `${API_URL}/assets/${p.image}`}
                className="child-history-img"
              />

              <div className="child-history-info">
                <div className="child-history-title">{p.title}</div>
                <div className="child-history-author">
                  {p.author?.name || ""}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* LOGOUT */}
      <div className="child-exit" onClick={handleLogout}>
        <img src={exitIcon} /> Выйти
      </div>
    </div>
  );
}
