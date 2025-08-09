// src/stores/cart.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product, qty = 1) => {
        const id = String(product.id);
        const items = get().items.slice();
        const idx = items.findIndex((it) => String(it.id) === id);
        if (idx >= 0) {
          items[idx] = { ...items[idx], qty: (items[idx].qty || 1) + Number(qty) };
        } else {
          items.push({
            id: product.id,
            name: product.name,
            price: Number(product.price || 0),
            image: product.image || "/src/assets/img/sanpham1.jpg",
            qty: Number(qty) || 1,
          });
        }
        set({ items });
      },

      updateQty: (id, qty) => {
        const items = get().items.map((it) =>
          String(it.id) === String(id) ? { ...it, qty: Math.max(1, Number(qty || 1)) } : it
        );
        set({ items });
      },

      removeItem: (id) => {
        set({ items: get().items.filter((it) => String(it.id) !== String(id)) });
      },

      clearCart: () => set({ items: [] }),

      total: () =>
        get().items.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.qty || 1), 0),
    }),
    { name: "fe-web-cart" }
  )
);
