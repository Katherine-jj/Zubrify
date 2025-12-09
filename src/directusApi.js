

export const API_URL = "http://localhost:8055";

// 1) Регистрация пользователя
// ================================
export async function registerChild(user) {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      first_name: user.firstName,
      last_name: user.lastName,
      middle_name: user.middleName || null,
      email: user.email,
      password: user.password,
      grade: user.gradeId,
      status: "active",
      role: "61e53b06-0669-4b06-9ee3-c7a667b20f9b"
    })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.errors?.[0]?.message || "Ошибка регистрации");
  }

  return data.data;
}


// 2) Авторизация пользователя
// ================================
export async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      mode: "json"
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.errors?.[0]?.message || "Ошибка входа");
  }

  // Сохраняем токены
  localStorage.setItem("access_token", data.data.access_token);
  localStorage.setItem("refresh_token", data.data.refresh_token);

  // ====== ЗАГРУЖАЕМ ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ ======
  const userRes = await fetch(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${data.data.access_token}`
    }
  });

  const userData = await userRes.json();

  // Сохраняем пользователя в localStorage
  localStorage.setItem("user", JSON.stringify(userData.data));

  return userData.data;
}



// 3) Получить текущего пользователя
// ================================
export async function getCurrentUser() {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  const res = await fetch(
    `${API_URL}/users/me?fields=id,first_name,last_name,grade.id,grade.num,email,ava.id,ava.image.id`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const data = await res.json();
  if (!res.ok) return null;

  return data.data;
}

// создать пользовательский стих

export async function findAuthorByName(name) {
  const res = await fetch(
    `${API_URL}/items/authors?filter[name][_eq]=${encodeURIComponent(name)}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      }
    }
  );

  const data = await res.json();
  return data.data?.[0] || null;
}

