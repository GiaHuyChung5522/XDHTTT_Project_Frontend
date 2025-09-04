// src/lib/api.js
const baseURL = '/api';

// Lấy Bearer token từ localStorage.auth (nếu có)
function getAuthHeader() {
  try {
    const raw = localStorage.getItem('auth');
    if (!raw) return {};
    const { token, accessToken } = JSON.parse(raw);
    const bearer = token || accessToken;
    return bearer ? { Authorization: `Bearer ${bearer}` } : {};
  } catch {
    return {};
  }
}

// Hỗ trợ cả 2 kiểu params:
// - json-server style: { _page, _limit, q, ... }
// - axios style: { params: { _page, _limit, q, ... } }
function normalizeParams(p) {
  if (!p) return null;
  return p.params && typeof p.params === 'object' ? p.params : p;
}

function buildQuery(params) {
  const qp = normalizeParams(params);
  return qp ? `?${new URLSearchParams(qp).toString()}` : '';
}

async function request(path, options = {}) {
  // Gộp headers: JSON + Auth + headers truyền vào
  const mergedHeaders = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  // AbortController cho khả năng hủy nếu cần (optional)
  const ctrl = new AbortController();
  const timeout = options.timeout ?? 0;
  let timer = null;
  if (timeout > 0) {
    timer = setTimeout(() => ctrl.abort(), timeout);
  }

  const res = await fetch(`${baseURL}${path}`, {
    ...options,
    headers: mergedHeaders,
    signal: ctrl.signal,
  }).catch((e) => {
    if (timer) clearTimeout(timer);
    throw e;
  });

  if (timer) clearTimeout(timer);

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
  }
  return res; // trả Response để dùng 2 chế độ
}

async function json(res) {
  if (res.status === 204) return null;
  
  try {
    const text = await res.text();
    console.log('Raw response text:', text);
    
    if (!text) return null;
    
    // Kiểm tra nếu response là text thay vì JSON
    if (text.startsWith('This action returns') || !text.trim().startsWith('{') && !text.trim().startsWith('[')) {
      console.warn('Backend trả về text thay vì JSON, sử dụng mock data');
      throw new Error('Backend response is not JSON format');
    }
    
    return JSON.parse(text);
  } catch (error) {
    console.error('JSON parse error:', error);
    throw new Error(`Invalid JSON response: ${error.message}`);
  }
}

export const api = {
  // GET chỉ body
  async get(path, params) {
    const query = buildQuery(params);
    const res = await request(`${path}${query}`);
    return json(res);
  },

  // GET trả cả body + headers
  async getWithHeaders(path, params) {
    const query = buildQuery(params);
    const res = await request(`${path}${query}`);
    const data = await json(res);
    // Tiện ích đọc header không phân biệt hoa thường
    const headers = res.headers;
    const get = (k) => headers.get(String(k).toLowerCase()) ?? headers.get(String(k));
    return { data, headers: { ...headers, get } };
  },

  // POST/PUT/PATCH/DELETE
  post: (path, body, opts) =>
    request(path, { method: 'POST', body: JSON.stringify(body ?? {}), ...(opts || {}) }).then(json),
  put: (path, body, opts) =>
    request(path, { method: 'PUT', body: JSON.stringify(body ?? {}), ...(opts || {}) }).then(json),
  patch: (path, body, opts) =>
    request(path, { method: 'PATCH', body: JSON.stringify(body ?? {}), ...(opts || {}) }).then(json),
  delete: (path, opts) =>
    request(path, { method: 'DELETE', ...(opts || {}) }).then(json),
};
