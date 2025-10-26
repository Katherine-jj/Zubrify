import React from 'react';

export default function PoemEditor({ poemData, setPoemData, setIsSaved }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPoemData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!poemData.text.trim()) return alert('Введите текст стиха');
    setIsSaved(true);
    localStorage.setItem('poemData', JSON.stringify(poemData));
  };

  return (
    <div className="poem-editor">
      <input
        type="text"
        name="title"
        placeholder="Название"
        value={poemData.title}
        onChange={handleChange}
      />
      <input
        type="text"
        name="author"
        placeholder="Автор"
        value={poemData.author}
        onChange={handleChange}
      />
      <textarea
        name="text"
        rows={8}
        placeholder="Введите текст стиха"
        value={poemData.text}
        onChange={handleChange}
      />
      <button onClick={handleSave}>Сохранить</button>
    </div>
  );
}
