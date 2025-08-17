// src/services/http.js
import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export const api = axios.create({
  baseURL: '/api',
  headers: { "Content-Type": "application/json" },
});

// Gắn Authorization từ localStorage (key "auth")
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("auth");
    console.log('Raw auth data:', raw); //kiem tra xem co du lieu khong
    if (raw) {
      const { token, accessToken } = JSON.parse(raw);
      console.log('Parsed auth data:', { token, accessToken }); //kiem tra xem co du lieu khong
      const bearer = token || accessToken;
      console.log('Bearer:', bearer); //kiem tra xem co du lieu khong
      if (bearer) config.headers.Authorization = `Bearer ${bearer}`;
    }
    } catch (error) {
    console.error('Auth interceptor error:', error); // Thêm log này
  }
  return config;
});
