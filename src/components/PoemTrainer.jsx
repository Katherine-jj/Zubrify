import React, { useState, useEffect } from 'react';
import { usePoemTrainer } from '../hooks/usePoemTrainer';

export default function PoemTrainer({ poemData }) {
  const [lines, setLines] = useState([]);
  const {
    startFullRead,
    initialCheck,
    startTraining,
    stage,
    message,
    lastTranscript,
    lastOps,
  } = usePoemTrainer(poemData);

  useEffect(() => {
    if (poemData.text) {
      const arr = poemData.text
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l.length > 0);
      setLines(arr);
    } else setLines([]);
  }, [poemData.text]);

  return (
    <div className="poem-trainer">
      <div className="controls">
        <button onClick={startFullRead} disabled={!lines.length}>Прочитать весь стих</button>
        <button onClick={initialCheck} disabled={!lines.length}>Проверка — прочитай весь стих сам</button>
        <button onClick={startTraining} disabled={!lines.length}>Начать тренировку</button>
      </div>

      <div className="status">
        <strong>Состояние:</strong> {stage} — {message}
      </div>

      <div className="transcript">
        <strong>Последняя расшифровка:</strong>
        <div className="transcript-box">{lastTranscript}</div>
      </div>
    </div>
  );
}
