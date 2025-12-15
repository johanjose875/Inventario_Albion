import { apiFetch } from "./api";

export async function getItems() {
  return apiFetch("/items");
}

export async function getMovements() {
  return apiFetch("/movements");
}

export async function login(username: string, password: string) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}
