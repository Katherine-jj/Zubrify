import React, { useEffect, useState } from 'react'
import { getChildren, addChild } from '../directusApi'
import { Link } from 'react-router-dom'

export default function ParentProfile() {
  const parentId = localStorage.getItem('parentId')
  const parentName = localStorage.getItem('parentName')
  const [children, setChildren] = useState([])
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [grade, setGrade] = useState('')

  useEffect(() => {
    if (parentId) fetchChildren()
  }, [])

  async function fetchChildren() {
    const data = await getChildren(parentId)
    setChildren(data)
  }

  async function handleAddChild() {
    if (!name || !age || !grade) return
    await addChild(parentId, name, age, grade)
    setName('')
    setAge('')
    setGrade('')
    fetchChildren()
  }

  return (
    <div>
      <h2>Профиль родителя {parentName}</h2>

      <div className="add-child">
        <h3>Добавить ребёнка</h3>
        <input placeholder="Имя" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Возраст" value={age} onChange={e=>setAge(e.target.value)} />
        <input placeholder="Класс" value={grade} onChange={e=>setGrade(e.target.value)} />
        <button onClick={handleAddChild}>Добавить</button>
      </div>

      <div className="children-list">
        <h3>Дети</h3>
        <ul>
          {children.map(c => (
            <li key={c.id}>
              <Link to={`/child/${c.id}`}>{c.name}</Link> — {c.age} лет, {c.grade} класс
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
