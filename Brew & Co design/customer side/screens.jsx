/* ───────── Brew & Co. — screens.jsx ─────────
   All five screens. Each is exposed on window for app.jsx to mount.
   - WelcomeScreen
   - LoginScreen
   - MenuScreen
   - CartSheet  (overlay, not a route on its own)
   - ConfirmedScreen
*/

const { useState, useEffect, useRef, useMemo } = React;

// ───────── shared bits ─────────

// Cherry blossom petals — gentle ambient layer.
// `count` controls density; `intense` flips on the celebratory shower.
function CherryPetals({ count = 12, intense = false }) {
  const petals = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        id: i,
        left: Math.random() * 100,
        size: 10 + Math.random() * 10,
        delay: Math.random() * (intense ? 1.2 : 8),
        dur: (intense ? 3 : 9) + Math.random() * (intense ? 2 : 6),
        px: (Math.random() - 0.5) * 120 + 'px',
        pr: Math.random() * 720 - 360 + 'deg',
        hue: Math.random() < 0.5 ? '#f7c8d6' : Math.random() < 0.5 ? '#f5b8c8' : '#fadce4',
        rot: Math.random() * 60 - 30
      });
    }
    return arr;
  }, [count, intense]);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: intense ? 5 : 1 }}>
      {petals.map((p) =>
      <div key={p.id} className="petal" style={{
        left: p.left + '%',
        width: p.size, height: p.size * 0.8,
        background: p.hue,
        animation: `${intense ? 'petalShower' : 'petalFall'} ${p.dur}s linear ${p.delay}s infinite`,
        ['--px']: p.px, ['--pr']: p.pr,
        transform: `rotate(${p.rot}deg)`
      }} />
      )}
    </div>);

}

function greetingForHour(h) {
  if (h < 12) return { text: 'Good morning', glyph: '☀️' };
  if (h < 17) return { text: 'Good afternoon', glyph: '☀️' };
  return { text: 'Good evening', glyph: '🌙' };
}

function formatINR(n) {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

// Floating coffee bean / steam particles for welcome screen bg
function FloatingParticles() {
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 14; i++) {
      arr.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 6 + Math.random() * 12,
        delay: Math.random() * 6,
        dur: 8 + Math.random() * 8,
        kind: Math.random() < 0.55 ? 'bean' : 'steam'
      });
    }
    return arr;
  }, []);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map((p) =>
      <div key={p.id} style={{
        position: 'absolute',
        left: p.left + '%', top: p.top + '%',
        width: p.size, height: p.kind === 'bean' ? p.size * 1.4 : p.size * 2,
        opacity: 0.35,
        animation: `${['float1', 'float2', 'float3'][p.id % 3]} ${p.dur}s ease-in-out infinite`,
        animationDelay: `${p.delay}s`,
        color: '#e8a838'
      }}>
          {p.kind === 'bean' ?
        <svg viewBox="0 0 20 28" width="100%" height="100%">
              <ellipse cx="10" cy="14" rx="7" ry="11" fill="rgba(232,168,56,0.55)" />
              <path d="M10 4 Q12 14 10 24" stroke="rgba(26,15,6,0.55)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            </svg> :

        <svg viewBox="0 0 12 28" width="100%" height="100%">
              <path d="M6 2 Q3 8 6 14 Q9 20 6 26" stroke="rgba(245,237,214,0.4)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            </svg>
        }
        </div>
      )}
    </div>);

}

// Animated steam over coffee cup illustration
function CoffeeCup({ size = 96 }) {
  return (
    <div style={{ position: 'relative', width: size, height: size * 1.3, display: 'flex', justifyContent: 'center' }}>
      {/* steam */}
      <div style={{ position: 'absolute', top: -2, left: '50%', transform: 'translateX(-50%)', width: size * 0.8, height: size * 0.5 }}>
        {[0, 1, 2].map((i) =>
        <span key={i} style={{
          position: 'absolute',
          left: `${30 + i * 22}%`,
          bottom: 0,
          width: 4, height: 28,
          borderRadius: 4,
          background: 'linear-gradient(to top, rgba(245,237,214,0.55), rgba(245,237,214,0))',
          transformOrigin: 'bottom center',
          animation: `steamRise 2.4s ease-out infinite`,
          animationDelay: `${i * 0.5}s`
        }} />
        )}
      </div>
      {/* cup */}
      <svg viewBox="0 0 100 110" width={size} height={size * 1.1} style={{ position: 'absolute', bottom: 0 }}>
        <defs>
          <linearGradient id="cupG" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#f5c96a" />
            <stop offset="1" stopColor="#c98a1f" />
          </linearGradient>
        </defs>
        {/* saucer */}
        <ellipse cx="50" cy="100" rx="42" ry="6" fill="rgba(232,168,56,0.25)" />
        {/* cup body */}
        <path d="M22 50 Q22 95 50 95 Q78 95 78 50 Z" fill="url(#cupG)" stroke="#1a0f06" strokeWidth="2" />
        {/* handle */}
        <path d="M78 60 Q92 60 92 72 Q92 84 78 84" fill="none" stroke="#1a0f06" strokeWidth="2.5" />
        {/* coffee surface */}
        <ellipse cx="50" cy="50" rx="28" ry="6" fill="#1a0f06" />
        <ellipse cx="50" cy="48" rx="22" ry="3.5" fill="#3a1e0a" />
      </svg>
    </div>);

}

