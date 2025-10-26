import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getChild } from '../directusApi'

export default function ChildProfile() {
  const { id } = useParams()
  const [child, setChild] = useState(null)

  useEffect(() => {
    async function fetchChild() {
      const data = await getChild(id)
      setChild(data)
    }
    fetchChild()
  }, [id])

  if (!child) return <p>Загрузка...</p>

  return (
    <div>
      <h2>Профиль ребёнка: {child.name}</h2>
      <p>Возраст: {child.age}</p>
      <p>Класс: {child.grade}</p>
      <p>Всего выученных стихов: {child.total_poems_learned}</p>
      <p>Средний балл: {child.average_score}</p>
      <p>Последний просмотр: {child.last_review ? new Date(child.last_review).toLocaleDateString() : '-'}</p>
    </div>
  )
}
