import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

// Страницы
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ParentProfile from './pages/ParentProfile'
import ChildProfile from './pages/ChildProfile'
import Library from './pages/Library'
import PoemPage from './pages/PoemPage'
import LearnPoem from "./pages/LearnPoem";

// Компоненты
import BottomNav from './components/BottomNav'

export default function App() {
  const location = useLocation()

  // пути, где нужно скрыть нижнее меню
  const hideOnRoutes = ["/poem/", "/learn/"]

  const shouldHideBottomNav = hideOnRoutes.some(path =>
    location.pathname.startsWith(path)
  )

  return (
    <div className="app pb-16">
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ParentProfile />} />
          <Route path="/child/:id" element={<ChildProfile />} />
          <Route path="/poem/:id" element={<PoemPage />} />
          <Route path="/learn/:id" element={<LearnPoem />} />
        </Routes>
      </main>

      {!shouldHideBottomNav && <BottomNav />}
    </div>
  )
}
