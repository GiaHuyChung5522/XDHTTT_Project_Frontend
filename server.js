// server.js — JSON Server + json-server-auth + custom APIs
// ESM, Node >= 18 (có top-level await)

import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 0) SECRET: đồng bộ với json-server-auth (mặc định 'secret')
//    Bạn đã set trong package.json bằng cross-env nên cứ để thế là auto khớp.
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const PORT = process.env.PORT || 3001;
console.log('[BOOT] JWT_SECRET =', JWT_SECRET);

// 1) Dynamic import lib chính
const { default: jsonServer } = await import('json-server');
const { default: auth } = await import('json-server-auth');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2) App + DB
const app = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
app.db = router.db;

// 3) Bảo vệ tài nguyên: 600=owner-only, 664=phải login mới ghi, 444=chỉ đọc
const rules = auth.rewriter({
  users: 600,

  carts: 600,
  cartItems: 600,

  wishlists: 600,
  wishlistItems: 600,

  orders: 600,
  orderItems: 600,

  addresses: 600,

  // Cho phép ghi khi đăng nhập, nhưng bên dưới sẽ thêm guard "admin only" cho mutate /products
  products: 664,
  categories: 444,
  brands: 444,

  reviews: 664,      // tạo/sửa khi đăng nhập
  news: 444,
  promotions: 444,
  banners: 444,
  stores: 444,

  coupons: 664
});

// 4) Middlewares gốc
app.use(cors({ origin: true, credentials: true }));
app.use(jsonServer.bodyParser);
app.use(rules);
app.use(auth); // /register, /login

// 5) Helpers chung
function requireAuth(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.replace(/^Bearer\s+/i, '').trim();
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    req.userId = Number(payload.id || payload.sub);
    if (!req.userId) throw new Error('No user id in token');
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
function paginate(list, req) {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 12);
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: list.slice(start, end),
    meta: { page, limit, total: list.length, pages: Math.ceil(list.length / limit) }
  };
}
function sortList(list, sort) {
  if (!sort) return list;
  const [field, dir] = sort.split(':');
  const asc = (dir || 'asc').toLowerCase() !== 'desc';
  return list.sort((a, b) => {
    const va = a[field], vb = b[field];
    if (va === vb) return 0;
    return asc ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
  });
}

// 6) PRODUCTS (search/filter/sort/paginate)
app.get('/products', (req, res) => {
  let list = router.db.get('products').value() || [];
  const { search, categoryId, brandId, minPrice, maxPrice, sort } = req.query;

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(p =>
      String(p.name || '').toLowerCase().includes(q) ||
      String(p.description || '').toLowerCase().includes(q)
    );
  }
  if (categoryId) list = list.filter(p => String(p.categoryId) === String(categoryId));
  if (brandId) list = list.filter(p => String(p.brandId) === String(brandId));
  if (minPrice) list = list.filter(p => Number(p.price) >= Number(minPrice));
  if (maxPrice) list = list.filter(p => Number(p.price) <= Number(maxPrice));

  list = sortList(list, sort);
  res.json(paginate(list, req));
});

// product detail + rating summary
app.get('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const p = router.db.get('products').find({ id }).value();
  if (!p) return res.status(404).json({ error: 'Not found' });

  const reviews = router.db.get('reviews').filter({ productId: id }).value() || [];
  const ratingCount = reviews.length;
  const ratingAvg = ratingCount
    ? Math.round((reviews.reduce((s, r) => s + (r.rating || 0), 0) / ratingCount) * 10) / 10
    : 0;

  res.json({ ...p, rating: { avg: ratingAvg, count: ratingCount } });
});

// recommendations: cùng category/brand
app.get('/recommendations', (req, res) => {
  const productId = Number(req.query.productId);
  const base = router.db.get('products').find({ id: productId }).value();
  if (!base) return res.json([]);
  const list = router.db.get('products').filter(p =>
    p.id !== productId && (p.categoryId === base.categoryId || p.brandId === base.brandId)
  ).take(12).value();
  res.json(list);
});

// REVIEWS
app.get('/products/:id/reviews', (req, res) => {
  const productId = Number(req.params.id);
  const list = router.db.get('reviews').filter({ productId }).value() || [];
  const sorted = sortList(list, req.query.sort || 'createdAt:desc');
  res.json(paginate(sorted, req));
});
app.post('/products/:id/reviews', requireAuth, (req, res) => {
  const productId = Number(req.params.id);
  const { rating, comment } = req.body || {};
  if (!rating) return res.status(400).json({ error: 'rating required' });

  const reviews = router.db.get('reviews');
  const last = reviews.value()?.slice(-1)[0];
  const nextId = (last?.id || 0) + 1;

  const item = {
    id: nextId,
    productId,
    userId: req.userId,
    rating: Number(rating),
    comment: comment || '',
    createdAt: Date.now()
  };
  reviews.push(item).write();
  res.status(201).json(item);
});

