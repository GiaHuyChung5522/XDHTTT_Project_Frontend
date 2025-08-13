// src/services/authService.js
import { api } from "./http";
import { setAuth, getAuth, clearAuth } from "../utils/storage";

export async function login({ email, password }) {
  const { data } = await api.post("/login", { email, password });
  // data = { accessToken, user }
  setAuth({ token: data.accessToken, user: data.user });
  return { token: data.accessToken, user: data.user };
}

export async function register({ name, email, password, role }) {
  const payload = { name, email, password };
  if (role) payload.role = role; // DEV seeding
  const { data } = await api.post("/register", payload);
  setAuth({ token: data.accessToken, user: data.user });
  return { token: data.accessToken, user: data.user };
}

export async function getProfile() {
  const auth = getAuth();
  if (!auth?.user?.id) return null;
  const { data } = await api.get(`/users/${auth.user.id}`);
  return { token: auth.token, user: data };
}

export async function logout() {
  clearAuth();
}
