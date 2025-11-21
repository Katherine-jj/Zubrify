// === directusApi.js ===

import {
  createDirectus,
  rest,
  authentication,
  readItems,
  readItem,
  createItem,
  readMe
} from '@directus/sdk';

// URL Directus
export const API_URL = "http://localhost:8055";

// Создаём Directus-клиент
export const directus = createDirectus(API_URL)
  .with(rest())
  .with(authentication());


// ======================================================
// 1) РЕГИСТРАЦИЯ ЧЕРЕЗ /auth/register (SDK этого не умеет)
// ======================================================
export async function registerUser(name, email, password) {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      first_name: name,
      email,
      password,
      status: "active",
      role: "61e53b06-0669-4b06-9ee3-c7a667b20f9b",   // ← нужен правильный
      type: "parent"
    })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.errors?.[0]?.message || "Ошибка регистрации");
  }

  return data.data;
}



// ======================================================
// 2) ЛОГИН (НОВЫЙ SDK)
// ======================================================

export async function loginUser(email, password) {
  try {
    const response = await directus.login({
      email: email,
      password: password
    });

    return response;
  } catch (error) {
    console.error("Ошибка входа:", error);
    throw error;
  }
}




// ======================================================
// 3) ТЕКУЩИЙ ПОЛЬЗОВАТЕЛЬ
// ======================================================

export async function getCurrentUser() {
  try {
    return await directus.request(
      readMe({
        fields: ['id', 'first_name', 'email', 'type', 'role']
      })
    );
  } catch (error) {
    console.error("Ошибка получения пользователя:", error);
    return null;
  }
}



// ======================================================
// 4) ДЕТИ
// ======================================================

export async function getChildren(parentId) {
  return await directus.request(
    readItems('children', {
      filter: { parent: { _eq: parentId } },
      fields: ['id', 'name', 'age', 'grade', 'total_poems_learned']
    })
  );
}


export async function addChild(parentId, name, age, grade) {
  return await directus.request(
    createItem('children', {
      name,
      age,
      grade,
      parent: parentId,
      total_poems_learned: 0
    })
  );
}

export async function getChild(childId) {
  return await directus.request(readItem('children', childId));
}



// ======================================================
// 5) СТИХИ
// ======================================================

export async function getPoems() {
  return await directus.request(
    readItems('poems', {
      fields: ['id', 'title', 'author', 'text', 'grade', 'image']
    })
  );
}



// ======================================================
// 6) СТАТИСТИКА РЕБЁНКА
// ======================================================

export async function getChildStats(childId) {
  try {
    const progressRes = await directus.request(
      readItems('progress', {
        filter: { child: { _eq: childId } },
        sort: ['month'],
        fields: ['month', 'poems_learned', 'poems_planned']
      })
    );

    const learnedRes = await directus.request(
      readItems('learned_poems', {
        filter: { child: { _eq: childId } },
        fields: [
          'id',
          'status',
          'date_learned',
          'time_spent',
          'poem.id',
          'poem.title',
          'poem.author.name',
          'poem.image'
        ]
      })
    );

    const history = learnedRes.filter((l) => l.status === "выучено");
    const planned = learnedRes.filter((l) => l.status !== "выучено");

    return {
      learned: history.length,
      planned: planned.length,
      progress: progressRes.map((p) => ({
        name: p.month,
        value: p.poems_learned
      })),
      history: history.map((l) => ({
        id: l.poem.id,
        title: l.poem.title,
        author: l.poem.author?.name,
        time: l.time_spent,
        image: l.poem.image
      })),
      uploaded: planned.map((l) => ({
        id: l.poem.id,
        title: l.poem.title,
        author: l.poem.author?.name,
        time: l.time_spent,
        image: l.poem.image
      }))
    };
  } catch (error) {
    console.error("Ошибка статистики:", error);
    return {
      learned: 0,
      planned: 0,
      progress: [],
      history: [],
      uploaded: []
    };
  }
}

export default directus;
