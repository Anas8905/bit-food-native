export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    [key: string]: any;
}

export interface CartContextType {
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
