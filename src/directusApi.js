

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

  localStorage.setItem("access_token", data.data.access_token);
  localStorage.setItem("refresh_token", data.data.refresh_token);

  return data.data;
}


// 3) Получить текущего пользователя
// ================================
export async function getCurrentUser() {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  const res = await fetch(
    `${API_URL}/users/me?fields=id,first_name,last_name,grade.id,grade.num,email`,
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
