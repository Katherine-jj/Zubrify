import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/LearnPoem.css";

const API_URL = "http://localhost:8055";

// Иконки
import eyeIcon from "../assets/images/eye.svg";
import finishIllustration from "../assets/images/finishIllustration.svg";

import bookPink from "../assets/images/book_pink.svg";
import bookOrange from "../assets/images/book_orange.svg";
import bookBlue from "../assets/images/book_blue.svg";
import bookYellow from "../assets/images/book_yellow.svg";
import bookBlack from "../assets/images/book_black.svg";

import infoIcon from "../assets/images/info-rounded.svg";

const bookIconsByStep = [
  bookPink,   // step 0
  bookOrange, // step 1
  bookBlue,   // step 2
  bookYellow, // step 3
  bookBlack,  // step 4 (финал)
];

export default function LearnPoem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [poem, setPoem] = useState(null);
  const [step, setStep] = useState(0); // 0–3 этапы, 4 — финал
  const [showHints, setShowHints] = useState(false); // “Глаз” показывает текст

  useEffect(() => {
    fetchPoem();
  }, []);

  async function fetchPoem() {
    const res = await fetch(
      `${API_URL}/items/poems/${id}?fields=id,title,text,image,author.name`
    );
    const data = await res.json();
    setPoem(data.data);
  }

  // Сбрасываем “глаз” при смене этапа
  useEffect(() => {
    setShowHints(false);
  }, [step]);

  if (!poem) return <div className="loading">Загрузка...</div>;

  const lines = poem.text.split("\n").filter((l) => l.trim().length > 0);

  // Конфигурация шагов обучения
  const steps = [
    {
      title: "Прочитай несколько раз вслух",
      color: "#F090F1",
      percent: 25,
    },
    {
      title: "Уже на шаг ближе",
      color: "#FF9F69",
      percent: 50,
    },
    {
      title: "Осталось совсем чуть-чуть",
      color: "#8097F0",
      percent: 75,
    },
    {
      title: "Финишная прямая! Поднажми",
      color: "#FFD150",
      percent: 99,
    },
    {
      title: "Ура! Стихотворение выучено!",
      color: "#000000",
      percent: 100,
    },
  ];

  const currentStep = steps[step];

  // Логика блюра строк
  function shouldBlurLine(index) {
    if (step === 0) return false;

    if (step === 1) {
      return index % 4 === 0;
    }

    if (step === 2) {
      return index % 2 === 0;
    }

    if (step === 3) {
      const pos = index % 4;
      return pos === 0 || pos === 1 || pos === 2;
    }

    return false;
  }

  // Нижняя кнопка ("Дальше" / "Готово" / "Библиотека")
  function handlePrimaryClick() {
    if (step < 3) {
      setStep((s) => s + 1);
    } else if (step === 3) {
      setStep(4);
    } else {
      navigate("/library");
    }
  }

  function getPrimaryLabel() {
    if (step === 3) return showHints ? "Готово" : "Дальше";
    if (step === 4) return "Библиотека";
    return "Дальше";
  }

  const showEyeButton = step >= 1 && step <= 3;
  const isFinalStep = step === 4;

  return (
    <div className="learn-page">

      {/* Шапка */}
      <div className="learn-header">
        <button className="learn-back" onClick={() => navigate(-1)}>
          &lt; Назад
        </button>
        <div className="learn-title">{currentStep.title}</div>
      </div>

      {/* Прогресс-бар */}
      <div className="learn-progress-wrapper">
        <img
          src={bookIconsByStep[step]}
          alt="book"
          className="progress-icon"
        />

        <div className="learn-progress-bar-large">
          <div
            className="learn-progress-fill-large"
            style={{
              width: `${currentStep.percent}%`,
              backgroundColor: currentStep.color,
            }}
          />
        </div>

        <img src={infoIcon} alt="info" className="progress-icon" />
      </div>

      {!isFinalStep ? (
        <>
          {/* Карточка стихотворения */}
          <div className="learn-poem-card">
            <h1 className="poem-title-learn">{poem.title}</h1>
            <p className="poem-author-learn">{poem.author?.name}</p>

            <div className="learn-text-block">
              {lines.map((line, i) => {
                const blurred = shouldBlurLine(i) && !showHints;
                return (
                  <p
                    key={i}
                    className={blurred ? "poem-line blurred" : "poem-line"}
                  >
                    {line}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Левая кнопка “глаз” */}
          {showEyeButton && (
            <button
              className={`eye-btn ${showHints ? "active" : ""}`}
              onClick={() => setShowHints((prev) => !prev)}
            >
              <img src={eyeIcon} alt="eye" />
            </button>
          )}

          {/* Правая нижняя кнопка */}
          <button className="primary-learn-btn" onClick={handlePrimaryClick}>
            <span>{getPrimaryLabel()}</span>
            <span className="arrow">›</span>
          </button>
        </>
      ) : (
        // Финальный экран
        <div className="learn-finish">
          <div className="finish-illustration-wrap">
            <img src={finishIllustration} alt="Готово" />
          </div>

          <h2 className="finish-title">Ты справился!</h2>

          <button className="finish-library-btn" onClick={handlePrimaryClick}>
            Библиотека
          </button>
        </div>
      )}
    </div>
  );
}
