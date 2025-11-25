import "../css/Auth.css";
import React, { useState, useEffect } from "react";
import { registerChild, getGrades } from "../directusApi";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [grades, setGrades] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [gradeId, setGradeId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getGrades().then(setGrades);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await registerChild({
        firstName,
        lastName,
        middleName,
        gradeId,
        email,
        password,
      });

      navigate("/login");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="auth-page">
      <h2 className="auth-title">Регистрация</h2>

      <form className="auth-form" onSubmit={handleSubmit}>
        <input placeholder="Имя" value={firstName} onChange={e => setFirstName(e.target.value)} />
        <input placeholder="Фамилия" value={lastName} onChange={e => setLastName(e.target.value)} />
        <input placeholder="Отчество" value={middleName} onChange={e => setMiddleName(e.target.value)} />

        <select value={gradeId} onChange={e => setGradeId(e.target.value)}>
          <option value="">Выберите класс</option>
          {grades.map(g => <option key={g.id} value={g.id}>{g.num}</option>)}
        </select>

        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} />

        <button className="auth-btn" type="submit">Создать аккаунт</button>

        {error && <p className="auth-error">{error}</p>}
      </form>

      <div className="auth-link">
        Уже есть аккаунт? <span onClick={() => navigate("/login")}>Войти</span>
      </div>
    </div>
  );
}