// ─────────────────────────────────────────────────────────────
// WELCOME / LANDING
// ─────────────────────────────────────────────────────────────
function WelcomeScreen({ onMenu, onLogin, tableNumber }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  const greet = greetingForHour(now.getHours());

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#1a0f06',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      color: 'var(--cream-text)'
    }}>
      {/* CSS animated blob background */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', width: 360, height: 360, borderRadius: '50%',
          left: '20%', top: '10%',
          background: 'radial-gradient(circle, rgba(232,168,56,0.55), rgba(232,168,56,0) 65%)',
          filter: 'blur(40px)',
          animation: 'blob1 14s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute', width: 320, height: 320, borderRadius: '50%',
          right: '5%', bottom: '15%',
          background: 'radial-gradient(circle, rgba(245,201,106,0.45), rgba(245,201,106,0) 65%)',
          filter: 'blur(50px)',
          animation: 'blob2 18s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute', width: 280, height: 280, borderRadius: '50%',
          left: '-10%', bottom: '0%',
          background: 'radial-gradient(circle, rgba(139,94,60,0.5), rgba(139,94,60,0) 65%)',
          filter: 'blur(35px)',
          animation: 'blob3 22s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute', width: 240, height: 240, borderRadius: '50%',
          right: '-8%', top: '0%',
          background: 'radial-gradient(circle, rgba(232,168,56,0.35), rgba(232,168,56,0) 70%)',
          filter: 'blur(40px)',
          animation: 'blob1 20s ease-in-out infinite reverse'
        }} />
      </div>
      {/* dark overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(26,15,6,0.4) 0%, rgba(26,15,6,0.25) 35%, rgba(26,15,6,0.65) 100%)'
      }} />
      <FloatingParticles />
      <CherryPetals count={10} />

      {/* content */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', padding: '60px 28px 40px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          {/* logo cup */}
          <div className="fade-up" style={{ animationDelay: '0.05s', marginBottom: 24 }}>
            <CoffeeCup size={84} />
          </div>

          {/* wordmark */}
          <h1 className="fade-up" style={{
            animationDelay: '0.35s',
            fontFamily: 'var(--serif)',
            fontWeight: 600,
            fontSize: 56,
            margin: 0,
            letterSpacing: '-0.01em',
            lineHeight: 1,
            background: 'linear-gradient(180deg, #f5edd6 0%, #e8a838 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Brew &amp; Co.</h1>

          {/* divider dot */}
          <div className="fade-up" style={{
            animationDelay: '0.5s',
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--amber)',
            margin: '18px 0'
          }} />

          {/* tagline */}
          <p className="fade-up" style={{
            animationDelay: '0.55s',
            fontFamily: 'var(--sans)',
            fontWeight: 300,
            fontSize: 14,
            margin: 0,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(245,237,214,0.75)'
          }}></p>

          {/* greeting */}
          <div className="fade-up" style={{
            animationDelay: '0.85s',
            marginTop: 36,
            fontFamily: 'var(--serif)',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 22,
            color: 'rgba(245,237,214,0.9)'
          }}>
            <span key={greet.text} style={{ animation: 'fadeIn 0.6s ease both' }}>
              {greet.text} {greet.glyph}
            </span>
          </div>

          {/* table chip */}
          <div className="fade-up" style={{
            animationDelay: '1.05s',
            marginTop: 22,
            padding: '8px 20px',
            borderRadius: 999,
            border: '1.5px solid rgba(232,168,56,0.7)',
            background: 'rgba(232,168,56,0.08)',
            color: 'var(--amber-light)',
            fontFamily: 'var(--sans)',
            fontWeight: 500,
            fontSize: 13,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            animation: 'fadeUp 0.65s var(--ease-out) 1.05s both, glowPulse 3.2s ease-in-out 1.7s infinite'
          }}>
            Blossom Table {tableNumber} 🌸
          </div>
        </div>

        {/* buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button onClick={onMenu} className="btn-amber pulse fade-up" style={{ animationDelay: '1.3s, 2.5s' }}>
            Explore Menu →
          </button>
          <button onClick={onLogin} className="btn-ghost-dark fade-up" style={{ animationDelay: '1.45s' }}>
            Login / Sign Up
          </button>
        </div>
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────
// LOGIN / SIGNUP
// ─────────────────────────────────────────────────────────────
function LoginScreen({ onContinue, onBack }) {
  const [tab, setTab] = useState('phone');
  const [val, setVal] = useState('');

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#1a0f06',
      color: 'var(--cream-text)',
      display: 'flex', flexDirection: 'column',
      animation: 'slideUp .55s var(--ease-out) both',
      overflow: 'hidden'
    }}>
      {/* warm ambient blobs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', width: 340, height: 340, borderRadius: '50%',
          left: '-20%', top: '-10%',
          background: 'radial-gradient(circle, rgba(232,168,56,0.35), rgba(232,168,56,0) 65%)',
          filter: 'blur(50px)',
          animation: 'blob1 18s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute', width: 280, height: 280, borderRadius: '50%',
          right: '-15%', bottom: '-10%',
          background: 'radial-gradient(circle, rgba(139,94,60,0.45), rgba(139,94,60,0) 65%)',
          filter: 'blur(45px)',
          animation: 'blob2 22s ease-in-out infinite'
        }} />
      </div>

      {/* back arrow */}
      <button onClick={onBack} className="tap" style={{
        position: 'absolute', top: 20, left: 18, zIndex: 10,
        width: 40, height: 40, borderRadius: '50%',
        background: 'rgba(245,237,214,0.08)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        color: 'var(--cream-text)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
      </button>

      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', padding: '70px 28px 32px' }}>
        {/* coffee illustration */}
        <div className="fade-up" style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <CoffeeCup size={72} />
        </div>

        {/* heading */}
        <h2 className="fade-up" style={{
          animationDelay: '0.1s',
          fontFamily: 'var(--serif)',
          fontWeight: 500,
          fontSize: 38,
          margin: '0 0 6px',
          letterSpacing: '-0.01em',
          textAlign: 'center',
          background: 'linear-gradient(180deg, #f5edd6 0%, #d6b87f 100%)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>Welcome back</h2>
        <p className="fade-up" style={{
          animationDelay: '0.18s',
          margin: '0 0 32px',
          textAlign: 'center',
          fontFamily: 'var(--sans)',
          fontWeight: 300,
          fontSize: 14,
          color: 'rgba(245,237,214,0.6)',
          letterSpacing: '0.04em'
        }}>Sign in to track orders and earn points.</p>

        {/* tabs */}
        <div className="fade-up" style={{
          animationDelay: '0.26s',
          display: 'flex',
          background: 'rgba(245,237,214,0.05)',
          border: '1px solid rgba(245,237,214,0.1)',
          padding: 4, borderRadius: 12,
          position: 'relative',
          marginBottom: 22
        }}>
          <div style={{
            position: 'absolute',
            top: 4, bottom: 4,
            left: tab === 'phone' ? 4 : '50%',
            width: 'calc(50% - 4px)',
            background: 'linear-gradient(135deg, rgba(232,168,56,0.85), rgba(201,138,31,0.85))',
            borderRadius: 9,
            transition: 'left .35s var(--spring)',
            boxShadow: '0 4px 12px rgba(232,168,56,0.25)'
          }} />
          {['phone', 'email'].map((k) =>
          <button key={k} onClick={() => setTab(k)} style={{
            flex: 1, position: 'relative', zIndex: 1,
            padding: '10px 0',
            fontFamily: 'var(--sans)', fontWeight: 500, fontSize: 13.5,
            color: tab === k ? '#1a0f06' : 'rgba(245,237,214,0.65)',
            letterSpacing: '0.04em',
            transition: 'color .25s ease'
          }}>{k === 'phone' ? 'Phone Number' : 'Email'}</button>
          )}
        </div>

        {/* input */}
        <div className="fade-up" style={{ animationDelay: '0.34s', marginBottom: 18 }}>
          <input
            key={tab}
            className="input-frost"
            type={tab === 'phone' ? 'tel' : 'email'}
            placeholder={tab === 'phone' ? '+91 98765 43210' : 'you@example.com'}
            value={val}
            onChange={(e) => setVal(e.target.value)} />
          
        </div>

        {/* sign in */}
        <div className="fade-up" style={{ animationDelay: '0.42s' }}>
          <button onClick={onContinue} className="btn-amber">Sign In</button>
        </div>

        {/* divider */}
        <div className="fade-up" style={{
          animationDelay: '0.5s',
          display: 'flex', alignItems: 'center', gap: 12,
          margin: '22px 0',
          color: 'rgba(245,237,214,0.4)',
          fontFamily: 'var(--sans)', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase'
        }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(245,237,214,0.12)' }} />
          or
          <div style={{ flex: 1, height: 1, background: 'rgba(245,237,214,0.12)' }} />
        </div>

        {/* guest */}
        <div className="fade-up" style={{ animationDelay: '0.58s' }}>
          <button onClick={onContinue} className="btn-ghost-dark">Continue as Guest</button>
        </div>

        {/* points line */}
        <div className="fade-up" style={{
          animationDelay: '0.7s',
          textAlign: 'center', marginTop: 22,
          fontFamily: 'var(--sans)', fontSize: 12.5,
          color: 'rgba(245,237,214,0.55)',
          letterSpacing: '0.04em'
        }}>
          Earn points on every order 🎁
        </div>
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────
// MENU — scattered organic layout
// ─────────────────────────────────────────────────────────────

// Unsplash food images
const IMG = {
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
  'Banana Bread': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300'
};

const MENU = [
{ cat: 'Coffee', name: 'House Espresso', price: 140, desc: 'Single origin Chikmagalur. Dark, syrupy.', glyph: '☕', featured: true, size: 21, dx: -4, ang: -1 },
{ cat: 'Coffee', name: 'Flat White', price: 220, desc: 'Velvety microfoam, double ristretto.', glyph: '🥛', featured: false, size: 18, dx: 8, ang: 0, couples: true },
{ cat: 'Coffee', name: 'Cortado', price: 200, desc: '1:1 espresso to warm milk.', glyph: '☕', featured: false, size: 18, dx: -8, ang: 1 },
{ cat: 'Coffee', name: 'Saffron Latte', price: 260, desc: 'Steamed milk, kashmiri saffron, honey.', glyph: '🌼', featured: true, size: 20, dx: 4, ang: -1, couples: true },
{ cat: 'Coffee', name: 'Cardamom Mocha', price: 280, desc: 'Bittersweet ganache, green cardamom.', glyph: '🍫', featured: false, size: 18, dx: 10, ang: 1 },
{ cat: 'Coffee', name: 'V60 Pour Over', price: 320, desc: 'Rotating single origin, Hario V60.', glyph: '⏳', featured: false, size: 17, dx: -10, ang: 0 },

{ cat: 'Food', name: 'Almond Croissant', price: 240, desc: 'Twice-baked, frangipane, slivered almonds.', glyph: '🥐', featured: true, size: 20, dx: -4, ang: -1 },
{ cat: 'Food', name: 'Avocado Sourdough', price: 380, desc: 'Smashed avo, chili oil, lemon, dukkah.', glyph: '🥑', featured: false, size: 18, dx: 6, ang: 1 },
{ cat: 'Food', name: 'Eggs Benedict', price: 420, desc: 'Toasted brioche, hollandaise, chives.', glyph: '🍳', featured: false, size: 18, dx: -8, ang: 0, sharing: true },
{ cat: 'Food', name: 'Mushroom Toast', price: 360, desc: 'Wild mushrooms, taleggio, thyme.', glyph: '🍄', featured: false, size: 17, dx: 10, ang: -1 },

{ cat: 'Cold', name: 'Iced Filter', price: 180, desc: 'Slow-dripped 18 hours.', glyph: '🧊', featured: false, size: 18, dx: -6, ang: 0 },
{ cat: 'Cold', name: 'Cold Brew Tonic', price: 260, desc: 'Cold brew, tonic water, orange peel.', glyph: '🍊', featured: true, size: 20, dx: 4, ang: 1 },
{ cat: 'Cold', name: 'Affogato', price: 280, desc: 'Vanilla bean gelato, hot espresso pour.', glyph: '🍨', featured: false, size: 19, dx: -10, ang: -1, sharing: true },
{ cat: 'Cold', name: 'Matcha Cooler', price: 240, desc: 'Ceremonial matcha, oat milk, ice.', glyph: '🍵', featured: false, size: 18, dx: 8, ang: 0 },

{ cat: 'Snacks', name: 'Pistachio Cookie', price: 160, desc: 'Sea salt, brown butter.', glyph: '🍪', featured: false, size: 18, dx: -6, ang: 1 },
{ cat: 'Snacks', name: 'Dark Chocolate Tart', price: 280, desc: '70% Madagascar, sea salt.', glyph: '🍫', featured: true, size: 20, dx: 6, ang: -1 },
{ cat: 'Snacks', name: 'Banana Bread', price: 180, desc: 'Walnut, brown sugar crust.', glyph: '🍌', featured: false, size: 18, dx: -6, ang: 0 }];


const CATS = ['All', 'For Two 💑', 'Coffee', 'Food', 'Cold', 'Snacks'];

function MenuScreen({ cart, addToCart, onCart, tableNumber, recentlyAdded }) {
  const [cat, setCat] = useState('All');
  const [tappedItem, setTappedItem] = useState(null);
  const [now] = useState(new Date());
  const greet = greetingForHour(now.getHours());

  const visible = cat === 'All' ? MENU : MENU.filter((m) => m.cat === cat);
  const groups = useMemo(() => {
    const g = {};
    for (const m of visible) (g[m.cat] = g[m.cat] || []).push(m);
    return g;
  }, [cat]);

  const cartCount = cart.reduce((a, b) => a + b.qty, 0);
  const cartTotal = cart.reduce((a, b) => a + b.qty * b.price, 0);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'var(--bg-cream)',
      animation: 'fadeIn .4s ease both',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* paper grain texture */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.4) 0%, transparent 60%), radial-gradient(ellipse at bottom right, rgba(232,168,56,0.08) 0%, transparent 60%)',
        pointerEvents: 'none'
      }} />

      {/* gentle petals */}
      <CherryPetals count={6} />

      {/* header */}
      <div style={{
        position: 'relative',
        padding: '64px 22px 10px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: 12
      }}>
        <div style={{
          fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 18,
          color: 'var(--espresso)', letterSpacing: '-0.01em',
          whiteSpace: 'nowrap'
        }}>Brew &amp; Co.</div>

        <button onClick={onCart} className="tap" style={{
          position: 'relative',
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(26,15,6,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--espresso)'
        }}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3h2l2.4 12.2a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6" />
            <circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" />
          </svg>
          {cartCount > 0 &&
          <div style={{
            position: 'absolute', top: -4, right: -4,
            minWidth: 18, height: 18, padding: '0 5px',
            borderRadius: 9,
            background: 'var(--amber)',
            color: '#1a0f06',
            fontSize: 11, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'bounceIn .35s var(--spring)'
          }}>{cartCount}</div>
          }
        </button>
      </div>

      {/* greeting */}
      <div style={{
        padding: '0 22px 14px',
        fontFamily: 'var(--serif)',
        fontStyle: 'italic',
        fontSize: 15.5,
        color: 'var(--warm-brown)'
      }}>
        {greet.text}, Table {tableNumber} {greet.glyph}
      </div>

      {/* category tabs */}
      <div className="no-scrollbar" style={{
        padding: '4px 18px 14px',
        display: 'flex', gap: 6,
        overflowX: 'auto',
        flexShrink: 0
      }}>
        {CATS.map((c) =>
        <button key={c} className={`tab-pill tap ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)} style={{ color: "rgb(165, 106, 85)" }}>
            {c}
          </button>
        )}
      </div>

      {/* menu list */}
      <div className="scroll-y" style={{ flex: 1, padding: '6px 0 120px', overflowX: 'hidden' }}>
        {Object.entries(groups).map(([groupName, items]) =>
        <CategoryGroup key={groupName} name={groupName} items={items} onTap={setTappedItem} />
        )}

        {/* footer flourish */}
        <div style={{
          textAlign: 'center', padding: '24px 30px 8px',
          fontFamily: 'var(--hand)', fontSize: 22,
          color: 'var(--warm-brown-soft)',
          opacity: 0.7
        }}>— made by hand —</div>
      </div>

      {/* cart pill */}
      {cartCount > 0 &&
      <div className={`cart-pill ${recentlyAdded ? 'bump' : ''}`} key={recentlyAdded || 'pill'} onClick={onCart} style={{ cursor: 'pointer', position: 'absolute' }}>
          {recentlyAdded &&
        <div key={'h' + recentlyAdded} className="heart-pop">💗</div>
        }
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 3h2l2.4 12.2a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6" /></svg>
          <span>View Order · {formatINR(cartTotal)}</span>
          <span style={{ opacity: 0.6 }}>· {cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
        </div>
      }

      {/* bottom sheet */}
      {tappedItem &&
      <ItemSheet item={tappedItem} onClose={() => setTappedItem(null)} onAdd={(qty) => {addToCart(tappedItem, qty);setTappedItem(null);}} />
      }
    </div>);

}

function CategoryGroup({ name, items, onTap }) {
  return (
    <div style={{ position: 'relative', padding: '36px 0 28px' }}>
      {/* watermark category label */}
      <div style={{
        position: 'absolute',
        top: 18, left: 14, right: 14,
        fontFamily: 'var(--serif)',
        fontStyle: 'italic',
        fontWeight: 400,
        fontSize: 86,
        color: 'rgba(139,94,60,0.08)',
        letterSpacing: '-0.04em',
        pointerEvents: 'none',
        lineHeight: 0.85,
        userSelect: 'none'
      }}>{name}</div>

      <div style={{ position: 'relative' }}>
        {items.map((m, idx) =>
        <ScatteredItem key={m.name} item={m} idx={idx} onTap={() => onTap(m)} />
        )}
      </div>
    </div>);

}

function ScatteredItem({ item, idx, onTap }) {
  const rhythm = React.useContext(window.BrewContext).rhythm;
  const dx = item.dx * rhythm.dxScale;
  const ang = item.ang * rhythm.angScale;
  const size = Math.max(15, item.size + rhythm.sizeBoost + (item.featured ? rhythm.featuredBoost : 0));
  const padY = rhythm.padY;
  const leftPad = dx < 0 ? Math.max(16, 26 + dx) : 26 + Math.abs(dx);
  const rightPad = dx > 0 ? Math.max(16, 26 - dx) : 26;
  const align = dx < -4 ? 'flex-start' : dx > 4 ? 'flex-end' : 'center';

  const thumbFirst = dx >= -4; // photo on left when text is centered or right-leaning
  return (
    <div className="fade-up" style={{
      animationDelay: `${0.05 + idx * 0.04}s`,
      display: 'flex', alignItems: 'center', justifyContent: align,
      gap: 14,
      padding: `${padY}px ${Math.max(14, rightPad - 4)}px ${padY}px ${Math.max(14, leftPad - 4)}px`,
      flexDirection: thumbFirst ? 'row' : 'row-reverse'
    }}>
      <img src={IMG[item.name]} alt="" className="menu-thumb"
      style={{ transform: `rotate(${ang * 0.4}deg)` }} />
      <button onClick={onTap} className="menu-item-name" style={{
        textAlign: thumbFirst ? 'left' : 'right',
        maxWidth: 'calc(100% - 78px)',
        whiteSpace: 'nowrap',
        transform: `rotate(${ang}deg)`,
        transformOrigin: thumbFirst ? 'left center' : 'right center'
      }}>
        <div style={{
          fontFamily: 'var(--serif)',
          fontWeight: item.featured ? 600 : 500,
          fontSize: size,
          color: item.featured ? 'var(--amber-deep)' : 'var(--espresso)',
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
          display: 'flex', alignItems: 'center', gap: 8,
          flexDirection: thumbFirst ? 'row' : 'row-reverse'
        }}>
          <span>{item.name}</span>
          {item.couples && <span style={{ fontSize: 13 }}>💕</span>}
        </div>
        <div style={{
          marginTop: 4,
          fontFamily: 'var(--sans)',
          fontWeight: 400,
          fontSize: 12.5,
          color: 'var(--warm-brown)',
          letterSpacing: '0.04em'
        }}>{formatINR(item.price)}</div>
      </button>
    </div>);

}

function ItemSheet({ item, onClose, onAdd }) {
  const [qty, setQty] = useState(1);
  return (
    <>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(26,15,6,0.5)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        animation: 'fadeIn .25s ease both',
        zIndex: 30
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: 'var(--bg-cream)',
        borderRadius: '28px 28px 0 0',
        padding: '14px 28px 36px',
        animation: 'slideUp .4s var(--spring) both',
        zIndex: 31,
        boxShadow: '0 -20px 60px rgba(26,15,6,0.3)'
      }}>
        {/* drag handle */}
        <div style={{
          width: 40, height: 4, borderRadius: 2,
          background: 'rgba(26,15,6,0.18)',
          margin: '0 auto 16px'
        }} />

        {/* hero photo */}
        <div style={{
          margin: '4px -28px 14px',
          height: 200,
          background: `linear-gradient(180deg, rgba(26,15,6,0) 50%, rgba(26,15,6,0.18) 100%), url(${IMG[item.name]}) center/cover`,
          position: 'relative',
          animation: 'fadeIn .4s ease both'
        }}>
          {/* glyph badge */}
          <div style={{
            position: 'absolute', right: 18, bottom: -22,
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #fff 0%, #fadce4 100%)',
            border: '2px solid #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26,
            boxShadow: '0 6px 18px rgba(232,130,154,0.35)'
          }}>{item.glyph}</div>
          {(item.couples || item.sharing) &&
          <div style={{
            position: 'absolute', left: 18, top: 14,
            padding: '5px 10px', borderRadius: 999,
            background: 'rgba(255,255,255,0.92)',
            fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 11,
            color: '#c14a6c',
            letterSpacing: '0.08em', textTransform: 'uppercase'
          }}>{item.couples ? 'For two 💕' : 'Sharable'}</div>
          }
        </div>

        <div style={{
          fontFamily: 'var(--serif)',
          fontWeight: 600,
          fontSize: 28,
          textAlign: 'center',
          color: 'var(--espresso)',
          letterSpacing: '-0.01em'
        }}>{item.name}</div>

        <div style={{
          marginTop: 8,
          fontFamily: 'var(--sans)',
          fontSize: 13.5,
          textAlign: 'center',
          color: 'var(--warm-brown)',
          textWrap: 'pretty',
          padding: '0 8px'
        }}>{item.desc}</div>

        <div style={{
          marginTop: 16,
          fontFamily: 'var(--serif)',
          fontStyle: 'italic',
          fontSize: 24,
          textAlign: 'center',
          color: 'var(--amber-deep)'
        }}>{formatINR(item.price)}</div>

        {/* quantity */}
        <div style={{
          margin: '20px auto 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24
        }}>
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="tap" style={{
            width: 40, height: 40, borderRadius: '50%',
            border: '1.5px solid rgba(26,15,6,0.15)',
            color: 'var(--espresso)',
            fontSize: 20, fontWeight: 400,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>−</button>
          <div style={{
            fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 24,
            color: 'var(--espresso)', minWidth: 24, textAlign: 'center'
          }}>{qty}</div>
          <button onClick={() => setQty((q) => q + 1)} className="tap" style={{
            width: 40, height: 40, borderRadius: '50%',
            border: '1.5px solid rgba(26,15,6,0.15)',
            color: 'var(--espresso)',
            fontSize: 20, fontWeight: 400,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>+</button>
        </div>

        <button onClick={() => onAdd(qty)} className="btn-amber">
          Add to Order · {formatINR(item.price * qty)}
        </button>
      </div>
    </>);

}

// ─────────────────────────────────────────────────────────────
// CART / ORDER REVIEW (overlay drawer)
// ─────────────────────────────────────────────────────────────
function CartSheet({ cart, onClose, onPlace, onIncrement, onDecrement, tableNumber }) {
  const [note, setNote] = useState('');
  const total = cart.reduce((a, b) => a + b.qty * b.price, 0);

  return (
    <>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(26,15,6,0.55)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        animation: 'fadeIn .25s ease both',
        zIndex: 40
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, top: 60,
        background: 'var(--bg-cream)',
        borderRadius: '28px 28px 0 0',
        padding: '14px 28px 28px',
        animation: 'slideUp .45s var(--spring) both',
        zIndex: 41,
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{
          width: 40, height: 4, borderRadius: 2,
          background: 'rgba(26,15,6,0.18)',
          margin: '0 auto 18px'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
          <h3 style={{
            margin: 0,
            fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 30,
            color: 'var(--espresso)', letterSpacing: '-0.01em'
          }}>Your Order</h3>
          <div style={{
            padding: '5px 12px', borderRadius: 999,
            background: 'rgba(26,15,6,0.06)',
            fontFamily: 'var(--sans)', fontWeight: 500, fontSize: 12,
            color: 'var(--warm-brown)',
            letterSpacing: '0.06em', textTransform: 'uppercase'
          }}>Table {tableNumber}</div>
        </div>

        <div className="scroll-y" style={{ flex: 1 }}>
          {cart.length === 0 ?
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--warm-brown)', fontFamily: 'var(--serif)', fontStyle: 'italic' }}>
              Nothing here yet.
            </div> :
          cart.map((row, i) =>
          <div key={row.name} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '16px 0',
            borderBottom: i === cart.length - 1 ? 'none' : '1px solid rgba(26,15,6,0.08)'
          }}>
              <div style={{
              width: 40, height: 40, borderRadius: 8,
              backgroundImage: `url(${IMG[row.name]})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(26,15,6,0.15)'
            }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 17,
                color: 'var(--espresso)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}>{row.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                  <button onClick={() => onDecrement(row.name)} className="tap" style={{
                  width: 24, height: 24, borderRadius: '50%',
                  border: '1px solid rgba(26,15,6,0.2)',
                  color: 'var(--espresso)', fontSize: 14, lineHeight: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>−</button>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--warm-brown)', minWidth: 12, textAlign: 'center' }}>{row.qty}</span>
                  <button onClick={() => onIncrement(row.name)} className="tap" style={{
                  width: 24, height: 24, borderRadius: '50%',
                  border: '1px solid rgba(26,15,6,0.2)',
                  color: 'var(--espresso)', fontSize: 14, lineHeight: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>+</button>
                </div>
              </div>
              <div style={{
              fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 17,
              color: 'var(--warm-brown)', flexShrink: 0
            }}>{formatINR(row.qty * row.price)}</div>
            </div>
          )}

          {/* note to kitchen */}
          <div style={{ paddingTop: 22, paddingBottom: 6 }}>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note to kitchen…"
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(26,15,6,0.18)',
                padding: '10px 2px',
                fontFamily: 'var(--serif)',
                fontStyle: 'italic',
                fontSize: 15,
                color: 'var(--espresso)',
                outline: 'none'
              }} />
            
          </div>
        </div>

        {/* total */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          padding: '18px 0 14px',
          borderTop: '1px solid rgba(26,15,6,0.1)',
          marginTop: 8
        }}>
          <div style={{
            fontFamily: 'var(--sans)', fontWeight: 500, fontSize: 13,
            color: 'var(--warm-brown)',
            letterSpacing: '0.16em', textTransform: 'uppercase'
          }}>Total</div>
          <div style={{
            fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 32,
            color: 'var(--amber-deep)', letterSpacing: '-0.01em'
          }}>{formatINR(total)}</div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} className="btn-ghost-light" style={{ flex: 1 }}>← Edit</button>
          <button onClick={onPlace} className="btn-amber" style={{ flex: 1.5 }} disabled={cart.length === 0}>
            Place Order →
          </button>
        </div>
        <div style={{
          textAlign: 'center', marginTop: 10,
          fontFamily: 'var(--sans)', fontSize: 11.5,
          color: 'var(--warm-brown)', opacity: 0.7,
          letterSpacing: '0.06em'
        }}>Pay at counter when ready</div>
      </div>
    </>);

}

