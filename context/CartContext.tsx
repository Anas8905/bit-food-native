import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  [key: string]: any; // For other dynamic props
}

interface CartContextType {
  cart: CartItem[];
  favorites: CartItem[];
  addToCart: (item: CartItem, quantity?: number) => void;
  removeFromCart: (itemId: string, size?: string) => void;
  removeFromFavorites: (itemId: string, size?: string) => void;
  updateQuantity: (itemId: string, size: string | undefined, quantity: number) => void;
  clearCart: () => void;
  clearFavorites: () => void;
  toggleFavorite: (item: CartItem) => void;
  getCartTotal: () => number;
  isFavorite: (id: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartData = await AsyncStorage.getItem('cart');
        const favoritesData = await AsyncStorage.getItem('favorites');

        if (cartData) setCart(JSON.parse(cartData));
        if (favoritesData) setFavorites(JSON.parse(favoritesData));
      } catch (error) {
        console.log('Error loading cart data', error);
      }
    };

    loadCart();
  }, []);

  const saveCart = async (cartItems: CartItem[]) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.log('Error saving cart', error);
    }
  };

  const saveFavorites = async (favItems: CartItem[]) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(favItems));
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
