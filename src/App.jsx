import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Страницы

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import Library from './pages/Library';
import PoemPage from './pages/PoemPage';
import LearnPoem from "./pages/LearnPoem";

// Компоненты
import BottomNav from './components/BottomNav';

export default function App() {
  const location = useLocation();

  // Маршруты, где bottom nav скрываем
  const hideOnRoutes = ["/poem/", "/learn/"]; // home тут быть не должно!


  const shouldHideBottomNav = hideOnRoutes.some(path =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="app pb-16">
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/poem/:id" element={<PoemPage />} />
          <Route path="/learn/:id" element={<LearnPoem />} />
        </Routes>
      </main>

      {!shouldHideBottomNav && <BottomNav />}
    </div>
  );
}
