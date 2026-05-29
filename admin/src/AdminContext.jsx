import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { subscribeOrders, subscribeMenu, subscribeExpenses, subscribeCustomers } from './firebase';
import { Network } from '@capacitor/network';

export const A = {
  bg: '#0f1117',
  surface: '#1a1d27',
  card: '#242836',
  cardHi: '#2c3142',
  pink: '#e8829a',
  pinkDeep: '#c96080',
  pinkSoft: 'rgba(232,130,154,0.12)',
  green: '#52876a',
  greenSoft: '#4caf7d',
  text: '#e8e4dc',
  textDim: '#a8a4a0',
  muted: '#6b7280',
  yellow: '#f0b429',
  orange: '#f0933a',
  red: '#e05c5c',
  blue: '#4a9eff',
  gold: '#c9a84c',
  divider: 'rgba(232,228,220,0.08)',
  serif: "'Playfair Display', Georgia, serif",
  sans: "'DM Sans', system-ui, sans-serif",
};

const TABLES_SEED = [
  { id: 1, name: 'Garden Table 1', status: 'free', items: [] },
  { id: 2, name: 'Petal Table 2', status: 'free', items: [] },
  { id: 3, name: 'Blossom Table 3', status: 'free', items: [] },
  { id: 4, name: 'Mossy Table 4', status: 'free', items: [] },
  { id: 5, name: 'Velvet Table 5', status: 'free', items: [] },
  { id: 6, name: 'Cherry Table 6', status: 'free', items: [] },
  { id: 7, name: 'Linen Table 7', status: 'free', items: [] },
  { id: 8, name: 'Marble Table 8', status: 'free', items: [] },
  { id: 9, name: 'Copper Table 9', status: 'free', items: [] },
];

const EXPENSES_SEED = [];

const CUSTOMERS_SEED = [];

const ORDERS_SEED = [];

export const MENU_DATA = [
  { id: 1, name: 'Saffron Latte', cat: 'Coffee', price: 260, glyph: '☕', visible: true, description: 'Aromatic saffron-infused milk latte' },
  { id: 2, name: 'Cappuccino', cat: 'Coffee', price: 140, glyph: '☕', visible: true, description: 'Classic Italian cappuccino' },
  { id: 3, name: 'Flat White', cat: 'Coffee', price: 160, glyph: '☕', visible: true, description: 'Velvety micro-foam flat white' },
  { id: 4, name: 'Cold Brew Tonic', cat: 'Cold', price: 260, glyph: '🧊', visible: true, description: 'Slow-steeped cold brew over tonic' },
  { id: 5, name: 'Almond Croissant', cat: 'Food', price: 240, glyph: '🥐', visible: true, description: 'Buttery flaky croissant with almond cream' },
  { id: 6, name: 'Avocado Sourdough', cat: 'Food', price: 320, glyph: '🥑', visible: true, description: 'Smashed avocado on house sourdough' },
  { id: 7, name: 'Eggs Benedict', cat: 'Food', price: 380, glyph: '🍳', visible: true, description: 'Poached eggs, hollandaise, English muffin' },
  { id: 8, name: 'Affogato', cat: 'Coffee', price: 220, glyph: '🍨', visible: true, description: 'Espresso poured over vanilla gelato' },
  { id: 9, name: 'Banana Bread', cat: 'Snacks', price: 180, glyph: '🍞', visible: true, description: 'House-baked banana bread slice' },
  { id: 10, name: 'Dark Chocolate Tart', cat: 'Snacks', price: 210, glyph: '🍫', visible: true, description: 'Rich dark chocolate ganache tart' },
  { id: 11, name: 'Pistachio Cookie', cat: 'Snacks', price: 120, glyph: '🍪', visible: true, description: 'Soft-baked pistachio cookie' },
  { id: 12, name: 'Mushroom Toast', cat: 'Food', price: 290, glyph: '🍄', visible: true, description: 'Sautéed mushrooms on toasted sourdough' },
  { id: 13, name: 'Cortado', cat: 'Coffee', price: 160, glyph: '☕', visible: true, description: 'Equal parts espresso and steamed milk' },
  { id: 14, name: 'Cardamom Mocha', cat: 'Coffee', price: 200, glyph: '☕', visible: true, description: 'Spiced mocha with cardamom' },
];

