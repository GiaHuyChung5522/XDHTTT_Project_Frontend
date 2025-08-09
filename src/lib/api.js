// src/lib/api.js
const baseURL = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${baseURL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
  }
  return res; // trả Response để dùng 2 chế độ
}

async function json(res) {
  // json-server luôn trả JSON (trừ 204)
  return res.status !== 204 ? res.json() : null;
}

export const api = {
  async get(path, params) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    const res = await request(`${path}${query}`);
    return json(res); // chỉ body
  },
  async getWithHeaders(path, params) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    const res = await request(`${path}${query}`);
    const data = await json(res);
    return { data, headers: res.headers };
  },
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }).then(json),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }).then(json),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }).then(json),
  delete: (path) => request(path, { method: 'DELETE' }).then(json),
};
