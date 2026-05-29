import { useState } from 'react';
import { useAdmin, A, IMG } from '../AdminContext';
import { AdminHeader, ATap } from '../components/Shell';

export default function AddItemsScreen({ table, onBack }) {
  const { setTables, showToast, menuItems } = useAdmin();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [added, setAdded] = useState({});

  const cats = ['All', 'Coffee', 'Food', 'Cold', 'Snacks'];
  const filtered = menuItems.filter(m =>
    (cat === 'All' || m.cat === cat) &&
    (!q || m.name.toLowerCase().includes(q.toLowerCase())) &&
    m.visible
  );
  const totalAdded = Object.values(added).reduce((a, b) => a + b, 0);

  const tap = (m) => setAdded(prev => ({ ...prev, [m.name]: (prev[m.name] || 0) + 1 }));

  const commit = () => {
    setTables(prev => prev.map(t => {
      if (t.id !== table.id) return t;
      const existing = t.items || [];
      const next = [...existing];
      Object.entries(added).forEach(([name, qty]) => {
        const idx = next.findIndex(x => x.name === name);
        if (idx >= 0) next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        else next.push({ name, qty });
      });
      return { ...t, items: next, status: 'progress' };
    }));
    showToast(`✓ ${totalAdded} items added to Table ${table.id}`, 'green');
    onBack();
  };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AdminHeader title="Add Items" sub={`Table ${table.id}`} onBack={onBack} />

      <div style={{ padding: '12px 16px 8px' }}>
        <div style={{ position: 'relative' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: A.muted, pointerEvents: 'none' }}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
          <input autoFocus placeholder="Search menu…" value={q} onChange={e => setQ(e.target.value)} style={{
            width: '100%', height: 48, borderRadius: 14,
            background: A.card, border: `1px solid ${A.divider}`,
            padding: '0 16px 0 40px', color: A.text,
            fontFamily: A.sans, fontSize: 14, outline: 'none',
          }} />
        </div>
      </div>

      <div className="no-scrollbar" style={{ padding: '4px 16px 8px', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {cats.map(c => (
          <ATap key={c} onClick={() => setCat(c)} style={{
            padding: '8px 14px', borderRadius: 999,
            background: cat === c ? A.pink : A.card,
            color: cat === c ? '#fff' : A.textDim,
            fontFamily: A.sans, fontSize: 12.5, fontWeight: 600,
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>{c}</ATap>
        ))}
      </div>

      <div className="scroll-y" style={{ flex: 1, padding: '8px 16px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {filtered.map((m, i) => {
            const count = added[m.name] || 0;
            return (
              <ATap key={m.name} onClick={() => tap(m)} className="fade-up" style={{
                animationDelay: `${i * 0.025}s`,
                background: A.card, borderRadius: 14, overflow: 'hidden',
                border: count > 0 ? `1.5px solid ${A.pink}` : `1px solid ${A.divider}`,
                boxShadow: count > 0 ? `0 0 18px ${A.pink}33` : 'none',
                textAlign: 'left', position: 'relative',
                flexDirection: 'column', alignItems: 'stretch',
              }}>
                <div style={{
                  height: 86, position: 'relative',
                  background: IMG[m.name] ? `url(${IMG[m.name]}) center/cover` : A.cardHi,
                }}>
                  {!IMG[m.name] && <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{m.glyph}</span>}
                  {count > 0 && (
                    <div key={count} style={{
                      position: 'absolute', top: 8, right: 8,
                      minWidth: 24, height: 24, padding: '0 7px', borderRadius: 999,
                      background: A.pink, color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: A.sans, fontWeight: 700, fontSize: 12,
                      animation: 'aPop .3s var(--spring) both',
                    }}>{count}</div>
                  )}
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 13.5, color: A.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
                  <div style={{ fontFamily: A.sans, fontSize: 13, color: A.pink, fontWeight: 600, marginTop: 4 }}>₹{m.price}</div>
                </div>
              </ATap>
            );
          })}
        </div>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '12px 16px 24px', background: A.surface, borderTop: `1px solid ${A.divider}`, zIndex: 10 }}>
        <ATap onClick={commit} disabled={totalAdded === 0} style={{
          width: '100%', height: 56, borderRadius: 14,
          background: totalAdded > 0 ? `linear-gradient(135deg, ${A.pink}, ${A.pinkDeep})` : A.card,
          color: totalAdded > 0 ? '#fff' : A.muted,
          fontFamily: A.sans, fontWeight: 700, fontSize: 15,
          boxShadow: totalAdded > 0 ? `0 8px 20px ${A.pink}55` : 'none',
        }}>
          {totalAdded > 0
            ? <span key={totalAdded} style={{ animation: 'aPop .3s var(--spring)' }}>Done · {totalAdded} {totalAdded === 1 ? 'item' : 'items'} added</span>
            : 'Tap items to add'}
        </ATap>
      </div>
    </div>
  );
}
