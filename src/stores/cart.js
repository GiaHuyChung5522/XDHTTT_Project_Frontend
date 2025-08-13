import { create } from "zustand";
import { persist } from "zustand/middleware";

const clampQty = (q) => Math.min(999, Math.max(1, parseInt(q, 10) || 1));

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product, qty = 1) => {
        const id = String(product.id);
        const items = get().items.slice();
        const idx = items.findIndex((it) => String(it.id) === id);
        const n = clampQty(qty);
        if (idx >= 0) {
          items[idx] = { ...items[idx], qty: clampQty((items[idx].qty || 1) + n) };
        } else {
          items.push({
            id: product.id,
            name: product.name,
            price: Number(product.price || 0),
            image: product.image || "/src/assets/img/sanpham1.jpg",
            qty: n,
          });
        }
        set({ items });
      },

      updateQty: (id, qty) =>
        set({
          items: get().items.map((it) =>
            String(it.id) === String(id) ? { ...it, qty: clampQty(qty) } : it
          ),
        }),

      incQty: (id, step = 1) =>
        set({
          items: get().items.map((it) =>
            String(it.id) === String(id)
              ? { ...it, qty: clampQty((it.qty || 1) + step) }
              : it
          ),
        }),

      decQty: (id, step = 1) =>
        set({
          items: get().items.map((it) =>
            String(it.id) === String(id)
              ? { ...it, qty: clampQty((it.qty || 1) - step) }
              : it
          ),
        }),

      removeItem: (id) =>
        set({ items: get().items.filter((it) => String(it.id) !== String(id)) }),

      clearCart: () => set({ items: [] }),

      total: () =>
        get().items.reduce(
          (sum, it) => sum + Number(it.price || 0) * Number(it.qty || 1),
          0
        ),

      itemCount: () => get().items.reduce((c, it) => c + (it.qty || 1), 0),
    }),
    { name: "fe-web-cart" }
  )
);
