import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'

// Страницы
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ParentProfile from './pages/ParentProfile'
import ChildProfile from './pages/ChildProfile'
import Library from './pages/Library'
import PoemLearner from './PoemLearner'

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>Zubrify</h1>
        <nav>
          <Link to="/">Домой</Link> |{" "}
          <Link to="/learn">Загрузить своё</Link> |{" "}
          <Link to="/library">Библиотека</Link> |{" "}
          <Link to="/login">Вход</Link> |{" "}
          <Link to="/register">Регистрация</Link> |{" "}
          <Link to="/profile">Профиль</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<PoemLearner />} />
          <Route path="/library" element={<Library />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ParentProfile />} />
          <Route path="/child/:id" element={<ChildProfile />} />
        </Routes>
      </main>
    </div>
  )
}
