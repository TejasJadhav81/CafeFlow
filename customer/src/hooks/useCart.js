import { useState, useCallback } from 'react';

export function useCart() {
  const [cart, setCart] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState(0);

  const addToCart = useCallback((item, qty) => {
    setCart(prev => {
      const idx = prev.findIndex(p => p.name === item.name);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { name: item.name, price: item.price, glyph: item.glyph || '☕', qty }];
    });
    setRecentlyAdded(Date.now());
  }, []);

  const incrementItem = useCallback((name) => {
    setCart(p => p.map(r => r.name === name ? { ...r, qty: r.qty + 1 } : r));
  }, []);

  const decrementItem = useCallback((name) => {
    setCart(p => p.flatMap(r => r.name !== name ? [r] : r.qty > 1 ? [{ ...r, qty: r.qty - 1 }] : []));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((a, b) => a + b.qty, 0);
  const cartTotal = cart.reduce((a, b) => a + b.qty * b.price, 0);

  return { cart, addToCart, incrementItem, decrementItem, clearCart, recentlyAdded, cartCount, cartTotal };
}
