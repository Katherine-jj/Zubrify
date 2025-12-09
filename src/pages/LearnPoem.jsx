import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/LearnPoem.css";
import { markPoemCompleted, getCurrentUser } from "../directusApi";

const API_URL = "http://localhost:8055";

import forwardIcon from "../assets/images/Forward.svg";
import eyeIcon from "../assets/images/eye.svg";
import eyeActiveIcon from "../assets/images/eyeActive.svg";
import finishIllustration from "../assets/images/finishIllustration.svg";

import bookPink from "../assets/images/book_pink.svg";
import bookOrange from "../assets/images/book_orange.svg";
import bookBlue from "../assets/images/book_blue.svg";
import bookYellow from "../assets/images/book_yellow.svg";
import bookBlack from "../assets/images/book_black.svg";

import infoIcon from "../assets/images/info-rounded.svg";

const bookIconsByStep = [
  bookPink,
  bookOrange,
  bookBlue,
  bookYellow,
  bookBlack,
];

export default function LearnPoem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [poem, setPoem] = useState(null);
  const [step, setStep] = useState(0);
  const [showHints, setShowHints] = useState(false);

  /* Load user */
  useEffect(() => {
    async function loadUser() {
      const me = await getCurrentUser();
      setUser(me);
    }
    loadUser();
  }, []);

  /* Load poem */
  useEffect(() => {
    async function fetchPoem() {
      const res = await fetch(
        `${API_URL}/items/poems/${id}?fields=id,title,text,image,author.name`
      );
      const data = await res.json();
      setPoem(data.data);
    }
    fetchPoem();
  }, [id]);

  /* Reset eye when switching step */
  useEffect(() => {
    setShowHints(false);
  }, [step]);

  if (!poem) return <div className="loading">Загрузка...</div>;

  const lines = poem.text.split("\n").filter((l) => l.trim().length > 0);

  const steps = [
    { title: "Прочитай несколько раз вслух", color: "#F090F1", percent: 25 },
    { title: "Уже на шаг ближе", color: "#FF9F69", percent: 50 },
    { title: "Осталось совсем чуть-чуть", color: "#8097F0", percent: 75 },
    { title: "Финишная прямая! Поднажми", color: "#FFD150", percent: 99 },
    { title: "Ура! Стихотворение выучено!", color: "#000000", percent: 100 },
  ];

  const currentStep = steps[step];

  function shouldBlurLine(index) {
    if (step === 0) return false;
    if (step === 1) return index % 4 === 0;
    if (step === 2) return index % 2 === 0;
    if (step === 3) return (index % 4) !== 3;
    return false;
  }

  async function handlePrimaryClick() {
    window.scrollTo({ top: 0, behavior: "smooth" }); // <<< АВТОСКРОЛЛ ВВЕРХ

    if (step < 3) {
      setStep((s) => s + 1);
      return;
    }

    if (step === 3) {
      setStep(4);

      if (user) {
        try {
          await markPoemCompleted(user.id, poem.id);
        } catch (e) {
          console.error("Ошибка сохранения:", e);
        }
      }
      return;
    }

    if (step === 4) navigate("/library");
  }

  function getPrimaryLabel() {
    if (step === 3) return showHints ? "Готово" : "Дальше";
    if (step === 4) return "Библиотека";
    return "Дальше";
  }

  const showEyeButton = step >= 1 && step <= 3;

  return (
    <div className="learn-page">
      {/* HEADER */}
      <div className="learn-header">
        <button className="learn-back" onClick={() => navigate(-1)}>
          <img src={forwardIcon} className="learn-back-icon" alt="back" />
          <span className="backButton">Назад</span>
        </button>

        {/* FIXED HEIGHT TITLE BLOCK */}
        <div className="learn-title-wrapper">
          <h1 className="learn-title">
            {step === 1 ? (
              <>
                Уже на шаг<br />ближе
              </>
            ) : (
              currentStep.title
            )}
          </h1>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="learn-progress-wrapper">
        <img src={bookIconsByStep[step]} className="progress-icon" alt="book" />

        <div className="learn-progress-bar-large">
          <div
            className="learn-progress-fill-large"
            style={{
              width: `${currentStep.percent}%`,
              backgroundColor: currentStep.color,
            }}
          />
        </div>

        <img src={infoIcon} className="progress-icon" alt="info" />
      </div>

      {step !== 4 ? (
        <>
          {/* POEM CARD */}
          <div className="learn-poem-card">
            <h2 className="poem-title-learn">{poem.title}</h2>
            <p className="poem-author-learn">{poem.author?.name}</p>

            <div className="learn-text-block">
              {lines.map((line, i) => (
                <p
                  key={i}
                  className={shouldBlurLine(i) && !showHints ? "poem-line blurred" : "poem-line"}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* EYE BUTTON */}
          {showEyeButton && (
            <button
              className={`eye-btn ${showHints ? "active" : ""}`}
              onClick={() => setShowHints((prev) => !prev)}
            >
              <img src={showHints ? eyeActiveIcon : eyeIcon} alt="eye" />
            </button>
          )}

          {/* PRIMARY BUTTON */}
          <button className="primary-learn-btn" onClick={handlePrimaryClick}>
            <span>{getPrimaryLabel()}</span>
            <span className="arrow">›</span>
          </button>
        </>
      ) : (
        <div className="learn-finish">
          <div className="finish-illustration-wrap">
            <img src={finishIllustration} alt="done" />
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
