// src/pages/ProfileSettings.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ProfileSettings.css";

import backIcon from "../assets/images/backButtonGrey.svg";
import editOffIcon from "../assets/images/EditButton=off.svg";
import editOnIcon from "../assets/images/EditButton.svg";
import saveBtnIcon from "../assets/images/Button.svg";
import eyeOff from "../assets/images/state=off.svg";
import eyeOn from "../assets/images/state=on.svg";

import { API_URL, getCurrentUser, updateUser, getAvatars } from "../directusApi";

export default function ProfileSettings() {
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [avatars, setAvatars] = useState([]);

  // password logic
  const [showPass, setShowPass] = useState(false);
  const [showPassRepeat, setShowPassRepeat] = useState(false);
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    grade: "",
    email: "",
    password: "",
    ava: null
  });

  // ============================
  // LOAD PROFILE + AVATARS
  // ============================
  useEffect(() => {
    async function load() {
      const me = await getCurrentUser();
      const avaList = await getAvatars();

      setUser(me);
      setAvatars(avaList);

      setForm({
        first_name: me.first_name || "",
        last_name: me.last_name || "",
        middle_name: me.middle_name || "",
        grade: me.grade?.id || "",
        email: me.email || "",
        password: "",           // пароль не приходит из Directus по безопасности
        ava: me.ava?.id || null
      });
    }
    load();
  }, []);

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  // ============================
  // SAVE CHANGES
  // ============================
  async function saveChanges() {
    // Проверка пароля
    if (passwordChanged) {
      if (form.password !== repeatPassword) {
        return alert("Пароли не совпадают");
      }
      if (form.password.length < 6) {
        return alert("Пароль должен быть минимум 6 символов");
      }
    }

    await updateUser(user.id, form);
    setEditMode(false);
    navigate("/profile");
  }

  if (!user) return null;

  return (
    <div className="settings-page">

      {/* HEADER */}
      <div className="settings-header">
        <button className="back-btn" onClick={() => navigate("/profile")}>
          <img src={backIcon} alt="back" />
        </button>

        <h2>Настройки</h2>

        <button className="edit-btn" onClick={() => setEditMode(!editMode)}>
          <img src={editMode ? editOnIcon : editOffIcon} alt="edit" />
        </button>
      </div>

      {/* AVATAR BLOCK */}
      <div className="avatar-block">
        {editMode ? (
          <div className="avatar-slider scroll-x">
            {avatars.map(av => (
              <img
                key={av.id}
                src={`${API_URL}/assets/${av.image.id}`}
                alt="avatar"
                className={
                  av.id === form.ava ? "avatar-option active" : "avatar-option"
                }
                onClick={() => handleChange("ava", av.id)}
              />
            ))}
          </div>
        ) : (
          user?.ava?.image?.id && (
            <img
              className="avatar-main"
              src={`${API_URL}/assets/${user.ava.image.id}`}
              alt="avatar"
            />
          )
        )}

        <p className="avatar-label">Фото профиля</p>
      </div>

      {/* FORM */}
      <div className="form-block">

        {/* Имя */}
        <label>Имя</label>
        <input
          disabled={!editMode}
          value={form.first_name}
          onChange={e => handleChange("first_name", e.target.value)}
        />

        {/* Фамилия */}
        <label>Фамилия</label>
        <input
          disabled={!editMode}
          value={form.last_name}
          onChange={e => handleChange("last_name", e.target.value)}
        />

        {/* Отчество */}
        <label>Отчество</label>
        <input
          disabled={!editMode}
          value={form.middle_name}
          onChange={e => handleChange("middle_name", e.target.value)}
        />

        <div className="row">
          <div className="col">
            <label>Класс</label>
            <input
              disabled={!editMode}
              value={form.grade}
              onChange={e => handleChange("grade", e.target.value)}
            />
          </div>
        </div>

        <label>Email</label>
        <input disabled value={form.email} />

        {/* PASSWORD FIELD */}
        <label>Пароль</label>
        <div className="password-wrapper">
          <input
            type={showPass ? "text" : "password"}
            disabled={!editMode}
            value={passwordChanged ? form.password : "Введите новый пароль"}
            onChange={e => {
              setForm(prev => ({ ...prev, password: e.target.value }));
              setPasswordChanged(true);
            }}
            placeholder="********"
          />

          {editMode && (
            <img
              src={showPass ? eyeOn : eyeOff}
              className="password-toggle"
              onClick={() => setShowPass(p => !p)}
            />
          )}
        </div>

        {/* REPEAT PASSWORD */}
        {editMode && passwordChanged && (
          <>
            <label>Повторите пароль</label>
            <div className="password-wrapper">
              <input
                type={showPassRepeat ? "text" : "password"}
                value={repeatPassword}
                onChange={e => setRepeatPassword(e.target.value)}
                placeholder=" "
              />

              <img
                src={showPassRepeat ? eyeOn : eyeOff}
                className="password-toggle"
                onClick={() => setShowPassRepeat(p => !p)}
              />
            </div>

            {repeatPassword &&
              repeatPassword !== form.password && (
                <div className="error-text">Пароли не совпадают</div>
              )}
          </>
        )}
      </div>

      {/* SAVE BUTTON */}
      {editMode && (
        <button className="save-btn" onClick={saveChanges}>
          {/* <img src={saveBtnIcon} alt="save" />*/}
          Сохранить
        </button>
      )}
    </div>
  );
}
