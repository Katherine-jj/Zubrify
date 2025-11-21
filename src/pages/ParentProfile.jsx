// src/pages/ParentProfile.jsx

import React, { useEffect, useState } from "react";
import { getChildren, addChild } from "../directusApi";
import { Link } from "react-router-dom";
import "../css/ParentProfile.css";

export default function ParentProfile() {
  const parentId = localStorage.getItem("userId");
  const parentName = localStorage.getItem("userName");
  const [children, setChildren] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [grade, setGrade] = useState("");

  useEffect(() => {
    if (parentId) fetchChildren();
  }, []);

  async function fetchChildren() {
    const data = await getChildren(parentId);
    setChildren(data);
  }

  async function handleAddChild() {
    if (!name || !age || !grade) return;

    await addChild(parentId, name, age, grade);
    setName("");
    setAge("");
    setGrade("");
    fetchChildren();
  }

  return (
    <div className="parent-profile">
      
      {/* ——— HEADER ——— */}
      <div className="pp-header">
        <h2 className="pp-title">Профиль родителя</h2>
      </div>

      {/* ——— КНОПКИ АВТОРИЗАЦИИ ——— */}
      <div className="pp-auth-links">
        <Link to="/login" className="pp-btn pp-btn-outline">Войти</Link>
        <Link to="/register" className="pp-btn pp-btn-primary">Регистрация</Link>
      </div>

      {/* ——— КАРТОЧКА РОДИТЕЛЯ ——— */}
      <div className="pp-card">
        <div className="pp-card-header">
          <h3 className="pp-parent-name">{parentName || "Родитель"}</h3>
        </div>
      </div>

      {/* ——— ДОБАВИТЬ РЕБЁНКА ——— */}
      <div className="pp-card">
        <h3 className="pp-subtitle">Добавить ребёнка</h3>

        <div className="pp-inputs">
          <input
            className="pp-input"
            placeholder="Имя ребёнка"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="pp-input"
            placeholder="Возраст"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <input
            className="pp-input"
            placeholder="Класс"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
        </div>

        <div className="pp-actions">
          <button className="pp-btn pp-btn-primary" onClick={handleAddChild}>
            Добавить
          </button>
        </div>
      </div>

      {/* ——— СПИСОК ДЕТЕЙ ——— */}
      <h3 className="pp-subtitle">Дети</h3>

      {children.length === 0 ? (
        <p className="pp-empty">Пока нет добавленных детей</p>
      ) : (
        <ul className="pp-children-list">
          {children.map((c) => (
            <li key={c.id} className="pp-child-item">
              <Link to={`/child/${c.id}`} className="pp-child-link">
                <div className="pp-child-name">{c.name}</div>
                <div className="pp-child-meta">
                  {c.age} лет • {c.grade} класс
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