// NEWS / PROMOTIONS (có phân trang)
app.get('/news', (req, res) => {
  let list = router.db.get('news').value() || [];
  if (req.query.active) {
    const target = String(req.query.active) === 'true';
    list = list.filter(n => Boolean(n.active) === target);
  }
  list = sortList(list, req.query.sort || 'date:desc');
  res.json(paginate(list, req));
});
app.get('/promotions', (req, res) => {
  let list = router.db.get('promotions').filter(p => p.active !== false).value() || [];
  res.json(paginate(list, req));
});

// AUTH HELPERS
app.get('/me', requireAuth, (req, res) => {
  const me = router.db.get('users').find({ id: req.userId }).value();
  res.json(me);
});
app.patch('/me', requireAuth, (req, res) => {
  const updates = { ...req.body };
  delete updates.password;
  const user = router.db.get('users').find({ id: req.userId }).assign(updates).write();
  res.json(user);
});

// CART
app.get('/cart', requireAuth, (req, res) => {
  const cart = router.db.get('carts').find({ userId: req.userId }).value();
  const cartId = cart?.id;
  const items = cartId ? router.db.get('cartItems').filter({ cartId }).value() : [];
  const products = router.db.get('products').value() || [];
  const detailed = items.map(it => {
    const p = products.find(x => x.id === it.productId);
    return {
      ...it,
      product: p ? { id: p.id, name: p.name, price: p.price, image: p.image, stock: p.stock } : null
    };
  });
  const total = detailed.reduce((s, it) => s + (it.product?.price || 0) * it.quantity, 0);
  res.json({ items: detailed, total });
});
app.post('/cart/items', requireAuth, (req, res) => {
  const { productId, quantity } = req.body || {};
  if (!productId) return res.status(400).json({ error: 'productId required' });
  const qty = Math.max(1, Number(quantity || 1));

  // ensure cart exists
  let cart = router.db.get('carts').find({ userId: req.userId }).value();
  if (!cart) {
    const last = router.db.get('carts').value()?.slice(-1)[0];
    const nextId = (last?.id || 0) + 1;
    cart = { id: nextId, userId: req.userId, createdAt: Date.now() };
    router.db.get('carts').push(cart).write();
  }
  const cartId = cart.id;

  // upsert item
  const items = router.db.get('cartItems');
  const exist = items.find({ cartId, productId }).value();
  if (exist) {
    const updated = items.find({ id: exist.id }).assign({ quantity: exist.quantity + qty }).write();
    return res.status(200).json(updated);
  } else {
    const lastItem = items.value()?.slice(-1)[0];
    const nextItemId = (lastItem?.id || 0) + 1;
    const newItem = { id: nextItemId, cartId, productId, quantity: qty, addedAt: Date.now() };
    items.push(newItem).write();
    return res.status(201).json(newItem);
  }
});
app.patch('/cart/items/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const item = router.db.get('cartItems').find({ id }).value();
  const cart = item && router.db.get('carts').find({ id: item.cartId }).value();
  if (!item || cart.userId !== req.userId) return res.status(404).json({ error: 'Not found' });

  const qty = Math.max(1, Number(req.body.quantity || 1));
  const updated = router.db.get('cartItems').find({ id }).assign({ quantity: qty }).write();
  res.json(updated);
});
app.delete('/cart/items/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const item = router.db.get('cartItems').find({ id }).value();
  const cart = item && router.db.get('carts').find({ id: item.cartId }).value();
  if (!item || cart.userId !== req.userId) return res.status(404).json({ error: 'Not found' });

  router.db.get('cartItems').remove({ id }).write();
  res.status(204).end();
});
app.delete('/cart', requireAuth, (req, res) => {
  const cart = router.db.get('carts').find({ userId: req.userId }).value();
  if (cart) router.db.get('cartItems').remove({ cartId: cart.id }).write();
  res.status(204).end();
});

