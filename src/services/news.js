import { api } from '../lib/api';

export async function getNews({ page = 1, limit = 10, q = '' } = {}) {
  const params = { _page: page, _limit: limit };
  if (q) params.q = q;
  const { data, headers } = await api.getWithHeaders('/news', params);
  const total = Number(headers.get('x-total-count') || (Array.isArray(data) ? data.length : 0));
  return { items: data || [], page, limit, total };
}
