// services/products.js
import { api } from '../lib/api';

/**
 * Hỗ trợ cả 2 kiểu API:
 * - json-server style: trả mảng + header X-Total-Count
 * - custom style: trả { data, meta }
 */
export async function getProducts({
  page = 1,
  limit = 20,
  q = '',
  sort = 'id',
  order = 'asc',
} = {}) {
  // json-server style params
  const params = { _page: page, _limit: limit, _sort: sort, _order: order };
  if (q) params.q = q;

  const { data, headers } = await api.getWithHeaders('/products', params);

  const items =
    Array.isArray(data) ? data
    : Array.isArray(data?.data) ? data.data
    : [];

  const total = Number(
    headers.get('x-total-count') ??
    (Array.isArray(data) ? data.length : data?.meta?.total ?? 0)
  );

  return { items, page, limit, total };
}

export async function getProductById(id) {
  return api.get(`/products/${id}`); // api.get trả body trực tiếp
}

// CRUD cho Admin (api.* trả body trực tiếp, KHÔNG có .data)
export async function createProduct(payload) {
  return api.post('/products', payload);
}
export async function updateProduct(id, payload) {
  return api.put(`/products/${id}`, payload);
}
export async function patchProduct(id, payload) {
  return api.patch(`/products/${id}`, payload);
}
export async function deleteProduct(id) {
  return api.delete(`/products/${id}`);
}
