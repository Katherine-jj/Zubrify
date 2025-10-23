import React from 'react'
import { useParams } from 'react-router-dom'

export default function ChildProfile() {
  const { id } = useParams()

  return (
    <div>
      <h2>Профиль ребёнка</h2>
      <p>ID ребёнка: {id}</p>
      <p>Здесь будет отображаться прогресс по стихам.</p>
    </div>
  )
}
