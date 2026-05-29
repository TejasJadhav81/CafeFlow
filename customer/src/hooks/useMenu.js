import { useState, useEffect } from 'react';
import { subscribeMenu } from '../firebase/firestore';

const FALLBACK_MENU = [
  { id: 'house-espresso', name: 'House Espresso', cat: 'Coffee', price: 140, description: 'Single origin Chikmagalur. Dark, syrupy.', glyph: '☕', available: true, featured: true, size: 21, dx: -4, ang: -1 },
  { id: 'flat-white', name: 'Flat White', cat: 'Coffee', price: 220, description: 'Velvety microfoam, double ristretto.', glyph: '🥛', available: true, size: 18, dx: 8, ang: 0, couples: true },
  { id: 'cortado', name: 'Cortado', cat: 'Coffee', price: 200, description: '1:1 espresso to warm milk.', glyph: '☕', available: true, size: 18, dx: -8, ang: 1 },
  { id: 'saffron-latte', name: 'Saffron Latte', cat: 'Coffee', price: 260, description: 'Steamed milk, kashmiri saffron, honey.', glyph: '🌼', available: true, featured: true, size: 20, dx: 4, ang: -1, couples: true },
  { id: 'cardamom-mocha', name: 'Cardamom Mocha', cat: 'Coffee', price: 280, description: 'Bittersweet ganache, green cardamom.', glyph: '🍫', available: true, size: 18, dx: 10, ang: 1 },
  { id: 'v60-pour-over', name: 'V60 Pour Over', cat: 'Coffee', price: 320, description: 'Rotating single origin, Hario V60.', glyph: '⏳', available: true, size: 17, dx: -10, ang: 0 },
  { id: 'almond-croissant', name: 'Almond Croissant', cat: 'Food', price: 240, description: 'Twice-baked, frangipane, slivered almonds.', glyph: '🥐', available: true, featured: true, size: 20, dx: -4, ang: -1 },
  { id: 'avocado-sourdough', name: 'Avocado Sourdough', cat: 'Food', price: 380, description: 'Smashed avo, chili oil, lemon, dukkah.', glyph: '🥑', available: true, size: 18, dx: 6, ang: 1 },
  { id: 'eggs-benedict', name: 'Eggs Benedict', cat: 'Food', price: 420, description: 'Toasted brioche, hollandaise, chives.', glyph: '🍳', available: true, size: 18, dx: -8, ang: 0, sharing: true },
  { id: 'mushroom-toast', name: 'Mushroom Toast', cat: 'Food', price: 360, description: 'Wild mushrooms, taleggio, thyme.', glyph: '🍄', available: true, size: 17, dx: 10, ang: -1 },
  { id: 'iced-filter', name: 'Iced Filter', cat: 'Cold', price: 180, description: 'Slow-dripped 18 hours.', glyph: '🧊', available: true, size: 18, dx: -6, ang: 0 },
  { id: 'cold-brew-tonic', name: 'Cold Brew Tonic', cat: 'Cold', price: 260, description: 'Cold brew, tonic water, orange peel.', glyph: '🍊', available: true, featured: true, size: 20, dx: 4, ang: 1 },
  { id: 'affogato', name: 'Affogato', cat: 'Cold', price: 280, description: 'Vanilla bean gelato, hot espresso pour.', glyph: '🍨', available: true, size: 19, dx: -10, ang: -1, sharing: true },
  { id: 'matcha-cooler', name: 'Matcha Cooler', cat: 'Cold', price: 240, description: 'Ceremonial matcha, oat milk, ice.', glyph: '🍵', available: true, size: 18, dx: 8, ang: 0 },
  { id: 'pistachio-cookie', name: 'Pistachio Cookie', cat: 'Snacks', price: 160, description: 'Sea salt, brown butter.', glyph: '🍪', available: true, size: 18, dx: -6, ang: 1 },
  { id: 'dark-chocolate-tart', name: 'Dark Chocolate Tart', cat: 'Snacks', price: 280, description: '70% Madagascar, sea salt.', glyph: '🍫', available: true, featured: true, size: 20, dx: 6, ang: -1 },
  { id: 'banana-bread', name: 'Banana Bread', cat: 'Snacks', price: 180, description: 'Walnut, brown sugar crust.', glyph: '🍌', available: true, size: 18, dx: -6, ang: 0 },
];

export const IMG = {
  'House Espresso': 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=300',
  'Flat White': 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300',
  'Cortado': 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=300',
  'Saffron Latte': 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=300',
  'Cardamom Mocha': 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300',
  'V60 Pour Over': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300',
  'Almond Croissant': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300',
  'Avocado Sourdough': 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=300',
  'Eggs Benedict': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300',
  'Mushroom Toast': 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=300',
  'Iced Filter': 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300',
  'Cold Brew Tonic': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300',
  'Affogato': 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300',
  'Matcha Cooler': 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=300',
  'Pistachio Cookie': 'https://images.unsplash.com/photo-1523371054106-bbf80586c38c?w=300',
  'Dark Chocolate Tart': 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300',
  'Banana Bread': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300',
};

export function useMenu() {
  const [menu, setMenu] = useState(FALLBACK_MENU);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let unsub;
    try {
      unsub = subscribeMenu(items => {
        if (items && items.length > 0) {
          setMenu(items.map(item => ({
            ...item,
            cat: item.category || item.cat,
            desc: item.description || item.desc,
          })));
        }
      });
    } catch {
      // Firebase unavailable — fallback menu already set
    }
    return () => unsub?.();
  }, []);

  return { menu, loading };
}