export async function createAuthor(name) {
  const res = await fetch(`${API_URL}/items/authors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
    body: JSON.stringify({ name })
  });

  const data = await res.json();
  return data.data;
}

export async function createUserPoem(poem) {
  let authorId = null;

  if (poem.author) {
    // 1. ищем автора в базе
    let author = await findAuthorByName(poem.author);

    // 2. если нет — создаём
    if (!author) {
      author = await createAuthor(poem.author);
    }

    authorId = author.id;
  }

  const res = await fetch(`${API_URL}/items/poems`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify({
      title: poem.title,
      text: poem.text,
      grade: poem.grade,
      owner: poem.owner,
      is_user_uploaded: true,
      author: authorId
    }),
  });

  const data = await res.json();

  if (data.errors) {
    console.error("Ошибка сохранения:", data.errors);
    throw new Error("Failed to create poem");
  }

  return data.data;
}


export async function getUploadedPoems(userId) {
  const res = await fetch(
    `${API_URL}/items/poems?filter[owner][_eq]=${userId}&filter[is_user_uploaded][_eq]=true&fields=id,title,text,image,is_user_uploaded,author.id,author.name`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      }
    }
  );

  const data = await res.json();
  return data.data || [];
}



// 4) Выход из системы
// ================================
export async function logoutUser() {
  const refresh = localStorage.getItem("refresh_token");

  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      refresh_token: refresh,
      mode: "json"
    })
  });

  localStorage.clear();
}


// 5) Получить классы (grades)
// ================================
export async function getGrades() {
  const res = await fetch(`${API_URL}/items/grades?fields=id,num&sort=id`);
  const data = await res.json();

  if (!res.ok) throw new Error("Ошибка загрузки классов");

  return data.data;
}


// 6) Получить стихи
// ================================
export async function getPoems() {
  const res = await fetch(
    `${API_URL}/items/poems?fields=id,title,author.name,text,grade.id,image`
  );
  const data = await res.json();

  if (!res.ok) throw new Error("Ошибка загрузки стихов");

  return data.data;
}

// =======================================================
// 7) Работы с избранным (favorites)
// =======================================================

// Добавить в избранное
export async function addToFavorites(userId, poemId) {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API_URL}/items/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      user: userId,
      poem: poemId
    })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.errors?.[0]?.message || "Ошибка добавления в избранное");

  return data.data;
}


// Удалить из избранного
export async function removeFromFavorites(favoriteId) {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API_URL}/items/favorites/${favoriteId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.errors?.[0]?.message || "Ошибка удаления из избранного");
  }
}


// Проверить — находится ли стих в избранном
export async function getFavoriteRecord(userId, poemId) {
  const token = localStorage.getItem("access_token");

  const res = await fetch(
    `${API_URL}/items/favorites?filter[user][_eq]=${userId}&filter[poem][_eq]=${poemId}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error("Ошибка проверки избранного");

  return data.data?.[0] || null;
}


// Получить весь список избранного пользователя
export async function getFavoritesByUser(userId) {
  const token = localStorage.getItem("access_token");

  const res = await fetch(
    `${API_URL}/items/favorites?filter[user][_eq]=${userId}&fields=id,poem.id,poem.title,poem.author.name,poem.text,poem.image&sort=-created_at`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error("Ошибка загрузки избранного");

  return data.data;
}

export async function getUserProgress(userId) {
  const token = localStorage.getItem("access_token");

  const res = await fetch(
    `${API_URL}/items/progress?filter[user][_eq]=${userId}&fields=id,status,started_at,completed_at,poem.id,poem.title,poem.author.name,poem.image,poem.is_user_uploaded&sort=-completed_at`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error("Ошибка загрузки прогресса");

  return data.data || [];
}

export async function markPoemCompleted(userId, poemId) {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Нет токена авторизации");
  }

  // 1. Ищем существующую запись прогресса
  let res = await fetch(
    `${API_URL}/items/progress?filter[user][_eq]=${userId}&filter[poem][_eq]=${poemId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  let data = await res.json();

  if (!res.ok) {
    console.error("Ошибка поиска прогресса:", data);
    throw new Error(data.errors?.[0]?.message || "Ошибка поиска прогресса");
  }

  const existing = data.data?.[0];

  // 2. Формируем полезную нагрузку
  const nowIso = new Date().toISOString();

  // если запись уже есть — PATCH
  if (existing) {
    res = await fetch(`${API_URL}/items/progress/${existing.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: "completed",
        completed_at: nowIso,
      }),
    });

    data = await res.json();

    if (!res.ok) {
      console.error("Ошибка Directus при обновлении прогресса:", data);
      throw new Error(
        data.errors?.[0]?.message || "Ошибка обновления прогресса"
      );
    }

    return data.data;
  }

  // если записи нет — POST
  res = await fetch(`${API_URL}/items/progress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      user: userId,
      poem: poemId,
      status: "completed",
      started_at: nowIso,
      completed_at: nowIso,
    }),
  });

  data = await res.json();

  if (!res.ok) {
    console.error("Ошибка Directus при создании прогресса:", data);
    throw new Error(
      data.errors?.[0]?.message || "Ошибка создания прогресса"
    );
  }

  return data.data;
}

export async function updateUser(id, data) {

  const body = {};

  if (data.first_name !== undefined) body.first_name = data.first_name;
  if (data.last_name !== undefined) body.last_name = data.last_name;
  if (data.middle_name !== undefined) body.middle_name = data.middle_name;
  if (data.grade !== undefined) body.grade = data.grade;
  if (data.avatar !== undefined) body.avatar = data.avatar;
  if (data.role !== undefined) body.role = data.role;
  if (data.email !== undefined) body.email = data.email;
  if (data.ava !== undefined) body.ava = data.ava;


  // обновление пароля
  if (data.password && data.password.length > 0) {
    body.password = data.password;
  }

  const token = localStorage.getItem("access_token"); // ← исправлено!

  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  const out = await res.json();
  if (!res.ok) {
    throw new Error(out.errors?.[0]?.message || "Не удалось обновить профиль");
  }

  return out.data;
}

export async function getAvatars() {
  const res = await fetch(
    `${API_URL}/items/avatars?fields=id,image.id,image.filename_download`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      }
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error("Ошибка загрузки аватаров");

  return data.data;
}

// Получение истории изучения стихов пользователя
export async function getLearningHistory(userId) {
  const progress = await getUserProgress(userId);

  return progress
    .filter(p => p.status === "completed")
    .map(p => ({
      id: p.poem.id,
      title: p.poem.title,
      author: p.poem.author,
      image: p.poem.image,
      is_user_uploaded: p.poem.is_user_uploaded,
      completed_at: p.completed_at,
      time: p.poem.time || 0
    }))
    .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));
}