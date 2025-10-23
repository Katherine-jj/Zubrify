import { createDirectus, rest, readItems, createItem, authentication } from '@directus/sdk'

const API_URL = 'http://localhost:8055'

const directus = createDirectus(API_URL)
  .with(rest())
  .with(authentication())

// --- Авторизация пользователя ---
export async function loginUser(email, password) {
  try {
    const response = await directus.login(email, password)
    console.log('Авторизация успешна:', response)
    return response
  } catch (error) {
    console.error('Ошибка входа:', error)
    throw error
  }
}

// --- Регистрация нового пользователя ---
export async function registerUser(email, password, first_name) {
  try {
    // Создаём пользователя в Directus
    const user = await directus.request(
      createItem('parents', {
        parent_name,
        email,
        pass,
      })
    )
    console.log('Пользователь зарегистрирован:', user)
    return user
  } catch (error) {
    console.error('Ошибка регистрации:', error)
    throw error
  }
}

// --- Добавление ребёнка для родителя ---
export async function addChild(parentId, child_name, child_age, child_class) {
  try {
    const child = await directus.request(
      createItem('children', {
        child_parent: parentId,
        child_name,
        child_age,
        child_class
      })
    )
    console.log('Ребёнок добавлен:', child)
    return child
  } catch (error) {
    console.error('Ошибка при добавлении ребёнка:', error)
    throw error
  }
}

// --- Получение всех детей родителя ---
export async function getChildren(parentId) {
  try {
    const children = await directus.request(
      readItems('children', {
        filter: { parent: { _eq: parentId } },
      })
    )
    console.log('Список детей:', children)
    return children
  } catch (error) {
    console.error('Ошибка при получении списка детей:', error)
    throw error
  }
}

// --- Получение списка стихов из коллекции "poems" ---
export async function getPoems() {
  try {
    const poems = await directus.request(
      readItems('poems')
    )
    console.log('Список стихов:', poems)
    return poems
  } catch (error) {
    console.error('Ошибка при получении стихов:', error)
    throw error
  }
}
export default directus
