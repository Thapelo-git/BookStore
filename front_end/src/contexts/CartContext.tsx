import React, { createContext, useContext, useState, useCallback } from 'react';
import { Book, CartItem } from '../types/book';
import { toast } from '../hooks/use-toast';

interface CartContextType {
  items: CartItem[]; 
  addToCart: (book: Book, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((book: Book, quantity = 1) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.book._id === book._id);
      if (existingItem) {
        return prev.map((item) =>
          item.book._id === book._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { book, quantity }];
    });
    toast({
      title: 'Added to cart',
      description: `${book.title} has been added to your cart.`,
    });
  }, []);

  const removeFromCart = useCallback((bookId: string) => {
    setItems((prev) => prev.filter((item) => item.book._id !== bookId));
    toast({
      title: 'Removed from cart',
      description: 'Item has been removed from your cart.',
    });
  }, []);

  const updateQuantity = useCallback((bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.book._id === bookId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
