// src/pages/Login.jsx
import React, { useState } from 'react'
import { loginUser } from '../directusApi'
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
      const auth = await loginUser(email, password)
      
      // Данные пользователя можно взять из auth.data
      const parent = auth.data

      // Сохраняем id и имя в localStorage
      localStorage.setItem('parentId', parent.id)
      localStorage.setItem('parentName', parent.name)

      navigate('/profile')
    } catch (err) {
      setError(err.message || 'Ошибка авторизации')
    }
  }

  return (
    <div>
      <h2>Вход для родителей</h2>
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