// ─────────────────────────────────────────────────────────────
// ORDER CONFIRMED — full screen celebration
// ─────────────────────────────────────────────────────────────
function ConfirmedScreen({ cart, onMore, tableNumber }) {
  const total = cart.reduce((a, b) => a + b.qty * b.price, 0);

  // confetti pieces
  const confetti = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 28; i++) {
      arr.push({
        id: i,
        left: 50 + (Math.random() - 0.5) * 30,
        cx: (Math.random() - 0.5) * 280 + 'px',
        cy: 200 + Math.random() * 220 + 'px',
        cr: (Math.random() - 0.5) * 1080 + 'deg',
        delay: Math.random() * 0.4,
        dur: 1.5 + Math.random() * 1.2,
        size: 6 + Math.random() * 6,
        color: i % 3 === 0 ? '#f5edd6' : i % 3 === 1 ? '#e8a838' : '#f5c96a',
        round: Math.random() < 0.5
      });
    }
    return arr;
  }, []);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(ellipse at center, #2a1a0f 0%, #1a0f06 70%)',
      color: 'var(--cream-text)',
      animation: 'fadeIn .5s ease both',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column'
    }}>
      {/* central golden glow */}
      <div style={{
        position: 'absolute',
        left: '50%', top: '38%',
        transform: 'translate(-50%, -50%)',
        width: 420, height: 420,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,168,56,0.4) 0%, rgba(232,168,56,0.12) 35%, transparent 65%)',
        animation: 'goldGlow 3.4s ease-in-out infinite',
        pointerEvents: 'none'
      }} />

      {/* confetti */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {confetti.map((c) =>
        <div key={c.id} style={{
          position: 'absolute',
          top: '32%', left: c.left + '%',
          width: c.size, height: c.size * (c.round ? 1 : 0.4),
          background: c.color,
          borderRadius: c.round ? '50%' : 1,
          animation: `confetti ${c.dur}s var(--ease-out) ${c.delay}s both`,
          '--cx': c.cx, '--cy': c.cy, '--cr': c.cr
        }} />
        )}
      </div>

      <CherryPetals count={36} intense />

      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', padding: '70px 28px 28px' }}>
        {/* check */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20, marginBottom: 18 }}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#4caf7d" strokeWidth="3.5"
            strokeDasharray="290" strokeDashoffset="290"
            style={{ animation: 'drawCircle .8s var(--ease-out) .15s forwards' }} />
            <path d="M30 52 L45 66 L72 38" fill="none" stroke="#4caf7d" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="100" strokeDashoffset="100"
            style={{ animation: 'drawCheck .55s var(--ease-out) .9s forwards' }} />
          </svg>
        </div>

        <h2 className="fade-up" style={{
          animationDelay: '0.4s',
          fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 44,
          margin: '0 0 6px',
          textAlign: 'center', letterSpacing: '-0.01em',
          background: 'linear-gradient(180deg, #f5edd6 0%, #e8a838 100%)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>Your table is set 💕</h2>

        <p className="fade-up" style={{
          animationDelay: '0.55s',
          margin: '0 0 28px',
          textAlign: 'center',
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          fontSize: 17,
          color: 'rgba(245,237,214,0.75)'
        }}>Blossom Table {tableNumber} · made with love 🌸</p>

        {/* order summary */}
        <div className="fade-up" style={{ animationDelay: '0.7s', flex: 1, overflowY: 'auto' }}>
          <div style={{
            padding: '0 4px'
          }}>
            {cart.map((row, i) =>
            <div key={row.name} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              padding: '10px 0',
              borderBottom: i === cart.length - 1 ? 'none' : '1px solid rgba(245,237,214,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }}>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'rgba(245,237,214,0.5)' }}>{row.qty}×</span>
                  <span style={{
                  fontFamily: 'var(--serif)', fontSize: 17, color: 'rgba(245,237,214,0.92)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>{row.name}</span>
                </div>
                <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 15, color: 'rgba(245,237,214,0.65)' }}>
                  {formatINR(row.qty * row.price)}
                </div>
              </div>
            )}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              padding: '14px 0 6px', marginTop: 6,
              borderTop: '1px solid rgba(245,237,214,0.18)'
            }}>
              <span style={{
                fontFamily: 'var(--sans)', fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'rgba(245,237,214,0.55)'
              }}>Total</span>
              <span style={{
                fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 26,
                color: 'var(--amber-light)'
              }}>{formatINR(total)}</span>
            </div>
          </div>
        </div>

        <div className="fade-up" style={{ animationDelay: '0.95s', marginTop: 16 }}>
          <button onClick={onMore} className="btn-ghost-dark">Add more items</button>
        </div>
        <div className="fade-up" style={{
          animationDelay: '1.1s',
          textAlign: 'center', marginTop: 12,
          fontFamily: 'var(--sans)', fontSize: 11.5,
          color: 'rgba(245,237,214,0.5)',
          letterSpacing: '0.08em'
        }}>Pay at counter when ready</div>
      </div>
    </div>);

}

Object.assign(window, {
  WelcomeScreen, LoginScreen, MenuScreen, CartSheet, ConfirmedScreen,
  MENU, IMG, formatINR, CherryPetals
});