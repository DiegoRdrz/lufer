const API_URL = import.meta.env.VITE_API_URL || '';

export async function fetchAuthUser() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data; // { id, rol }
  } catch {
    return null;
  }
}
