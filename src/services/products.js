import { api } from '../lib/api';

export async function getProducts({ page = 1, limit = 20, q = '', sort = 'id', order = 'asc' } = {}) {
  const params = { _page: page, _limit: limit, _sort: sort, _order: order };
  if (q) params.q = q;
  const { data, headers } = await api.getWithHeaders('/products', params);
  const total = Number(headers.get('x-total-count') || (Array.isArray(data) ? data.length : 0));
  return { items: data || [], page, limit, total };
}

export async function getProductById(id) {
  return api.get(`/products/${id}`);
}


// CRUD cho Admin
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
