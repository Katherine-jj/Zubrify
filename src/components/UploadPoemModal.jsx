import React, { useState } from "react";
import "./UploadPoemModal.css";

export default function UploadPoemModal({
  onClose,
  childId,
  childGrade,
  onUploaded
}) {
  const [mode, setMode] = useState("form"); // form | preview
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");

  function goToPreview() {
    if (!title.trim() || !text.trim()) {
      alert("Заполни хотя бы название и текст");
      return;
    }
    setMode("preview");
  }

  async function handleSave() {
    const poem = {
      title,
      author,
      text,
      grade: childGrade,
      owner: childId,
      is_user_uploaded: true
    };

    await onUploaded(poem);
    onClose();
  }

  return (
    <div className="upload-overlay">
      <div className="upload-modal">

        {mode === "form" && (
          <>
            <h2 className="modal-title">Добавить стихотворение</h2>

            <div className="form-block">
              <label className="form-label">Название</label>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: Буря мглою небо кроет"
              />
            </div>

            <div className="form-block">
              <label className="form-label">Автор</label>
              <input
                type="text"
                className="form-input"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="А. С. Пушкин"
              />
            </div>

            <div className="form-block">
              <label className="form-label">Текст</label>
              <textarea
                className="form-textarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Введи весь текст стихотворения здесь..."
              />
            </div>

            <div className="modal-buttons">
              <button className="cancel-btn" onClick={onClose}>Отмена</button>

              <button className="save-btn" onClick={goToPreview}>
                Просмотр →
              </button>
            </div>
          </>
        )}

        {mode === "preview" && (
          <>
            <h2 className="modal-title">{title}</h2>
            {author && <p className="modal-author">{author}</p>}

            <div className="preview-text-scroll">
              {text.split("\n").map((line, idx) => (
                <p key={idx} className="preview-line">{line}</p>
              ))}
            </div>

            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setMode("form")}>
                Назад
              </button>

              <button className="save-btn" onClick={handleSave}>
                Учить →
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
