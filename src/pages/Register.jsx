import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../directusApi'

export default function Register() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await registerUser({ first_name: firstName, last_name: lastName, email, password })
      navigate('/login')
    } catch (err) {
      setError('Ошибка регистрации')
    }
  }

  return (
    <div className="auth-form">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Имя" value={firstName} onChange={e=>setFirstName(e.target.value)} required />
        <input placeholder="Фамилия" value={lastName} onChange={e=>setLastName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Пароль" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button type="submit">Зарегистрироваться</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  )
}
