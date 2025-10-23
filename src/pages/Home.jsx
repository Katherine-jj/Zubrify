import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="home">
      <h1>Добро пожаловать в Зубрифай</h1>
      <p>Выберите действие:</p>
      <div className="menu-buttons">
        <Link to="/learn" className="menu-btn">Загрузить своё</Link>
        <Link to="/library" className="menu-btn">Библиотека стихов</Link>
      </div>
    </div>
  )
}
