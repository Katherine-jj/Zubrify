import React from 'react';

export default function PoemView({ title, author, text }) {
  if (!text) return null;

  return (
    <div className="poem-view">
      <h2 className="poem-title">{title}</h2>
      <h4 className="poem-author">Автор: {author}</h4>
      <pre className="poem-text">{text}</pre>
    </div>
  );
}
