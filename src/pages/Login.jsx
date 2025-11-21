// src/pages/Login.jsx
import React, { useState } from 'react'
import { loginUser, getCurrentUser } from '../directusApi'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) {
      setError('Заполните все поля')
      return
    }

    try {
      //Авторизация (получаем токен)
      const authResponse = await loginUser(email, password)

      //данные текущего пользователя
      const user = await getCurrentUser()

      if (!user) throw new Error('Не удалось получить данные пользователя')

      //Сохраняем id, имя и тип в localStorage
      localStorage.setItem('userId', user.id)
      localStorage.setItem('userName', user.first_name || user.name || '')
      localStorage.setItem('userType', user.type || '')
      localStorage.setItem('userRole', user.role || '')
      localStorage.setItem('parentId', user.id);
      localStorage.setItem('parentName', user.first_name || user.name || '');

      // переходим в профиль (в зависимости от типа)
      if (user.type === 'parent') navigate('/profile')
      else if (user.type === 'child') navigate(`/child/${user.id}`)
      else navigate('/')

    } catch (err) {
      console.error(err)
      setError(err.message || 'Ошибка авторизации')
    }
  }

  return (
    <div className="login-page">
      <h2>Вход в систему</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Войти</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
