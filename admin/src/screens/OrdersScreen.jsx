import { useState } from 'react';
import { useAdmin, A } from '../AdminContext';
import { AdminHeader, ATap } from '../components/Shell';
import { generateReceipt } from '../receipt';

export default function OrdersScreen({ onHamburger }) {
  const { orders, showToast } = useAdmin();
  const [filter, setFilter] = useState('Today');
  const [reprinting, setReprinting] = useState(null);

  const reprint = async (o) => {
    if (reprinting === o.id) return;
    setReprinting(o.id);
    showToast('📄 Generating receipt…', 'blue', 3000);
    try {
      const table = { id: o.table, name: `Table ${o.table}` };
      const rows = (o.raw?.items || []).map(it => ({
        name: it.name, qty: it.qty || 1, price: it.price || 0, glyph: it.glyph || '☕',
      }));
      const total = o.total || rows.reduce((s, r) => s + r.qty * r.price, 0);
      const { fileName } = await generateReceipt(table, rows, total);
      showToast(`✓ Saved · ${fileName}`, 'green', 3000);
    } catch (e) {
      showToast('PDF failed', 'pink');
    } finally {
      setReprinting(null);
    }
  };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AdminHeader title="Orders" onHamburger={onHamburger} />

      <div style={{ padding: '12px 16px 8px', display: 'flex', gap: 6 }}>
        {['Today', 'This Week', 'This Month'].map(f => (
          <ATap key={f} onClick={() => setFilter(f)} style={{
            flex: 1, padding: '10px 0', borderRadius: 999,
            background: filter === f ? A.pink : A.card,
            color: filter === f ? '#fff' : A.textDim,
            fontFamily: A.sans, fontSize: 12.5, fontWeight: 600,
          }}>{f}</ATap>
        ))}
      </div>

      <div className="scroll-y" style={{ flex: 1, padding: '8px 16px 100px' }}>
        {orders.map((o, i) => (
          <div key={o.id} className="fade-up" style={{
            animationDelay: `${i * 0.04}s`,
            background: A.card, borderRadius: 14, padding: 14, marginBottom: 10,
            opacity: o.status === 'pending' ? 0.75 : 1,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: o.status === 'confirmed' ? A.greenSoft : A.pink, boxShadow: `0 0 6px ${o.status === 'confirmed' ? A.greenSoft : A.pink}` }} />
                <span style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 16, color: A.text }}>Table {o.table}</span>
                <span style={{ fontFamily: A.sans, fontSize: 11.5, color: A.muted, letterSpacing: '0.04em' }}>· {o.id}</span>
              </div>
              <span style={{ fontFamily: A.sans, fontSize: 12, color: A.muted }}>{o.time}</span>
            </div>
            <div style={{ fontFamily: A.sans, fontSize: 12.5, color: A.textDim, marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.items}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <div style={{ fontFamily: A.serif, fontWeight: 700, fontSize: 18, color: A.pink }}>₹{o.total}</div>
              {o.status === 'pending' ? (
                <span style={{ fontFamily: A.sans, fontSize: 11.5, color: A.yellow }}>⏳ Syncing…</span>
              ) : (
                <ATap onClick={() => reprint(o)} style={{
                  padding: '6px 14px', borderRadius: 999, border: `1px solid ${A.divider}`,
                  fontFamily: A.sans, fontWeight: 500, fontSize: 11.5,
                  color: reprinting === o.id ? A.muted : A.textDim,
                  opacity: reprinting === o.id ? 0.6 : 1,
                }}>
                  {reprinting === o.id ? '⏳ Saving…' : '📄 Reprint'}
                </ATap>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
