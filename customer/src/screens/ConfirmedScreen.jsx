import { useEffect, useState, useContext } from 'react';
import { BrewContext } from '../App';
import { CherryPetals } from './WelcomeScreen';

function Confetti() {
  const pieces = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    cx: (Math.random() - 0.5) * 280 + 'px',
    cy: 180 + Math.random() * 120 + 'px',
    cr: Math.random() * 720 - 360 + 'deg',
    color: ['#e8a838', '#f5c96a', '#e8829a', '#f7c5d0', '#c98a1f'][i % 5],
    left: 30 + Math.random() * 40,
    size: 6 + Math.random() * 6,
    delay: Math.random() * 0.4,
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: p.left + '%', top: '42%',
          width: p.size, height: p.size,
          borderRadius: 2,
          background: p.color,
          '--cx': p.cx, '--cy': p.cy, '--cr': p.cr,
          animation: `confetti 1.2s var(--ease-out) ${p.delay}s both`,
          opacity: 0,
        }} />
      ))}
    </div>
  );
}

function CheckCircle({ palette }) {
  return (
    <svg width="90" height="90" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="none" stroke={palette.accent || 'var(--amber)'} strokeWidth="3"
        strokeDasharray="314" strokeDashoffset="0"
        style={{ animation: 'drawCircle .8s ease-out .1s both', strokeDashoffset: 314 }} />
      <polyline points="30,52 44,66 70,36" fill="none"
        stroke={palette.accent || 'var(--amber)'} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="100" strokeDashoffset="100"
        style={{ animation: 'drawCheck .5s ease-out .9s both' }} />
    </svg>
  );
}

export default function ConfirmedScreen({ onBackToMenu, tableNumber, user, points }) {
  const { palette } = useContext(BrewContext);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: palette.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      color: palette.body,
      padding: '40px 32px',
      textAlign: 'center',
      overflow: 'hidden',
    }}>
      <CherryPetals count={8} intense />
      {showConfetti && <Confetti />}

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div className="scale-in" style={{ marginBottom: 28 }}>
          <CheckCircle palette={palette} />
        </div>

        <h1 className="fade-up" style={{
          animationDelay: '0.3s',
          fontFamily: 'var(--serif)', fontSize: 34, fontWeight: 700,
          color: palette.heading, margin: '0 0 10px',
        }}>Added to your bill! 🎉</h1>

        <p className="fade-up" style={{
          animationDelay: '0.45s',
          fontSize: 15, color: palette.muted, margin: '0 0 8px', lineHeight: 1.6,
        }}>
          Items sent to the kitchen for <strong style={{ color: palette.heading }}>Table {tableNumber}</strong>.<br />
          Your bill stays open — order more anytime.
        </p>

        {user && (
          <div className="fade-up" style={{
            animationDelay: '0.6s',
            marginTop: 20, padding: '12px 20px',
            borderRadius: 999,
            background: 'rgba(232,168,56,0.1)',
            border: '1px solid rgba(232,168,56,0.3)',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 13, color: palette.accent, fontWeight: 500,
          }}>
            ⭐ You now have <strong>{points} loyalty points</strong>
          </div>
        )}

        <div className="fade-up" style={{ animationDelay: '0.8s', marginTop: 40, width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn-amber" onClick={onBackToMenu}>
            ➕ Add More Items
          </button>
          <button className="btn-ghost-light" onClick={onBackToMenu} style={{
            background: 'transparent',
            border: `1.5px solid ${palette.accent || 'rgba(255,255,255,0.2)'}`,
            color: palette.muted,
            padding: '14px',
            borderRadius: 14,
            fontFamily: 'var(--sans)',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
          }}>
            That's all, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
