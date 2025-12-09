import "../css/Auth.css";
import React, { useState, useEffect } from "react";
import { registerChild, getGrades } from "../directusApi";
import { useNavigate } from "react-router-dom";

function CustomSelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="custom-select" onClick={() => setOpen(!open)}>
      <div className="custom-select-value">
        {value ? options.find(o => o.value === value)?.label : "Выберите класс"}
      </div>

      <div className="arrow"></div>

      {open && (
        <div className="custom-select-dropdown">
          {options.map(opt => (
            <div
              key={opt.value}
              className="custom-select-option"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



export default function Register() {
  const navigate = useNavigate();

  const [grades, setGrades] = useState([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [gradeId, setGradeId] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    getGrades().then(setGrades);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== repeatPassword) {
      setError("Пароли не совпадают");
      return;
    }

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

        <input
          placeholder="Имя"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          placeholder="Фамилия"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <input
          placeholder="Отчество"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
        />

        <CustomSelect
          value={gradeId}
          onChange={setGradeId}
          options={[
            { value: "", label: "Выберите класс" },
            ...grades.map(g => ({ value: g.id, label: g.num }))
          ]}
        />



        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Пароль"
          className={error ? "input-error" : ""}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Повторите пароль"
          className={error ? "input-error" : ""}
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />

        <button className="auth-btn" type="submit">
          Создать аккаунт
        </button>

        {error && <p className="auth-error">{error}</p>}
      </form>

      <div className="auth-link">
        Уже есть аккаунт? <span onClick={() => navigate("/login")}>Войти</span>
      </div>
    </div>
  );
}
