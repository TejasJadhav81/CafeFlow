import { useState } from 'react';
import { useAdmin, A, IMG } from '../AdminContext';
import { AdminHeader, ATap } from '../components/Shell';

function StatCard({ label, value, sub, subColor, color }) {
  return (
    <div style={{ background: A.card, borderRadius: 16, padding: 14 }}>
      <div style={{ fontFamily: A.sans, fontSize: 11, fontWeight: 600, color: A.muted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: A.serif, fontWeight: 700, fontSize: 26, color: color || A.text, margin: '8px 0 4px', letterSpacing: '-0.01em' }}>{value}</div>
      {sub && <div style={{ fontFamily: A.sans, fontSize: 11.5, color: subColor || A.muted }}>{sub}</div>}
    </div>
  );
}

function Row({ label, val, valStyle }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0' }}>
      <div style={{ fontFamily: A.sans, fontSize: 13.5, color: A.textDim }}>{label}</div>
      <div style={{ fontFamily: A.sans, fontSize: 15, fontWeight: 600, color: A.text, ...valStyle }}>{val}</div>
    </div>
  );
}

export default function ReportsScreen({ onHamburger }) {
  const { orders, expenses } = useAdmin();
  const [period, setPeriod] = useState('Today');

  const today = new Date().toISOString().split('T')[0];

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const expenseTotal = expenses.filter(e => e.date === today).reduce((s, e) => s + e.amount, 0);
  const profit = revenue - expenseTotal;
  const avgBill = Math.round(revenue / Math.max(1, orders.length));
  const topTable = orders.reduce((a, o) => ({ ...a, [o.table]: (a[o.table] || 0) + 1 }), {});
  const topTableNum = Object.entries(topTable).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  // Build top items from real orders
  const itemMap = {};
  orders.forEach(o => {
    (o.raw?.items || []).forEach(it => {
      if (!itemMap[it.name]) itemMap[it.name] = { name: it.name, qty: 0, rev: 0 };
      itemMap[it.name].qty += it.qty || 1;
      itemMap[it.name].rev += (it.qty || 1) * (it.price || 0);
    });
  });
  const topItems = Object.values(itemMap).sort((a, b) => b.qty - a.qty).slice(0, 5);

  const bars = [
    { day: 'Mon', val: 3200 }, { day: 'Tue', val: 4180 }, { day: 'Wed', val: 3650 },
    { day: 'Thu', val: 5240 }, { day: 'Fri', val: 6120 }, { day: 'Sat', val: 7480 },
    { day: 'Sun', val: Math.max(revenue, 100), today: true },
  ];
  const maxBar = Math.max(...bars.map(b => b.val));

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AdminHeader title="Reports" onHamburger={onHamburger} />

      <div style={{ padding: '12px 16px 8px', display: 'flex', gap: 6 }}>
        {['Today', 'This Week', 'This Month'].map(p => (
          <ATap key={p} onClick={() => setPeriod(p)} style={{
            flex: 1, padding: '10px 0', borderRadius: 999,
            background: period === p ? A.pink : A.card,
            color: period === p ? '#fff' : A.textDim,
            fontFamily: A.sans, fontSize: 12.5, fontWeight: 600,
          }}>{p}</ATap>
        ))}
      </div>

      <div className="scroll-y" style={{ flex: 1, padding: '8px 16px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <StatCard label="Revenue" value={`₹${revenue.toLocaleString('en-IN')}`} sub="↑ 12% vs yesterday" subColor={A.greenSoft} color={A.greenSoft} />
          <StatCard label="Orders" value={orders.length} sub="confirmed bills" color={A.pink} />
          <StatCard label="Avg Bill" value={`₹${avgBill}`} sub="per order" color={A.gold} />
          <StatCard label="Top Table" value={topTableNum} sub={`${topTable[topTableNum]} orders`} color={A.orange} />
        </div>

        <div style={{ background: A.card, borderRadius: 16, padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 15, color: A.text }}>Revenue · 7 days</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120, padding: '0 2px' }}>
            {bars.map((b, i) => (
              <div key={b.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: '100%',
                  height: `${(b.val / maxBar) * 100}%`,
                  background: b.today ? `linear-gradient(180deg, ${A.pink}, ${A.pinkDeep})` : `linear-gradient(180deg, ${A.pink}66, ${A.pinkDeep}66)`,
                  borderRadius: '6px 6px 2px 2px',
                  transformOrigin: 'bottom',
                  animation: `aGrow ${0.4 + i * 0.06}s var(--spring) both`,
                  boxShadow: b.today ? `0 0 16px ${A.pink}66` : 'none',
                }} />
                <div style={{ fontFamily: A.sans, fontSize: 10.5, color: b.today ? A.pink : A.muted, fontWeight: b.today ? 700 : 500 }}>{b.day}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: A.card, borderRadius: 16, padding: 16, marginBottom: 12 }}>
          <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 15, color: A.text, marginBottom: 14 }}>Profit · Today</div>
          <Row label="Revenue" valStyle={{ color: A.greenSoft }} val={`₹${revenue.toLocaleString('en-IN')}`} />
          <Row label="Expenses" valStyle={{ color: A.red }} val={`− ₹${expenseTotal.toLocaleString('en-IN')}`} />
          <div style={{ height: 1, background: A.divider, margin: '10px 0' }} />
          <Row label={<span style={{ fontWeight: 700, color: A.text }}>Net Profit</span>} val={<span style={{ fontFamily: A.serif, fontWeight: 700, fontSize: 22, color: A.gold }}>₹{profit.toLocaleString('en-IN')}</span>} />
          <div style={{ fontFamily: A.sans, fontSize: 11.5, color: A.muted, marginTop: 4, textAlign: 'right' }}>margin {Math.round((profit / revenue) * 100)}%</div>
        </div>

        <div style={{ background: A.card, borderRadius: 16, padding: 16, marginBottom: 12 }}>
          <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 15, color: A.text, marginBottom: 12 }}>Top Items Today</div>
          {topItems.map((it, i) => (
            <div key={it.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i === topItems.length - 1 ? 'none' : `1px solid ${A.divider}` }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: i === 0 ? A.gold : A.cardHi, color: i === 0 ? '#1a1108' : A.textDim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: A.sans, fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{i + 1}</div>
              {IMG[it.name] && <img src={IMG[it.name]} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `1.5px solid ${A.cardHi}` }} />}
              <div style={{ flex: 1, fontFamily: A.serif, fontSize: 14, fontWeight: 500, color: A.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</div>
              <div style={{ fontFamily: A.sans, fontSize: 12, color: A.muted, minWidth: 30, textAlign: 'right' }}>×{it.qty}</div>
              <div style={{ fontFamily: A.sans, fontSize: 13, color: A.pink, fontWeight: 600, minWidth: 60, textAlign: 'right' }}>₹{it.rev}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
