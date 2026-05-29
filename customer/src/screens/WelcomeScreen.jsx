import { useState, useEffect, useMemo } from 'react';

function greetingForHour(h) {
  if (h < 12) return { text: 'Good morning', glyph: '☀️' };
  if (h < 17) return { text: 'Good afternoon', glyph: '☀️' };
  return { text: 'Good evening', glyph: '🌙' };
}

export function CherryPetals({ count = 12, intense = false }) {
  const petals = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        id: i,
        left: Math.random() * 100,
        size: 10 + Math.random() * 10,
        delay: Math.random() * (intense ? 1.2 : 14),
        dur: (intense ? 3 : 9) + Math.random() * (intense ? 2 : 6),
        px: (Math.random() - 0.5) * 120 + 'px',
        pr: Math.random() * 720 - 360 + 'deg',
        hue: Math.random() < 0.5 ? '#f7c8d6' : Math.random() < 0.5 ? '#f5b8c8' : '#fadce4',
        rot: Math.random() * 60 - 30,
      });
    }
    return arr;
  }, [count, intense]);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: intense ? 5 : 1 }}>
      {petals.map(p => (
        <div key={p.id} className="petal" style={{
          left: p.left + '%',
          width: p.size, height: p.size * 0.8,
          background: p.hue,
          animation: `${intense ? 'petalShower' : 'petalFall'} ${p.dur}s linear ${p.delay}s infinite`,
          '--px': p.px, '--pr': p.pr,
          transform: `rotate(${p.rot}deg)`
        }} />
      ))}
    </div>
  );
}

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
        kind: Math.random() < 0.55 ? 'bean' : 'steam',
      });
    }
    return arr;
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: p.left + '%', top: p.top + '%',
          width: p.size, height: p.kind === 'bean' ? p.size * 1.4 : p.size * 2,
          opacity: 0.35,
          animation: `${['float1', 'float2', 'float3'][p.id % 3]} ${p.dur}s ease-in-out infinite`,
          animationDelay: `${p.delay}s`,
        }}>
          {p.kind === 'bean' ? (
            <svg viewBox="0 0 20 28" width="100%" height="100%">
              <ellipse cx="10" cy="14" rx="7" ry="11" fill="rgba(232,168,56,0.55)" />
              <path d="M10 4 Q12 14 10 24" stroke="rgba(26,15,6,0.55)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 12 28" width="100%" height="100%">
              <path d="M6 2 Q3 8 6 14 Q9 20 6 26" stroke="rgba(245,237,214,0.4)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

export function CoffeeCup({ size = 96 }) {
  return (
    <div style={{ position: 'relative', width: size, height: size * 1.3, display: 'flex', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', top: -2, left: '50%', transform: 'translateX(-50%)', width: size * 0.8, height: size * 0.5 }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            position: 'absolute', left: `${30 + i * 22}%`, bottom: 0,
            width: 4, height: 28, borderRadius: 4,
            background: 'linear-gradient(to top, rgba(245,237,214,0.55), rgba(245,237,214,0))',
            transformOrigin: 'bottom center',
            animation: 'steamRise 2.4s ease-out infinite',
            animationDelay: `${i * 0.5}s`,
          }} />
        ))}
      </div>
      <svg viewBox="0 0 100 110" width={size} height={size * 1.1} style={{ position: 'absolute', bottom: 0 }}>
        <defs>
          <linearGradient id="cupG" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#f5c96a" />
            <stop offset="1" stopColor="#c98a1f" />
          </linearGradient>
        </defs>
        <ellipse cx="50" cy="100" rx="42" ry="6" fill="rgba(232,168,56,0.25)" />
        <path d="M22 50 Q22 95 50 95 Q78 95 78 50 Z" fill="url(#cupG)" stroke="#1a0f06" strokeWidth="2" />
        <path d="M78 60 Q92 60 92 72 Q92 84 78 84" fill="none" stroke="#1a0f06" strokeWidth="2.5" />
        <ellipse cx="50" cy="50" rx="28" ry="6" fill="#1a0f06" />
        <ellipse cx="50" cy="48" rx="22" ry="3.5" fill="#3a1e0a" />
      </svg>
    </div>
  );
}

export default function WelcomeScreen({ onMenu, onLogin, tableNumber }) {
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
      color: 'var(--cream-text)',
    }}>
      {/* blobs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {[
          { w: 360, h: 360, left: '20%', top: '10%', c: 'rgba(232,168,56,0.55)', blur: 40, anim: 'blob1 14s ease-in-out infinite' },
          { w: 320, h: 320, right: '5%', bottom: '15%', c: 'rgba(245,201,106,0.45)', blur: 50, anim: 'blob2 18s ease-in-out infinite' },
          { w: 280, h: 280, left: '-10%', bottom: '0%', c: 'rgba(139,94,60,0.5)', blur: 35, anim: 'blob3 22s ease-in-out infinite' },
          { w: 240, h: 240, right: '-8%', top: '0%', c: 'rgba(232,168,56,0.35)', blur: 40, anim: 'blob1 20s ease-in-out infinite reverse' },
        ].map((b, i) => (
          <div key={i} style={{
            position: 'absolute', width: b.w, height: b.h, borderRadius: '50%',
            left: b.left, right: b.right, top: b.top, bottom: b.bottom,
            background: `radial-gradient(circle, ${b.c}, rgba(0,0,0,0) 65%)`,
            filter: `blur(${b.blur}px)`,
            animation: b.anim,
          }} />
        ))}
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(26,15,6,0.4) 0%, rgba(26,15,6,0.25) 35%, rgba(26,15,6,0.65) 100%)' }} />
      <FloatingParticles />
      <CherryPetals count={40} />

      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', padding: '60px 28px 40px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div className="fade-up" style={{ animationDelay: '0.05s', marginBottom: 24 }}>
            <CoffeeCup size={84} />
          </div>

          <h1 className="fade-up" style={{
            animationDelay: '0.35s',
            fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 56,
            margin: 0, letterSpacing: '-0.01em', lineHeight: 1,
            background: 'linear-gradient(180deg, #f5edd6 0%, #e8a838 100%)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Brew &amp; Co.</h1>

          <div className="fade-up" style={{ animationDelay: '0.5s', width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)', margin: '18px 0' }} />

          <div className="fade-up" style={{
            animationDelay: '0.85s', marginTop: 16,
            fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 22,
            color: 'rgba(245,237,214,0.9)',
          }}>
            {greet.text} {greet.glyph}
          </div>

          <div className="fade-up" style={{
            animationDelay: '1.05s', marginTop: 22,
            padding: '8px 20px', borderRadius: 999,
            border: '1.5px solid rgba(232,168,56,0.7)',
            background: 'rgba(232,168,56,0.08)',
            color: 'var(--amber-light)',
            fontFamily: 'var(--sans)', fontWeight: 500, fontSize: 13,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            animation: 'fadeUp 0.65s var(--ease-out) 1.05s both, glowPulse 3.2s ease-in-out 1.7s infinite',
          }}>
            Blossom Table {tableNumber} 🌸
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button onClick={onMenu} className="btn-amber pulse fade-up" style={{ animationDelay: '1.3s' }}>
            Explore Menu →
          </button>
          <button onClick={onLogin} className="btn-ghost-dark fade-up" style={{ animationDelay: '1.45s' }}>
            Login / Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
