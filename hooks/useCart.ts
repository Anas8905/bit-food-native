import { useMemo } from 'react';
import { useCartStore } from '@/stores/cart';

export const useCart = (): CartStateType => {
  const cart       = useCartStore((s) => s.cart);
  const favorites  = useCartStore((s) => s.favorites);

  const addToCart          = useCartStore((s) => s.addToCart);
  const removeFromCart     = useCartStore((s) => s.removeFromCart);
  const removeFromFavorites= useCartStore((s) => s.removeFromFavorites);
  const updateQuantity     = useCartStore((s) => s.updateQuantity);
  const clearCart          = useCartStore((s) => s.clearCart);
  const clearFavorites     = useCartStore((s) => s.clearFavorites);
  const toggleFavorite     = useCartStore((s) => s.toggleFavorite);
  const getCartTotal       = useCartStore((s) => s.getCartTotal);
  const isInCart           = useCartStore((s) => s.isInCart);
  const isFavorite         = useCartStore((s) => s.isFavorite);
  const favItemsCount      = favorites.length;
  const cartItemsCount     = useMemo(() =>
    cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  return {
    cart,
    favorites,
    addToCart,
    removeFromCart,
    removeFromFavorites,
    updateQuantity,
    clearCart,
    clearFavorites,
    toggleFavorite,
    getCartTotal,
    isInCart,
    isFavorite,
    cartItemsCount,
    favItemsCount,
  };
};
