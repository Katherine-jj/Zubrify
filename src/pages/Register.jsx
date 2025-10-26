import React, { useState } from 'react'
import { registerUser } from '../directusApi'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name || !email || !password) {
      setError('Заполните все поля')
      return
    }

    try {
      await registerUser(name, email, password)
      navigate('/login')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Регистрация родителя</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Имя"
          value={name}
          onChange={e => setName(e.target.value)}
        />
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
        <button type="submit">Зарегистрироваться</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
