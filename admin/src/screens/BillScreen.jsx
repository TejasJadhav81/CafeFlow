import { useState, useMemo } from 'react';
import { useAdmin, A, IMG, MENU_DATA } from '../AdminContext';
import { AdminHeader, ATap } from '../components/Shell';
import { generateReceipt } from '../receipt';
import { saveOrder, closeTableOrders, updateCustomerPoints } from '../firebase';

export default function BillScreen({ table, onBack, onAddItems }) {
  const { setTables, showToast } = useAdmin();
  const [confirming, setConfirming] = useState(false);

  const items = table.items || [];
  const rows = useMemo(() => items.map(it => {
    const m = MENU_DATA.find(x => x.name === it.name);
    return { name: it.name, qty: it.qty, price: m?.price || 200, glyph: m?.glyph || '☕' };
  }), [items]);
  const total = rows.reduce((s, r) => s + r.qty * r.price, 0);

  const updateQty = (name, delta) => {
    setTables(prev => prev.map(t => {
      if (t.id !== table.id) return t;
      const its = (t.items || [])
        .map(it => it.name === name ? { ...it, qty: it.qty + delta } : it)
        .filter(it => it.qty > 0);
      return { ...t, items: its, status: its.length ? t.status : 'free' };
    }));
  };

  const confirmBill = async (print) => {
    if (rows.length === 0) { showToast('Add items first', 'pink'); return; }
    if (confirming) return;
    setConfirming(true);

    // 1. Free the table immediately — works offline, no waiting on Firebase
    setTables(prev => prev.map(t =>
      t.id === table.id ? { ...t, status: 'free', items: [] } : t
    ));

    // 2. Fire all Firebase ops in background — queued locally, sync when online
    saveOrder(table, rows, total);
    closeTableOrders(table.id);
    if (table.customerId) {
      const pts = Math.floor(total / 10);
      if (pts > 0) updateCustomerPoints(table.customerId, pts);
    }

    // 3. PDF if requested — this is local-only, always works
    if (print) {
      showToast('📄 Generating receipt…', 'blue', 3000);
      try {
        const { fileName } = await generateReceipt(table, rows, total);
        showToast(`✓ Saved · ${fileName}`, 'green', 3000);
      } catch (e) {
        showToast('Bill saved · PDF failed', 'pink');
      }
    } else {
      showToast('✓ Bill confirmed', 'green');
    }

    onBack();
  };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AdminHeader title={`Table ${table.id}`} sub={`${rows.length} items · ₹${total}`} onBack={onBack} />

      <div className="scroll-y" style={{ flex: 1, padding: '16px 16px 220px' }}>
        {rows.map((r, i) => (
          <div key={r.name} className="fade-up" style={{
            animationDelay: `${i * 0.04}s`,
            background: A.card, borderRadius: 14, marginBottom: 10,
            padding: 12, display: 'flex', alignItems: 'center', gap: 12,
          }}>
            {IMG[r.name] ? (
              <img src={IMG[r.name]} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `2px solid ${A.cardHi}` }} />
            ) : (
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: A.cardHi, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{r.glyph}</div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 15.5, color: A.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</div>
              <div style={{ fontFamily: A.sans, fontSize: 12, color: A.muted, marginTop: 2 }}>₹{r.price} each</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: `1px solid ${A.pink}`, borderRadius: 10, padding: 2 }}>
              <ATap onClick={() => updateQty(r.name, -1)} style={{ width: 28, height: 32, color: A.pink, fontSize: 18, fontWeight: 500 }}>−</ATap>
              <span style={{ minWidth: 18, textAlign: 'center', fontFamily: A.sans, fontWeight: 600, fontSize: 14, color: A.text }}>{r.qty}</span>
              <ATap onClick={() => updateQty(r.name, 1)} style={{ width: 28, height: 32, color: A.pink, fontSize: 18, fontWeight: 500 }}>+</ATap>
            </div>
            <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 16, color: A.text, minWidth: 56, textAlign: 'right' }}>₹{r.qty * r.price}</div>
          </div>
        ))}

        <ATap onClick={onAddItems} style={{
          width: '100%', padding: 14, borderRadius: 14,
          border: `1.5px dashed ${A.pink}`, color: A.pink,
          fontFamily: A.sans, fontWeight: 600, fontSize: 14, marginTop: 6,
          background: 'rgba(232,130,154,0.04)',
        }}>＋ Add Items</ATap>

        {rows.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: A.muted, fontFamily: A.serif, fontStyle: 'italic' }}>
            Empty bill. Tap + Add Items to begin.
          </div>
        )}
      </div>

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: A.surface, borderTop: `1px solid ${A.divider}`,
        padding: '18px 16px 22px', zIndex: 10,
      }}>
        <div style={{ background: A.card, borderRadius: 14, padding: '14px 16px', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: A.sans, fontSize: 12, color: A.muted, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Total Amount</div>
          <div key={total} style={{ fontFamily: A.serif, fontWeight: 700, fontSize: 30, color: A.gold, animation: 'aPop 0.35s var(--spring) both', letterSpacing: '-0.01em' }}>₹{total.toLocaleString('en-IN')}</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <ATap onClick={() => confirmBill(false)} style={{
            flex: 1, height: 56, borderRadius: 14,
            background: confirming ? A.cardHi : A.card,
            color: A.text,
            fontFamily: A.sans, fontWeight: 600, fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            opacity: confirming ? 0.6 : 1,
          }}>💾 Save Only</ATap>
          <ATap onClick={() => confirmBill(true)} style={{
            flex: 1, height: 56, borderRadius: 14,
            background: confirming
              ? A.cardHi
              : `linear-gradient(135deg, ${A.pink}, ${A.pinkDeep})`,
            color: '#fff',
            fontFamily: A.sans, fontWeight: 700, fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: confirming ? 'none' : `0 8px 20px ${A.pink}55`,
            opacity: confirming ? 0.6 : 1,
          }}>
            {confirming ? '⏳ Saving…' : '📄 Save + PDF'}
          </ATap>
        </div>
      </div>
    </div>
  );
}
