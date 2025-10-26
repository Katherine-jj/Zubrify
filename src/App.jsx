import React from 'react'
import { Routes, Route } from 'react-router-dom'

// Страницы
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ParentProfile from './pages/ParentProfile'
import ChildProfile from './pages/ChildProfile'
import Library from './pages/Library'
import PoemLearner from './PoemLearner'

// Компоненты
import BottomNav from './components/BottomNav'

export default function App() {
  return (
    <div className="app pb-16"> {/* pb-16 чтобы контент не перекрывался нижним баром */}
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

      <BottomNav />
    </div>
  )
}
