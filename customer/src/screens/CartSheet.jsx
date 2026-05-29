import { useState, useContext } from 'react';
import { BrewContext } from '../App';
import { placeOrAddToOrder } from '../firebase/firestore';

export default function CartSheet({ cart, cartTotal, onIncrement, onDecrement, onClose, onOrderPlaced, tableNumber, user }) {
  const { palette } = useContext(BrewContext);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handlePlaceOrder() {
    if (!cart.length) return;
    setLoading(true);
    setError('');
    try {
      await placeOrAddToOrder(tableNumber, cart, note, user?.uid || null);
      onOrderPlaced();
    } catch (e) {
      setError('Could not place order. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 40, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ flex: 1, background: 'rgba(26,15,6,0.55)', backdropFilter: 'blur(4px)' }} />
      <div style={{
        background: palette.surface,
        borderRadius: '24px 24px 0 0',
        padding: '0 0 40px',
        maxHeight: '80vh',
        display: 'flex', flexDirection: 'column',
        animation: 'slideUp .35s var(--ease-out) both',
      }}>
        {/* handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 8px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: palette.divider || 'var(--divider)' }} />
        </div>

        <div style={{ padding: '0 20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 600, color: palette.heading }}>Your Order</span>
          <span style={{ fontSize: 13, color: palette.muted }}>Table {tableNumber}</span>
        </div>

        {/* items */}
        <div className="scroll-y" style={{ flex: 1, padding: '0 20px' }}>
          {cart.map(item => (
            <div key={item.name} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 0',
              borderBottom: `1px solid ${palette.divider || 'var(--divider)'}`,
            }}>
              <span style={{ fontSize: 22, width: 32, textAlign: 'center' }}>{item.glyph}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: palette.heading }}>{item.name}</div>
                <div style={{ fontSize: 13, color: palette.accent, marginTop: 2 }}>₹{item.price} each</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: 'rgba(26,15,6,0.06)', borderRadius: 999, border: '1px solid var(--divider)' }}>
                <button onClick={() => onDecrement(item.name)} style={{ width: 32, height: 32, fontSize: 16, color: palette.body, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                <span style={{ minWidth: 24, textAlign: 'center', fontSize: 14, fontWeight: 600, color: palette.heading }}>{item.qty}</span>
                <button onClick={() => onIncrement(item.name)} style={{ width: 32, height: 32, fontSize: 16, color: palette.body, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              </div>
              <div style={{ minWidth: 52, textAlign: 'right', fontWeight: 600, fontSize: 14, color: palette.heading }}>
                ₹{item.price * item.qty}
              </div>
            </div>
          ))}

          {/* note */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: palette.muted, marginBottom: 8 }}>Order note</div>
            <textarea
              placeholder="Any special request for the whole order…"
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={2}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(26,15,6,0.04)', border: '1px solid var(--divider)',
                borderRadius: 12, padding: '12px 14px',
                fontFamily: 'var(--sans)', fontSize: 14, color: palette.body,
                resize: 'none', outline: 'none',
              }}
            />
          </div>
        </div>

        {/* total + CTA */}
        <div style={{ padding: '16px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 16, color: palette.muted }}>Total</span>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 700, color: palette.heading }}>₹{cartTotal}</span>
          </div>
          {error && (
            <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(232,130,154,0.1)', border: '1px solid rgba(232,130,154,0.3)', color: '#e8829a', fontSize: 13, marginBottom: 12 }}>{error}</div>
          )}
          <button className="btn-amber pulse" onClick={handlePlaceOrder} disabled={loading || !cart.length} style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Placing order…' : `Place Order · ₹${cartTotal}`}
          </button>
        </div>
      </div>
    </div>
  );
}
