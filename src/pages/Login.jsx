import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../directusApi'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await loginUser(email, password)
      navigate('/profile')
    } catch (err) {
      setError('Неверный email или пароль')
    }
  }

  return (
    <div className="auth-form">
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Пароль" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button type="submit">Войти</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  )
}