// WISHLIST
app.get('/wishlist', requireAuth, (req, res) => {
  let wl = router.db.get('wishlists').find({ userId: req.userId }).value();
  if (!wl) return res.json({ items: [] });
  const items = router.db.get('wishlistItems').filter({ wishlistId: wl.id }).value() || [];
  const products = router.db.get('products').value() || [];
  const detailed = items.map(it => {
    const p = products.find(x => x.id === it.productId);
    return { ...it, product: p ? { id: p.id, name: p.name, price: p.price, image: p.image } : null };
  });
  res.json({ items: detailed });
});
app.post('/wishlist', requireAuth, (req, res) => {
  const { productId } = req.body || {};
  if (!productId) return res.status(400).json({ error: 'productId required' });

  let wl = router.db.get('wishlists').find({ userId: req.userId }).value();
  if (!wl) {
    const last = router.db.get('wishlists').value()?.slice(-1)[0];
    const nextId = (last?.id || 0) + 1;
    wl = { id: nextId, userId: req.userId, createdAt: Date.now() };
    router.db.get('wishlists').push(wl).write();
  }
  const exists = router.db.get('wishlistItems').find({ wishlistId: wl.id, productId }).value();
  if (exists) return res.status(200).json(exists);

  const lastItem = router.db.get('wishlistItems').value()?.slice(-1)[0];
  const nextItemId = (lastItem?.id || 0) + 1;
  const item = { id: nextItemId, wishlistId: wl.id, productId, addedAt: Date.now() };
  router.db.get('wishlistItems').push(item).write();
  res.status(201).json(item);
});
app.delete('/wishlist/:productId', requireAuth, (req, res) => {
  const pid = Number(req.params.productId);
  const wl = router.db.get('wishlists').find({ userId: req.userId }).value();
  if (!wl) return res.status(204).end();
  router.db.get('wishlistItems').remove({ wishlistId: wl.id, productId: pid }).write();
  res.status(204).end();
});

// ADDRESSES
app.get('/addresses', requireAuth, (req, res) => {
  const list = router.db.get('addresses').filter({ userId: req.userId }).value() || [];
  res.json(list);
});
app.post('/addresses', requireAuth, (req, res) => {
  const last = router.db.get('addresses').value()?.slice(-1)[0];
  const nextId = (last?.id || 0) + 1;
  const payload = { ...req.body, id: nextId, userId: req.userId, isDefault: Boolean(req.body.isDefault) };
  if (payload.isDefault) {
    router.db.get('addresses').filter({ userId: req.userId }).each(a => { a.isDefault = false; }).write();
  }
  router.db.get('addresses').push(payload).write();
  res.status(201).json(payload);
});
app.patch('/addresses/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const addr = router.db.get('addresses').find({ id }).value();
  if (!addr || addr.userId !== req.userId) return res.status(404).json({ error: 'Not found' });
  const updates = { ...req.body };
  if (updates.isDefault === true) {
    router.db.get('addresses').filter({ userId: req.userId }).each(a => { a.isDefault = false; }).write();
  }
  const updated = router.db.get('addresses').find({ id }).assign(updates).write();
  res.json(updated);
});
app.delete('/addresses/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const addr = router.db.get('addresses').find({ id }).value();
  if (!addr || addr.userId !== req.userId) return res.status(404).json({ error: 'Not found' });
  router.db.get('addresses').remove({ id }).write();
  res.status(204).end();
});

// COUPONS
app.post('/coupons/validate', (req, res) => {
  const { code, cartTotal } = req.body || {};
  const c = router.db.get('coupons')
    .find(c => String(c.code).toUpperCase() === String(code).toUpperCase()).value();
  if (!c || c.active === false) return res.status(404).json({ error: 'Invalid coupon' });

  const now = Date.now();
  const st = c.startDate ? Date.parse(c.startDate) : null;
  const en = c.endDate ? Date.parse(c.endDate) : null;
  if ((st && now < st) || (en && now > en)) return res.status(400).json({ error: 'Coupon expired' });
  if (c.minOrder && Number(cartTotal || 0) < Number(c.minOrder)) {
    return res.status(400).json({ error: 'Order total too low' });
  }
  res.json(c);
});

