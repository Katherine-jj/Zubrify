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
import { FavoritesProvider } from "./context/FavoritesContext";
import Favorites from "./pages/Favorites";
import ProfileSettings from "./pages/ProfileSettings";
import HistoryPageFull from "./pages/HistoryPageFull.jsx"
import UploadedPoemsListFull from "./pages/UploadedPoemsListFull.jsx"

// Компоненты
import BottomNav from './components/BottomNav';

export default function App() {
  const location = useLocation();

  // Маршруты, где bottom nav скрываем
  const hideOnRoutes = ["/poem/", "/learn/","/register","/login"]; // home тут быть не должно!


  const shouldHideBottomNav = hideOnRoutes.some(path =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="app pb-16">
      <main>
        <FavoritesProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/library" element={<Library />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/poem/:id" element={<PoemPage />} />
            <Route path="/learn/:id" element={<LearnPoem />} />
            <Route path="/favorites/:id" element={<Favorites />} />
            <Route path="/profile/settings" element={<ProfileSettings />} />
            <Route path="/history" element={<HistoryPageFull />} />
            <Route path="/uploaded" element={<UploadedPoemsListFull />} />
          </Routes>
        </FavoritesProvider>
      </main>

      {!shouldHideBottomNav && <BottomNav />}
    </div>
  );
}
