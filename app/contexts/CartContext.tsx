'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';

// Update the CartItem interface to include quantity
export interface CartItem {
  collectibleId: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number; 
}

// Update the context type to include the new remove function
interface CartContextType {
  isOpen: boolean;
  cartItems: CartItem[];
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (collectibleId: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from cookies on initial render
  useEffect(() => {
    const storedCart = Cookies.get('shopping-cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to cookies whenever it changes
  useEffect(() => {
    Cookies.set('shopping-cart', JSON.stringify(cartItems), { expires: 7 });
  }, [cartItems]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = (itemToAdd: Omit<CartItem, 'quantity'>) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.collectibleId === itemToAdd.collectibleId);

      if (existingItem) {
        return prevItems.map(item =>
          item.collectibleId === itemToAdd.collectibleId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...itemToAdd, quantity: 1 }];
      }
    });
  };

  // Function to remove a specific quantity of an item from the cart
  const removeFromCart = (collectibleId: number, quantityToRemove: number) => {
    setCartItems(prevItems => {
        const itemToUpdate = prevItems.find(item => item.collectibleId === collectibleId);

        if (itemToUpdate) {
            const newQuantity = itemToUpdate.quantity - quantityToRemove;
            if (newQuantity > 0) {
                // If quantity is still > 0, update the item
                return prevItems.map(item =>
                    item.collectibleId === collectibleId
                        ? { ...item, quantity: newQuantity }
                        : item
                );
            } else {
                // If quantity is 0 or less, remove the item completely
                return prevItems.filter(item => item.collectibleId !== collectibleId);
            }
        }
        return prevItems; // If item not found, return original state
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const value = { isOpen, cartItems, openCart, closeCart, addToCart, removeFromCart, clearCart, itemCount };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use the CartContext
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
