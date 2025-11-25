import "../css/Auth.css";
import React, { useState } from "react";
import { loginUser, getCurrentUser } from "../directusApi";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await loginUser(email, password);
      const user = await getCurrentUser();
      if (!user) throw new Error("Не удалось загрузить профиль");

      localStorage.setItem("userId", user.id);
      navigate("/home");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="auth-page">
      <h2 className="auth-title">Вход</h2>

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="auth-btn" type="submit">Войти</button>

        {error && <p className="auth-error">{error}</p>}
      </form>

      <div className="auth-link">
        Нет аккаунта? <span onClick={() => navigate("/register")}>Регистрация</span>
      </div>
    </div>
  );
}
