// src/servicios/api.ts

const API_URL = "http://localhost:3000"; 
// cuando publiques el backend, aquí irá la URL real

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error("Error en la API");
  }

  return response.json();
}
