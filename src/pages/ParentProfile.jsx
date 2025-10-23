import React, { useEffect, useState } from 'react'
import { getChildren, addChild } from '../directusApi'
import { Link } from 'react-router-dom'

export default function ParentProfile() {
  const [children, setChildren] = useState([])
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [klass, setKlass] = useState('')

  // В реальном приложении parentId можно брать из авторизованного пользователя
  const parentId = 1 // 🔸 временно хардкодим ID родителя

  useEffect(() => {
    fetchChildren()
  }, [])

  async function fetchChildren() {
    try {
      const data = await getChildren(parentId)
      setChildren(data)
    } catch (err) {
      console.error('Ошибка получения детей:', err)
    }
  }

  async function handleAddChild() {
    if (!name || !age || !klass) return
    try {
      await addChild(parentId, name, age, klass)
      setName('')
      setAge('')
      setKlass('')
      fetchChildren()
    } catch (err) {
      console.error('Ошибка при добавлении ребёнка:', err)
    }
  }

  return (
    <div>
      <h2>Профиль родителя</h2>

      <div className="add-child">
        <h3>Добавить ребёнка</h3>
        <input placeholder="Имя" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Возраст" value={age} onChange={e => setAge(e.target.value)} />
        <input placeholder="Класс" value={klass} onChange={e => setKlass(e.target.value)} />
        <button onClick={handleAddChild}>Добавить</button>
      </div>

      <div className="children-list">
        <h3>Дети</h3>
        <ul>
          {children.map(c => (
            <li key={c.id}>
              <Link to={`/child/${c.id}`}>{c.first_name}</Link> — {c.age} лет, {c.class} класс
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
