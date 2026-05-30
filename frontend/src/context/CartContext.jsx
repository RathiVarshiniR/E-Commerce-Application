import React, { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem('cartItems') || '[]');
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(readCart);

  const persistCart = (items) => {
    setCartItems(items);
    localStorage.setItem('cartItems', JSON.stringify(items));
  };

  const addToCart = (product, quantity = 1) => {
    const nextItems = [...cartItems];
    const existing = nextItems.find((item) => item._id === product._id);

    if (existing) {
      existing.quantity = Math.min(product.stock, existing.quantity + quantity);
    } else {
      nextItems.push({ ...product, quantity: Math.min(product.stock, quantity) });
    }

    persistCart(nextItems);
  };

  const removeFromCart = (id) => {
    persistCart(cartItems.filter((item) => item._id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    persistCart(cartItems.map((item) => (
      item._id === id
        ? { ...item, quantity: Math.min(item.stock, quantity) }
        : item
    )));
  };

  const clearCart = () => persistCart([]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  }), [cartItems, cartCount, cartTotal]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
