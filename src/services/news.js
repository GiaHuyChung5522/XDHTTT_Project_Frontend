import newsData from '../data/news.json';

export async function getNews({ page = 1, limit = 10, q = '' } = {}) {
  const all = Array.isArray(newsData) ? newsData : [];
  const filtered = q ? all.filter(i => String(i.title || '').toLowerCase().includes(String(q).toLowerCase())) : all;
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);
  return { items, page, limit, total: filtered.length };
}