export const IMG = {
  'Saffron Latte': 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=200&q=70',
  'Cappuccino': 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200&q=70',
  'Flat White': 'https://images.unsplash.com/photo-1496318447583-f524534e9ce1?w=200&q=70',
  'Cold Brew Tonic': 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=200&q=70',
  'Almond Croissant': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&q=70',
  'Avocado Sourdough': 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=200&q=70',
  'Eggs Benedict': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=200&q=70',
  'Affogato': 'https://images.unsplash.com/photo-1568649929103-28ffbefaca1e?w=200&q=70',
  'Banana Bread': 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=200&q=70',
  'Dark Chocolate Tart': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=200&q=70',
  'Pistachio Cookie': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200&q=70',
  'Mushroom Toast': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=200&q=70',
  'Cortado': 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=200&q=70',
  'Cardamom Mocha': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&q=70',
};

export const AdminContext = createContext(null);

export function useAdmin() {
  return useContext(AdminContext);
}

export function AdminProvider({ children }) {
  const [tables, setTables] = useState(TABLES_SEED);
  const [expenses, setExpenses] = useState(EXPENSES_SEED);
  const [customers, setCustomers] = useState(CUSTOMERS_SEED);
  const [orders, setOrders] = useState(ORDERS_SEED);
  const [menuItems, setMenuItems] = useState(MENU_DATA);
  const [toast, setToast] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const toastTimer = useRef(null);
  const prevOrderIds = useRef(new Set());

  const showToast = useCallback((msg, tone = 'green', ms = 2000) => {
    setToast({ msg, tone, key: Date.now() });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), ms);
  }, []);

  // Notification chime helper
  const playChime = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [523, 659, 784]; // C5 E5 G5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.4);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.45);
      });
    } catch (_) {}
  }, []);

  // Subscribe to real Firebase orders
  useEffect(() => {
    const unsub = subscribeOrders(liveOrders => {
      if (liveOrders.length === 0) return;

      setOrders(liveOrders);

      setTables(prev => prev.map(t => {
        const tableOrders = liveOrders.filter(o => o.table === t.id && o.status === 'pending');
        if (tableOrders.length > 0) {
          const allItems = tableOrders.flatMap(o => o.raw?.items || []);
          return { ...t, status: 'progress', items: allItems };
        }
        // No pending orders for this table → make sure it's free
        if (t.status === 'progress') {
          return { ...t, status: 'free', items: [] };
        }
        return t;
      }));

      liveOrders.forEach(o => {
        if (o.status === 'pending' && !prevOrderIds.current.has(o.id)) {
          setNotification({ table: `Table ${o.table}`, tableId: o.table, items: o.items, key: Date.now() });
          setTimeout(() => setNotification(null), 10000);
          playChime();
        }
      });
      prevOrderIds.current = new Set(liveOrders.map(o => o.id));
    });
    return () => unsub();
  }, [playChime]);

  // Subscribe to Firebase menu
  useEffect(() => {
    const unsub = subscribeMenu(items => {
      if (items.length > 0) setMenuItems(items);
    });
    return () => unsub();
  }, []);

  // Subscribe to Firebase expenses
  useEffect(() => {
    const unsub = subscribeExpenses(items => {
      setExpenses(items);
    });
    return () => unsub();
  }, []);

  // Subscribe to Firebase customers
  useEffect(() => {
    const unsub = subscribeCustomers(items => {
      if (items.length > 0) setCustomers(items);
    });
    return () => unsub();
  }, []);

  // Network listener
  useEffect(() => {
    let handler;
    Network.getStatus().then(s => setIsOnline(s.connected));
    Network.addListener('networkStatusChange', s => {
      setIsOnline(s.connected);
    }).then(h => { handler = h; });
    return () => { handler?.remove?.(); };
  }, [showToast]);

  return (
    <AdminContext.Provider value={{
      tables, setTables,
      expenses, setExpenses,
      customers, setCustomers,
      orders, setOrders,
      menuItems, setMenuItems,
      toast, showToast,
      notification, setNotification,
      isOnline,
    }}>
      {children}
    </AdminContext.Provider>
  );
}
