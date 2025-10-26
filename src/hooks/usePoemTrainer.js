import { useEffect, useRef, useState } from "react";
import { normalizeText, compareText } from "../utils/textUtils";
import { speakLines, createRecognition } from "../utils/speechUtils";

export function usePoemTrainer() {
  const [poemText, setPoemText] = useState(localStorage.getItem("poem") || "");
  const [lines, setLines] = useState([]);
  const [stage, setStage] = useState("idle");
  const [message, setMessage] = useState("");
  const [lastTranscript, setLastTranscript] = useState("");
  const [lastOps, setLastOps] = useState([]);
  const [k, setK] = useState(1);
  const [attempts, setAttempts] = useState(0);
  const lang = "ru-RU";
  const recRef = useRef(null);

  useEffect(() => {
    if (poemText) {
      localStorage.setItem("poem", poemText);
      const arr = poemText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      setLines(arr);
    } else setLines([]);
  }, [poemText]);

  function startFullRead() {
    if (!lines.length) return;
    setStage("reading_full");
    setMessage("Читаю стих...");
    speakLines(lines, lang, () => {
      setMessage("Полное прочтение завершено.");
      setStage("idle");
    });
  }

  function initialCheck() {
    if (!lines.length) return;
    const rec = createRecognition(lang);
    if (!rec) {
      alert("ASR не поддерживается в этом браузере.");
      return;
    }
    setMessage("Прочитайте весь стих");
    setStage("initial_check");
    rec.onresult = (ev) => {
      const transcript = ev.results[0][0].transcript;
      setLastTranscript(transcript);
      const cmp = compareText(lines.join(" "), transcript);
      setLastOps(cmp.ops);
      setMessage(`Совпадение: ${Math.round(cmp.accuracy * 100)}%`);
      setStage("idle");
    };
    rec.onerror = (e) => {
      setMessage("Ошибка распознавания: " + e.error);
      setStage("idle");
    };
    rec.start();
  }

  function startTraining() {
    if (!lines.length) return;
    setK(1);
    setAttempts(0);
    setStage("training");
    runStage(1);
  }

  function runStage(targetK) {
    setK(targetK);
    setMessage(`Читаю первые ${targetK} строк...`);
    const toSpeak = lines.slice(0, targetK);
    speakLines(toSpeak, lang, () => {
      setMessage("Повторите вслух (запись начнётся автоматически)");

      setTimeout(() => {
        const rec = createRecognition(lang);
        if (!rec) {
          setMessage("ASR не поддерживается в этом браузере.");
          return;
        }

        setStage("recording");
        rec.onresult = (ev) => {
          const transcript = ev.results[0][0].transcript;
          setLastTranscript(transcript);
          const cmp = compareText(toSpeak.join(" "), transcript);
          setLastOps(cmp.ops);
          const threshold = targetK === 1 ? 0.78 : 0.85;

          if (cmp.accuracy >= threshold) {
            setMessage(`Верно — ${Math.round(cmp.accuracy * 100)}%`);
            setAttempts(0);
            if (targetK >= lines.length) {
              setStage("done");
              setMessage("Поздравляю — стих выучен!");
            } else {
              setTimeout(() => runStage(targetK + 1), 900);
            }
          } else {
            setAttempts((a) => a + 1);
            if (attempts + 1 >= 3) {
              setMessage("Попробуйте прослушать ещё раз.");
              setAttempts(0);
              setStage("idle");
            } else {
              setMessage(`Не хватило — ${Math.round(cmp.accuracy * 100)}%.`);
              setStage("idle");
            }
          }
        };

        rec.onerror = (e) => {
          setMessage("Ошибка распознавания: " + e.error);
          setStage("idle");
        };

        rec.start();
      }, 1000);
    });
  }

  return {
    poemText,
    setPoemText,
    lines,
    stage,
    message,
    lastTranscript,
    startFullRead,
    initialCheck,
    startTraining,
  };
}
