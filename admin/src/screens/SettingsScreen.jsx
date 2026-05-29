import { useState } from 'react';
import { useAdmin, A } from '../AdminContext';
import { AdminHeader, ATap } from '../components/Shell';

function Row({ label, sub, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: `1px solid ${A.divider}` }}>
      <div>
        <div style={{ fontFamily: A.sans, fontSize: 14, fontWeight: 600, color: A.text }}>{label}</div>
        {sub && <div style={{ fontFamily: A.sans, fontSize: 11.5, color: A.muted, marginTop: 2 }}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

export default function SettingsScreen({ onBack }) {
  const { isOnline, showToast } = useAdmin();
  const [customerUrl, setCustomerUrl] = useState(
    localStorage.getItem('bc_customer_url') || 'customer-sable-seven.vercel.app'
  );
  const [pin, setPin] = useState(localStorage.getItem('bc_admin_pin') || '');
  const [editUrl, setEditUrl] = useState(false);
  const [editPin, setEditPin] = useState(false);
  const [tempUrl, setTempUrl] = useState(customerUrl);
  const [tempPin, setTempPin] = useState(pin);
  const [sound, setSound] = useState(localStorage.getItem('bc_sound') !== 'off');

  const saveUrl = () => {
    localStorage.setItem('bc_customer_url', tempUrl.trim());
    setCustomerUrl(tempUrl.trim());
    setEditUrl(false);
    showToast('✓ URL saved', 'green');
  };

  const savePin = () => {
    localStorage.setItem('bc_admin_pin', tempPin.trim());
    setPin(tempPin.trim());
    setEditPin(false);
    showToast('✓ PIN saved', 'green');
  };

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    localStorage.setItem('bc_sound', next ? 'on' : 'off');
    showToast(next ? '🔔 Sound on' : '🔕 Sound off', 'blue');
  };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AdminHeader title="Settings" onBack={onBack} />

      <div className="scroll-y" style={{ flex: 1, paddingBottom: 40 }}>

        {/* Status */}
        <div style={{ padding: '14px 16px', background: A.card, margin: '12px 16px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: isOnline ? A.greenSoft : A.red, boxShadow: isOnline ? `0 0 8px ${A.greenSoft}` : 'none' }} />
          <div style={{ fontFamily: A.sans, fontSize: 13.5, color: A.text }}>
            {isOnline ? 'Online — Firebase connected' : 'Offline — changes will sync later'}
          </div>
        </div>

        {/* Section: Ordering */}
        <div style={{ fontFamily: A.sans, fontSize: 11, fontWeight: 600, color: A.muted, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '14px 16px 6px' }}>Ordering</div>
        <div style={{ background: A.surface, borderTop: `1px solid ${A.divider}`, borderBottom: `1px solid ${A.divider}` }}>
          <Row label="Customer App URL" sub={customerUrl}>
            <ATap onClick={() => { setTempUrl(customerUrl); setEditUrl(true); }} style={{ padding: '6px 12px', borderRadius: 8, background: A.cardHi, color: A.pink, fontFamily: A.sans, fontWeight: 600, fontSize: 12.5 }}>Edit</ATap>
          </Row>
          <Row label="Order Notification Sound" sub="Chime when new order arrives">
            <ATap onClick={toggleSound} style={{ width: 52, height: 30, borderRadius: 999, background: sound ? A.greenSoft : A.red, position: 'relative', transition: 'background .2s ease', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 3, left: sound ? 25 : 3, width: 24, height: 24, borderRadius: '50%', background: '#fff', transition: 'left .2s var(--spring)', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }} />
            </ATap>
          </Row>
        </div>

        {/* Section: Security */}
        <div style={{ fontFamily: A.sans, fontSize: 11, fontWeight: 600, color: A.muted, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '14px 16px 6px' }}>Security</div>
        <div style={{ background: A.surface, borderTop: `1px solid ${A.divider}`, borderBottom: `1px solid ${A.divider}` }}>
          <Row label="Admin PIN" sub={pin ? '••••' : 'Not set'}>
            <ATap onClick={() => { setTempPin(pin); setEditPin(true); }} style={{ padding: '6px 12px', borderRadius: 8, background: A.cardHi, color: A.pink, fontFamily: A.sans, fontWeight: 600, fontSize: 12.5 }}>
              {pin ? 'Change' : 'Set PIN'}
            </ATap>
          </Row>
        </div>

        {/* Section: About */}
        <div style={{ fontFamily: A.sans, fontSize: 11, fontWeight: 600, color: A.muted, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '14px 16px 6px' }}>About</div>
        <div style={{ background: A.surface, borderTop: `1px solid ${A.divider}`, borderBottom: `1px solid ${A.divider}` }}>
          <Row label="Brew & Co. Admin" sub="POS v1.0.0" />
          <Row label="Firebase Project" sub="cafe-e0690" />
        </div>
      </div>

      {/* Edit URL sheet */}
      {editUrl && (
        <>
          <div onClick={() => setEditUrl(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50, backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 51, background: A.surface, borderRadius: '20px 20px 0 0', padding: '16px 20px 28px', animation: 'aSheet .25s var(--spring) both' }}>
            <div style={{ width: 36, height: 4, background: A.divider, borderRadius: 2, margin: '0 auto 14px' }} />
            <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 20, color: A.text, marginBottom: 14 }}>Customer App URL</div>
            <input autoFocus value={tempUrl} onChange={e => setTempUrl(e.target.value)}
              style={{ width: '100%', height: 48, borderRadius: 12, background: A.card, border: `1px solid ${A.divider}`, padding: '0 14px', color: A.text, fontFamily: A.sans, fontSize: 14, outline: 'none', marginBottom: 14 }} />
            <ATap onClick={saveUrl} style={{ width: '100%', height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${A.pink}, ${A.pinkDeep})`, color: '#fff', fontFamily: A.sans, fontWeight: 700, fontSize: 15 }}>Save</ATap>
          </div>
        </>
      )}

      {/* Edit PIN sheet */}
      {editPin && (
        <>
          <div onClick={() => setEditPin(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50, backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 51, background: A.surface, borderRadius: '20px 20px 0 0', padding: '16px 20px 28px', animation: 'aSheet .25s var(--spring) both' }}>
            <div style={{ width: 36, height: 4, background: A.divider, borderRadius: 2, margin: '0 auto 14px' }} />
            <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 20, color: A.text, marginBottom: 14 }}>Set Admin PIN</div>
            <input autoFocus inputMode="numeric" maxLength={6} value={tempPin} onChange={e => setTempPin(e.target.value.replace(/\D/g, ''))}
              placeholder="4–6 digits" type="password"
              style={{ width: '100%', height: 48, borderRadius: 12, background: A.card, border: `1px solid ${A.divider}`, padding: '0 14px', color: A.text, fontFamily: A.sans, fontSize: 18, outline: 'none', marginBottom: 14, letterSpacing: '0.3em' }} />
            <ATap onClick={savePin} style={{ width: '100%', height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${A.pink}, ${A.pinkDeep})`, color: '#fff', fontFamily: A.sans, fontWeight: 700, fontSize: 15 }}>Save PIN</ATap>
          </div>
        </>
      )}
    </div>
  );
}
