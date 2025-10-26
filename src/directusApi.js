import { createDirectus } from '@directus/sdk'

const directus = createDirectus('http://localhost:8055')

// --- Регистрация пользователя ---
export async function registerUser(name, email, password) {
  try {
    const user = await directus.items('users').createOne({
      name,
      email,
      password
    })
    console.log('Пользователь зарегистрирован:', user)
    return user
  } catch (error) {
    console.error('Ошибка при регистрации:', error)
    throw error
  }
}

// --- Логин ---
export async function loginUser(email, password) {
  try {
    const response = await directus.auth.login({ email, password })
    console.log('Авторизация успешна:', response)
    return response
  } catch (error) {
    console.error('Ошибка входа:', error)
    throw error
  }
}




// Получение всех детей родителя
export async function getChildren(parentId) {
  const data = await directus.items('children').readByQuery({
    filter: { parent: { _eq: parentId } },
    fields: ['id','name','age','grade','total_poems_learned','average_score','last_review']
  })
  return data.data
}

// Добавление ребёнка
export async function addChild(parentId, name, age, grade) {
  return await directus.items('children').createOne({
    name,
    age,
    grade,
    parent: parentId,
    total_poems_learned: 0,
    average_score: 0,
    last_review: null
  })
}

// Получение одного ребёнка
export async function getChild(childId) {
  return await directus.items('children').readOne(childId)
}

// Получение списка стихов
export async function getPoems() {
  const data = await directus.items('poems').readMany({
    fields: ['id','title','author','poem_text','class','year_published','image']
  })
  return data.data
}

export default directus
