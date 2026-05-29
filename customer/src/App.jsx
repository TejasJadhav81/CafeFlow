import { createContext, useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useCart } from './hooks/useCart';
import { logOut } from './firebase/auth';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import MenuScreen from './screens/MenuScreen';
import CartSheet from './screens/CartSheet';
import ConfirmedScreen from './screens/ConfirmedScreen';

/* ── Mood palettes ── */
const MOODS = {
  cozy: {
    bg: '#faf5ee', surface: '#fff', heading: '#1a1208', body: '#3d2e1a',
    muted: '#8a7060', accent: '#e8a838', divider: '#e8ddd0',
    petals: true,
  },
  bright: {
    bg: '#f0f7f4', surface: '#fff', heading: '#1a2e22', body: '#2e4a38',
    muted: '#6a9070', accent: '#52876a', divider: '#d0e8d8',
    petals: false,
  },
  midnight: {
    bg: '#0f1a14', surface: '#1c2b1e', heading: '#f0ede6', body: '#b8c8bc',
    muted: '#6a8070', accent: '#7ec89a', divider: '#2a3c30',
    petals: false,
  },
};

export const BrewContext = createContext({
  mood: 'cozy', palette: MOODS.cozy, voice: 'editorial', rhythm: 'whispered',
  setMood: () => {}, setVoice: () => {}, setRhythm: () => {},
});

function getTableNumber() {
  const params = new URLSearchParams(window.location.search);
  const t = parseInt(params.get('table') || '1', 10);
  return isNaN(t) || t < 1 ? 1 : t;
}

export default function App() {
  const tableNumber = getTableNumber();
  const { user, points, loading: authLoading, refreshPoints } = useAuth();
  const { cart, addToCart, incrementItem, decrementItem, clearCart, cartCount, cartTotal } = useCart();

  const [mood, setMood] = useState('cozy');
  const [voice, setVoice] = useState('editorial');
  const [rhythm, setRhythm] = useState('whispered');
  const palette = MOODS[mood] || MOODS.cozy;

  const [screen, setScreen] = useState('welcome');
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && user && (screen === 'welcome' || screen === 'login')) {
      setScreen('menu');
    }
  }, [user, authLoading]);

  function handleAddToCart(item, qty) {
    addToCart(item, qty);
  }

  function handleOrderPlaced() {
    setCartOpen(false);
    clearCart();
    refreshPoints();
    setScreen('confirmed');
  }

  if (authLoading) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#1a0f06', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 32 }}>☕</div>
      </div>
    );
  }

  return (
    <BrewContext.Provider value={{ mood, palette, voice, rhythm, setMood, setVoice, setRhythm }}>
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
        {screen === 'welcome' && (
          <WelcomeScreen
            tableNumber={tableNumber}
            onMenu={() => setScreen('menu')}
            onLogin={() => setScreen('login')}
          />
        )}
        {screen === 'login' && (
          <LoginScreen
            tableNumber={tableNumber}
            onSuccess={() => setScreen('menu')}
            onBack={() => setScreen('welcome')}
          />
        )}
        {screen === 'menu' && (
          <MenuScreen
            tableNumber={tableNumber}
            user={user}
            points={points}
            cart={cart}
            cartCount={cartCount}
            cartTotal={cartTotal}
            onAddToCart={handleAddToCart}
            onIncrement={incrementItem}
            onDecrement={decrementItem}
            onCart={() => setCartOpen(true)}
            onLogin={() => setScreen('login')}
            onLogout={() => { logOut(); setScreen('welcome'); }}
          />
        )}
        {screen === 'confirmed' && (
          <ConfirmedScreen
            tableNumber={tableNumber}
            user={user}
            points={points}
            onBackToMenu={() => setScreen('menu')}
          />
        )}

        {cartOpen && screen === 'menu' && (
          <CartSheet
            cart={cart}
            cartTotal={cartTotal}
            onIncrement={incrementItem}
            onDecrement={decrementItem}
            onClose={() => setCartOpen(false)}
            onOrderPlaced={handleOrderPlaced}
            tableNumber={tableNumber}
            user={user}
          />
        )}
      </div>
    </BrewContext.Provider>
  );
}
