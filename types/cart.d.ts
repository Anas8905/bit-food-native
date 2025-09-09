interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    image?: any;
    dips?: string[];
    [key: string]: any;
}

interface CartStateType {
    cart: CartItem[];
    cartItemsCount: number;
    favItemsCount: number;
    favorites: CartItem[];
    addToCart: (item: CartItem, quantity?: number) => void;
    removeFromCart: (itemId: string, size?: string) => void;
    removeFromFavorites: (itemId: string, size?: string) => void;
    updateQuantity: (itemId: string, size: string | undefined, quantity: number) => void;
    clearCart: () => void;
    clearFavorites: () => void;
    toggleFavorite: (item: CartItem) => void;
    getCartTotal: () => number;
    isInCart: (id: string) => boolean;
    isFavorite: (id: string) => boolean;
}

type CartState = {
  cart: CartItem[];
  favorites: CartItem[];
  hydrate: () => Promise<void>;

  addToCart: (item: CartItem, quantity?: number) => void;
  removeFromCart: (itemId: string, size?: string) => void;
  updateQuantity: (itemId: string, size: string | undefined, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (item: CartItem) => void;
  removeFromFavorites: (itemId: string, size?: string) => void;
  clearFavorites: () => void;
  reset: () => Promise<void>;
  getCartTotal: () => number;
  isFavorite: (id: string) => boolean;
  isInCart: (id: string) => boolean;
};