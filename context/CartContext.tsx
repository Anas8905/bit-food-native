import { KEYS } from '@/constants/Keys';
import { getData, saveData } from '@/services/asyncStorage';
import { CartContextType, CartItem } from '@/types/cart';
import { createContext, useEffect, useState } from 'react';

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartData = await getData<CartItem[]>(KEYS.CART);
        const favoritesData = await getData<any>(KEYS.FAVORITES);

        if (cartData) setCart(cartData);
        if (favoritesData) setFavorites(favoritesData);
      } catch (error) {
        console.log('Error loading cart data', error);
      }
    };

    loadCart();
  }, []);

  const saveCart = async (cartItems: CartItem[]) => {
    try {
      await saveData(KEYS.CART, cartItems);
    } catch (error) {
      console.log('Error saving cart', error);
    }
  };

  const saveFavorites = async (favItems: CartItem[]) => {
    try {
      await saveData(KEYS.FAVORITES, favItems);
    } catch (error) {
      console.log('Error saving favorites', error);
    }
  };

  const addToCart = (item: CartItem, quantity: number = 1) => {
    const existingItemIndex = cart.findIndex(
      cartItem => cartItem.id === item.id && cartItem.size === item.size
    );

    let newCart: CartItem[];

    if (existingItemIndex >= 0) {
      newCart = [...cart];
      newCart[existingItemIndex].quantity += quantity;
    } else {
      newCart = [...cart, { ...item, quantity }];
    }

    setCart(newCart);
    saveCart(newCart);
  };

  const removeFromCart = (itemId: string, size?: string) => {
    const newCart = cart.filter(
      item => !(item.id === itemId && item.size === size)
    );
    setCart(newCart);
    saveCart(newCart);
  };

  const removeFromFavorites = (itemId: string, size?: string) => {
    const newFav = favorites.filter(
      item => !(item.id === itemId && item.size === size)
    );
    setFavorites(newFav);
    saveFavorites(newFav);
  };

  const updateQuantity = (itemId: string, size: string | undefined, quantity: number) => {
    const newCart = cart.map(item => {
      if (item.id === itemId && item.size === size) {
        return { ...item, quantity };
      }
      return item;
    });

    setCart(newCart);
    saveCart(newCart);
  };

  const clearCart = () => {
    setCart([]);
    saveCart([]);
  };

  const clearFavorites = () => {
    setFavorites([]);
    saveFavorites([]);
  };

  const toggleFavorite = (item: CartItem) => {
    const isFavorite = favorites.some(fav => fav.id === item.id);

    let newFavorites: CartItem[];
    if (isFavorite) {
      newFavorites = favorites.filter(fav => fav.id !== item.id);
    } else {
      newFavorites = [...favorites, item];
    }

    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const isFavorite = (id: string) => {
    return favorites.some(item => item.id === id);
  };

  return (
    <CartContext.Provider
      value={{
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
        isFavorite,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
