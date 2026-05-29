import { useState } from 'react';
import { useAdmin, A } from '../AdminContext';
import { AdminHeader, ATap } from '../components/Shell';
import { updateCustomerPoints } from '../firebase';

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{ background: A.card, borderRadius: 16, padding: 14 }}>
      <div style={{ fontFamily: A.sans, fontSize: 11, fontWeight: 600, color: A.muted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: A.serif, fontWeight: 700, fontSize: 26, color: color || A.text, margin: '8px 0 4px' }}>{value}</div>
      {sub && <div style={{ fontFamily: A.sans, fontSize: 11.5, color: A.muted }}>{sub}</div>}
    </div>
  );
}

function initials(name) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('');
}

export default function CustomersScreen({ onBack }) {
  const { customers, showToast } = useAdmin();
  const [q, setQ] = useState('');
  const [detail, setDetail] = useState(null);

  const filtered = customers.filter(c =>
    !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.phone.includes(q)
  );

  const adjustPoints = async (id, delta) => {
    await updateCustomerPoints(id, delta);
    showToast(`${delta > 0 ? '+' : ''}${delta} points updated`, 'green');
  };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AdminHeader title="Customers" onBack={onBack} />

      <div style={{ padding: '12px 16px 8px' }}>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, phone…"
          style={{ width: '100%', height: 44, borderRadius: 12, background: A.card, border: `1px solid ${A.divider}`, padding: '0 14px', color: A.text, fontFamily: A.sans, fontSize: 14, outline: 'none' }} />
      </div>

      <div className="scroll-y" style={{ flex: 1, padding: '8px 16px 24px' }}>
        {filtered.map((c, i) => (
          <ATap key={c.id} onClick={() => setDetail(c)} className="fade-up" style={{
            animationDelay: `${i * 0.04}s`,
            background: A.card, borderRadius: 14, padding: 14, marginBottom: 8,
            display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left',
          }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: `linear-gradient(135deg, ${A.pink}, ${A.green})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: A.serif, fontWeight: 600, fontSize: 17, flexShrink: 0 }}>{initials(c.name)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 15, color: A.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
              <div style={{ fontFamily: A.sans, fontSize: 11.5, color: A.muted, marginTop: 2 }}>{c.visits} visits · ₹{c.spent.toLocaleString('en-IN')} spent</div>
            </div>
            <div style={{ padding: '5px 10px', borderRadius: 999, background: A.pinkSoft, color: A.pink, fontFamily: A.sans, fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>🌸 {c.points}</div>
          </ATap>
        ))}
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: A.muted, fontFamily: A.sans }}>No customers match.</div>}
      </div>

      {detail && (
        <>
          <div onClick={() => setDetail(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50, backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 70, zIndex: 51, background: A.surface, borderRadius: '20px 20px 0 0', padding: '14px 20px 28px', animation: 'aSheet .3s var(--spring) both', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ width: 36, height: 4, background: A.divider, borderRadius: 2, margin: '0 auto 14px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: `linear-gradient(135deg, ${A.pink}, ${A.green})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: A.serif, fontWeight: 600, fontSize: 22 }}>{initials(detail.name)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 20, color: A.text }}>{detail.name}</div>
                <div style={{ fontFamily: A.sans, fontSize: 12.5, color: A.muted }}>{detail.phone}</div>
              </div>
            </div>

            <div style={{ background: A.card, borderRadius: 14, padding: 16, marginBottom: 12, textAlign: 'center' }}>
              <div style={{ fontFamily: A.sans, fontSize: 11, color: A.muted, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Points balance</div>
              <div style={{ fontFamily: A.serif, fontWeight: 700, fontSize: 44, color: A.pink, margin: '6px 0' }}>🌸 {customers.find(c => c.id === detail.id)?.points}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <ATap onClick={() => adjustPoints(detail.id, 10)} style={{ flex: 1, height: 40, borderRadius: 10, background: A.cardHi, color: A.greenSoft, fontFamily: A.sans, fontWeight: 600, fontSize: 13 }}>+ Add Points</ATap>
                <ATap onClick={() => adjustPoints(detail.id, -10)} style={{ flex: 1, height: 40, borderRadius: 10, background: A.cardHi, color: A.red, fontFamily: A.sans, fontWeight: 600, fontSize: 13 }}>− Remove</ATap>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <StatCard label="Visits" value={detail.visits} sub="lifetime" color={A.gold} />
              <StatCard label="Spent" value={`₹${(detail.spent / 1000).toFixed(1)}k`} sub="lifetime" color={A.greenSoft} />
            </div>

            <div style={{ fontFamily: A.sans, fontSize: 11, fontWeight: 600, color: A.muted, letterSpacing: '0.16em', textTransform: 'uppercase', margin: '6px 4px 8px' }}>Recent orders</div>
            <div className="scroll-y" style={{ flex: 1 }}>
              {['Saffron Latte, Almond Croissant · ₹500', 'Eggs Benedict, Flat White · ₹640', 'Cold Brew Tonic x2 · ₹520', 'Cardamom Mocha, Banana Bread · ₹460', 'Avocado Sourdough · ₹380'].map((line, i) => (
                <div key={i} style={{ padding: '10px 4px', borderBottom: `1px solid ${A.divider}`, fontFamily: A.sans, fontSize: 13, color: A.textDim, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>{line.split(' · ')[0]}</span>
                  <span style={{ color: A.pink, fontWeight: 600 }}>{line.split(' · ')[1]}</span>
                </div>
              ))}
            </div>

            <ATap onClick={() => { showToast(`${detail.name} blocked`, 'red'); setDetail(null); }} style={{ marginTop: 12, width: '100%', height: 48, borderRadius: 12, background: 'transparent', border: `1px solid ${A.red}55`, color: A.red, fontFamily: A.sans, fontWeight: 600, fontSize: 13.5 }}>Block Account</ATap>
          </div>
        </>
      )}
    </div>
  );
}