// CHECKOUT → tạo order từ cart
app.post('/checkout', requireAuth, (req, res) => {
  const { addressId, paymentMethod = 'cod', couponCode } = req.body || {};
  const cart = router.db.get('carts').find({ userId: req.userId }).value();
  if (!cart) return res.status(400).json({ error: 'Cart empty' });
  const items = router.db.get('cartItems').filter({ cartId: cart.id }).value() || [];
  if (items.length === 0) return res.status(400).json({ error: 'Cart empty' });

  const products = router.db.get('products').value() || [];
  const detailed = items.map(it => {
    const p = products.find(x => x.id === it.productId);
    if (!p) throw new Error('Product not found: ' + it.productId);
    return { ...it, product: p };
  });

  let subtotal = detailed.reduce((s, it) => s + it.product.price * it.quantity, 0);
  let discount = 0;
  let coupon = null;
  if (couponCode) {
    coupon = router.db.get('coupons')
      .find(c => String(c.code).toUpperCase() === String(couponCode).toUpperCase()).value();
    if (coupon && coupon.active !== false) {
      if (coupon.discountType === 'percent') discount = Math.floor(subtotal * (coupon.discountValue / 100));
      if (coupon.discountType === 'amount')  discount = Number(coupon.discountValue);
    }
  }
  const total = Math.max(0, subtotal - discount);

  const orders = router.db.get('orders');
  const orderItems = router.db.get('orderItems');
  const lastOrder = orders.value()?.slice(-1)[0];
  const nextOrderId = (lastOrder?.id || 0) + 1;

  const order = {
    id: nextOrderId,
    userId: req.userId,
    status: 'pending', // pending -> paid -> shipped -> completed / canceled
    paymentMethod,
    couponCode: coupon?.code || null,
    subtotal, discount, total,
    addressId: addressId || null,
    createdAt: Date.now()
  };
  orders.push(order).write();

  detailed.forEach(it => {
    const lastItem = orderItems.value()?.slice(-1)[0];
    const nextItemId = (lastItem?.id || 0) + 1;
    orderItems.push({
      id: nextItemId,
      orderId: nextOrderId,
      productId: it.product.id,
      name: it.product.name,
      price: it.product.price,
      image: it.product.image,
      quantity: it.quantity
    }).write();
  });

  // clear cart
  router.db.get('cartItems').remove({ cartId: cart.id }).write();

  res.status(201).json(order);
});

// ORDERS
app.get('/orders', requireAuth, (req, res) => {
  let list = router.db.get('orders').filter({ userId: req.userId }).value() || [];
  if (req.query.status) list = list.filter(o => o.status === req.query.status);
  list = sortList(list, req.query.sort || 'createdAt:desc');
  res.json(paginate(list, req));
});
app.get('/orders/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const order = router.db.get('orders').find({ id }).value();
  if (!order || order.userId !== req.userId) return res.status(404).json({ error: 'Not found' });
  const items = router.db.get('orderItems').filter({ orderId: id }).value() || [];
  res.json({ ...order, items });
});
app.post('/orders/:id/cancel', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const order = router.db.get('orders').find({ id }).value();
  if (!order || order.userId !== req.userId) return res.status(404).json({ error: 'Not found' });
  if (order.status !== 'pending') return res.status(400).json({ error: 'Cannot cancel' });
  const updated = router.db.get('orders').find({ id }).assign({ status: 'canceled' }).write();
  res.json(updated);
});
app.post('/orders/:id/pay', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const order = router.db.get('orders').find({ id }).value();
  if (!order || order.userId !== req.userId) return res.status(404).json({ error: 'Not found' });
  if (order.status !== 'pending') return res.status(400).json({ error: 'Already paid or invalid' });
  const updated = router.db.get('orders').find({ id }).assign({ status: 'paid', paidAt: Date.now() }).write();
  res.json(updated);
});
app.post('/orders/:id/confirm-received', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const order = router.db.get('orders').find({ id }).value();
  if (!order || order.userId !== req.userId) return res.status(404).json({ error: 'Not found' });
  if (!['shipped', 'paid'].includes(order.status)) return res.status(400).json({ error: 'Invalid status' });
  const updated = router.db.get('orders').find({ id }).assign({ status: 'completed', completedAt: Date.now() }).write();
  res.json(updated);
});

// ADMIN-ONLY cho mutate /products (dựa vào role từ DB)
app.use((req, res, next) => {
  const mutate = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
  if (mutate && req.path.startsWith('/products')) {
    const h = req.headers.authorization || '';
    const token = h.replace(/^Bearer\s+/i, '').trim();
    if (!token) return res.status(401).json({ error: 'Missing token' });
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      const uid = Number(payload.id || payload.sub);
      const account = router.db.get('users').find({ id: uid }).value();
      if (!account || account.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: admin only' });
      }
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
  next();
});

// Mount default JSON routes
app.use(router);

// Start
app.listen(PORT, () => {
  console.log(`✅ JSON Server + Auth + Custom API running at http://localhost:${PORT}`);
});
