import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { asyncStorage } from '@/services/asyncStorage';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      favorites: [],

      hydrate: async () => {
        if (useCartStore.persist.hasHydrated()) return;
        await new Promise<void>((resolve) => {
          const unsub = useCartStore.persist.onFinishHydration(() => {
            unsub();
            resolve();
          });
        });
      },

      // ------------------ CART ----------------------
      addToCart: (item, quantity = 1) => {
        const cart = get().cart;
        const idx = cart.findIndex((c) => c.id === item.id && c.size === item.size);

        const next =
          idx >= 0
            ? cart.map((c, i) => (i === idx ? { ...c, quantity: c.quantity + quantity } : c))
            : [...cart, { ...item, quantity }];

        set({ cart: next });
      },

      removeFromCart: (itemId, size) => {
        const next = get().cart.filter((c) => !(c.id === itemId && c.size === size));
        set({ cart: next });
      },

      updateQuantity: (itemId, size, quantity) => {
        const next = get().cart.map((c) =>
          c.id === itemId && c.size === size ? { ...c, quantity } : c
        );
        set({ cart: next });
      },

      clearCart: () => {
        set({ cart: [] });
      },

      // ---------------- Favorites -------------------
      toggleFavorite: (item) => {
        const favorites = get().favorites;
        const isFav = favorites.some((f) => f.id === item.id);
        const next = isFav ? favorites.filter((f) => f.id !== item.id) : [...favorites, item];
        set({ favorites: next });
      },

      removeFromFavorites: (itemId, size) => {
        const next = get().favorites.filter((f) => !(f.id === itemId && f.size === size));
        set({ favorites: next });
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },

      reset: async () => {
        set({
          cart: [],
          favorites: [],
        });
      },

      getCartTotal: () => get().cart.reduce((sum, it) => sum + it.price * it.quantity, 0),

      isInCart: (id) => get().cart.some((c) => c.id === id),

      isFavorite: (id) => get().favorites.some((f) => f.id === id),
    }),
    {
      name: 'cart-store',
      storage: createJSONStorage(() => asyncStorage),
      partialize: (s) => ({ cart: s.cart, favorites: s.favorites }),
      version: 1,
    }
  )
);
