/* ───────── Brew & Co. — admin-screens-2.jsx ─────────
   Reports, Expenses, QR Codes, Customers (screens 7–10).
*/

const { useState: s2State, useMemo: s2Memo, useContext: s2Ctx } = React;
const _A2 = () => window.A;
const useAdmin2 = () => s2Ctx(window.AdminContext);

// ────────── SCREEN 7 — REPORTS ──────────
function ReportsScreen({ onHamburger }) {
  const A = _A2();
  const { orders, expenses, menuItems } = useAdmin2();
  const [period, setPeriod] = s2State('Today');

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const expenseTotal = expenses.filter(e => e.date === '2026-05-12').reduce((s, e) => s + e.amount, 0);
  const profit = revenue - expenseTotal;
  const avgBill = Math.round(revenue / Math.max(1, orders.length));
  const topTable = orders.reduce((a, o) => ({ ...a, [o.table]: (a[o.table] || 0) + 1 }), {});
  const topTableNum = Object.entries(topTable).sort((a, b) => b[1] - a[1])[0]?.[0] || 1;

  // 7-day bar chart values
  const bars = [
    { day: 'Mon', val: 3200 },
    { day: 'Tue', val: 4180 },
    { day: 'Wed', val: 3650 },
    { day: 'Thu', val: 5240 },
    { day: 'Fri', val: 6120 },
    { day: 'Sat', val: 7480 },
    { day: 'Sun', val: revenue, today: true },
  ];
  const maxBar = Math.max(...bars.map(b => b.val));

  const topItems = [
    { name: 'Saffron Latte', qty: 24, rev: 6240 },
    { name: 'Almond Croissant', qty: 21, rev: 5040 },
    { name: 'Cold Brew Tonic', qty: 18, rev: 4680 },
    { name: 'Avocado Sourdough', qty: 14, rev: 5320 },
    { name: 'Cappuccino', qty: 12, rev: 1680 },
  ];

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
        {/* stat cards 2x2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <StatCard label="Revenue" value={`₹${revenue.toLocaleString('en-IN')}`} sub="↑ 12% vs yesterday" subColor={A.greenSoft} color={A.greenSoft} serif />
          <StatCard label="Orders" value={orders.length} sub="confirmed bills" color={A.pink} serif />
          <StatCard label="Avg Bill" value={`₹${avgBill}`} sub="per order" color={A.gold} serif />
          <StatCard label="Top Table" value={topTableNum} sub={`${topTable[topTableNum]} orders`} color={A.orange} serif />
        </div>

        {/* revenue bar chart */}
        <div style={{ background: A.card, borderRadius: 16, padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 15, color: A.text }}>Revenue · 7 days</div>
            <div style={{ fontFamily: A.sans, fontSize: 11, color: A.muted }}>₹</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120, padding: '0 2px' }}>
            {bars.map((b, i) => (
              <div key={b.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: '100%',
                  height: `${(b.val / maxBar) * 100}%`,
                  background: b.today
                    ? `linear-gradient(180deg, ${A.pink}, ${A.pinkDeep})`
                    : `linear-gradient(180deg, ${A.pink}66, ${A.pinkDeep}66)`,
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

        {/* profit breakdown */}
        <div style={{ background: A.card, borderRadius: 16, padding: 16, marginBottom: 12 }}>
          <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 15, color: A.text, marginBottom: 14 }}>Profit · Today</div>
          <Row label="Revenue" valStyle={{ color: A.greenSoft }} val={`₹${revenue.toLocaleString('en-IN')}`} />
          <Row label="Expenses" valStyle={{ color: A.red }} val={`− ₹${expenseTotal.toLocaleString('en-IN')}`} />
          <div style={{ height: 1, background: A.divider, margin: '10px 0' }} />
          <Row
            label={<span style={{ fontWeight: 700, color: A.text }}>Net Profit</span>}
            val={<span style={{ fontFamily: A.serif, fontWeight: 700, fontSize: 22, color: A.gold }}>₹{profit.toLocaleString('en-IN')}</span>}
          />
          <div style={{ fontFamily: A.sans, fontSize: 11.5, color: A.muted, marginTop: 4, textAlign: 'right' }}>
            margin {Math.round((profit / revenue) * 100)}%
          </div>
        </div>

        {/* top items */}
        <div style={{ background: A.card, borderRadius: 16, padding: 16, marginBottom: 12 }}>
          <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 15, color: A.text, marginBottom: 12 }}>Top Items Today</div>
          {topItems.map((it, i) => (
            <div key={it.name} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 0',
              borderBottom: i === topItems.length - 1 ? 'none' : `1px solid ${A.divider}`,
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: i === 0 ? A.gold : A.cardHi,
                color: i === 0 ? '#1a1108' : A.textDim,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: A.sans, fontWeight: 700, fontSize: 11,
                flexShrink: 0,
              }}>{i + 1}</div>
              <img src={window.IMG[it.name]} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `1.5px solid ${A.cardHi}` }} />
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

function StatCard({ label, value, sub, subColor, color }) {
  const A = _A2();
  return (
    <div style={{ background: A.card, borderRadius: 16, padding: 14 }}>
      <div style={{ fontFamily: A.sans, fontSize: 11, fontWeight: 600, color: A.muted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: A.serif, fontWeight: 700, fontSize: 26, color: color || A.text, margin: '8px 0 4px', letterSpacing: '-0.01em' }}>{value}</div>
      {sub && <div style={{ fontFamily: A.sans, fontSize: 11.5, color: subColor || A.muted }}>{sub}</div>}
    </div>
  );
}

function Row({ label, val, valStyle }) {
  const A = _A2();
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0' }}>
      <div style={{ fontFamily: A.sans, fontSize: 13.5, color: A.textDim }}>{label}</div>
      <div style={{ fontFamily: A.sans, fontSize: 15, fontWeight: 600, color: A.text, ...valStyle }}>{val}</div>
    </div>
  );
}

// ────────── SCREEN 8 — DAILY EXPENSES ──────────
function ExpensesScreen({ onBack }) {
  const A = _A2();
  const { expenses, setExpenses, showToast } = useAdmin2();
  const [period, setPeriod] = s2State('Today');
  const [adding, setAdding] = s2State(false);
  const [amount, setAmount] = s2State('');
  const [note, setNote] = s2State('');
  const [confirmDel, setConfirmDel] = s2State(null);

  const grouped = s2Memo(() => {
    const g = {};
    for (const e of expenses) (g[e.date] = g[e.date] || []).push(e);
    return g;
  }, [expenses]);

  const save = () => {
    if (!amount) { showToast('Amount required', 'red'); return; }
    const now = new Date();
    const t = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setExpenses(prev => [{ id: Date.now(), amount: +amount, note: note || 'Cash expense', date: '2026-05-12', time: t }, ...prev]);
    showToast(`✓ ₹${amount} expense saved`, 'green');
    setAmount(''); setNote(''); setAdding(false);
  };

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AdminHeader title="Daily Expenses" onBack={onBack}
        right={
          <ATap onClick={() => setAdding(true)} style={{
            width: 40, height: 40, borderRadius: 12,
            background: `linear-gradient(135deg, ${A.pink}, ${A.pinkDeep})`,
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 12px ${A.pink}55`, fontSize: 22, fontWeight: 500,
          }}>+</ATap>
        }
      />

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

      <div className="scroll-y" style={{ flex: 1, padding: '8px 16px 24px' }}>
        {Object.entries(grouped).map(([date, items]) => {
          const dayTotal = items.reduce((s, e) => s + e.amount, 0);
          const d = new Date(date);
          const human = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' });
          return (
            <div key={date} style={{ marginBottom: 18 }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                padding: '8px 4px 12px',
              }}>
                <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 15, color: A.text }}>{human}</div>
                <div style={{ fontFamily: A.serif, fontWeight: 700, fontSize: 17, color: A.gold }}>Total ₹{dayTotal}</div>
              </div>
              {items.map((e, i) => (
                <div key={e.id} className="fade-up" style={{
                  animationDelay: `${i * 0.03}s`,
                  background: A.card, borderRadius: 14, padding: 14, marginBottom: 8,
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: A.serif, fontWeight: 700, fontSize: 18, color: A.pink }}>₹{e.amount}</div>
                    <div style={{ fontFamily: A.sans, fontSize: 12.5, color: A.textDim, marginTop: 2 }}>{e.note}</div>
                  </div>
                  <div style={{ fontFamily: A.sans, fontSize: 11.5, color: A.muted }}>{e.time}</div>
                  <ATap onClick={() => setConfirmDel(e)} style={{ width: 32, height: 32, borderRadius: 10, background: A.cardHi, color: A.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🗑</ATap>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* add expense sheet */}
      {adding && (
        <>
          <div onClick={() => setAdding(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50, backdropFilter: 'blur(4px)' }} />
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 51,
            background: A.surface, borderRadius: '20px 20px 0 0',
            padding: '16px 20px 28px',
            animation: 'aSheet .25s var(--spring) both',
          }}>
            <div style={{ width: 36, height: 4, background: A.divider, borderRadius: 2, margin: '0 auto 14px' }} />
            <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 22, color: A.text, marginBottom: 18 }}>Add Expense</div>

            <div style={{ background: A.card, borderRadius: 14, padding: 14, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: A.serif, fontSize: 28, color: A.pink }}>₹</span>
              <input
                autoFocus
                inputMode="numeric"
                value={amount}
                onChange={e => setAmount(e.target.value.replace(/[^\d]/g, ''))}
                placeholder="0"
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  fontFamily: A.serif, fontWeight: 700, fontSize: 32, color: A.text,
                }}
              />
            </div>

            <div style={{ background: A.card, borderRadius: 14, padding: 12, marginBottom: 18 }}>
              <input value={note} onChange={e => setNote(e.target.value)} placeholder="Note · e.g. Milk delivery"
                style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontFamily: A.sans, fontSize: 14, color: A.text, padding: '6px 4px' }}
              />
            </div>

            <div style={{ fontFamily: A.sans, fontSize: 12, color: A.muted, marginBottom: 14, padding: '0 4px' }}>
              Date · Today, 12 May 2026
            </div>

            <ATap onClick={save} style={{
              width: '100%', height: 56, borderRadius: 14,
              background: `linear-gradient(135deg, ${A.pink}, ${A.pinkDeep})`, color: '#fff',
              fontFamily: A.sans, fontWeight: 700, fontSize: 15,
              boxShadow: `0 8px 20px ${A.pink}55`,
            }}>Save Expense ♥</ATap>
          </div>
        </>
      )}

      {confirmDel && (
        <>
          <div onClick={() => setConfirmDel(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 60, backdropFilter: 'blur(4px)' }} />
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 61,
            background: A.surface, borderRadius: '20px 20px 0 0',
            padding: '16px 20px 28px',
            animation: 'aSheet .25s var(--spring) both',
          }}>
            <div style={{ width: 36, height: 4, background: A.divider, borderRadius: 2, margin: '0 auto 14px' }} />
            <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 18, color: A.text }}>Delete expense?</div>
            <div style={{ fontFamily: A.sans, fontSize: 13, color: A.textDim, margin: '8px 0 18px' }}>
              ₹{confirmDel.amount} · {confirmDel.note}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <ATap onClick={() => setConfirmDel(null)} style={{ flex: 1, height: 52, borderRadius: 12, background: A.card, color: A.text, fontFamily: A.sans, fontWeight: 600, fontSize: 13.5 }}>Cancel</ATap>
              <ATap onClick={() => { setExpenses(prev => prev.filter(x => x.id !== confirmDel.id)); setConfirmDel(null); showToast('Expense deleted', 'red'); }} style={{ flex: 1, height: 52, borderRadius: 12, background: A.red, color: '#fff', fontFamily: A.sans, fontWeight: 700, fontSize: 13.5 }}>Delete</ATap>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ────────── SCREEN 9 — QR CODES ──────────
function QRSquare({ seed, size = 90 }) {
  const A = _A2();
  // pseudo-random 11x11 grid driven by seed
  const cells = s2Memo(() => {
    const n = 11;
    const arr = [];
    let x = seed * 9301 + 49297;
    const rand = () => { x = (x * 9301 + 49297) % 233280; return x / 233280; };
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const isFinder = (r < 3 && c < 3) || (r < 3 && c > n - 4) || (r > n - 4 && c < 3);
        const isFinderInner = (r >= 1 && r <= 1 && c >= 1 && c <= 1) || (r >= 1 && r <= 1 && c >= n - 2 && c <= n - 2) || (r >= n - 2 && r <= n - 2 && c >= 1 && c <= 1);
        const finderOuter = (r === 0 || r === 2 || c === 0 || c === 2) && isFinder;
        const finderCenter = (r === 1 && c === 1) || (r === 1 && c === n - 2) || (r === n - 2 && c === 1);
        const on = isFinder ? (finderOuter || finderCenter) : rand() > 0.55;
        arr.push(on);
      }
    }
    return arr;
  }, [seed]);
  const n = 11;
  return (
    <div style={{
      width: size, height: size, background: '#fff',
      padding: 6, borderRadius: 8, flexShrink: 0,
      display: 'grid', gridTemplateColumns: `repeat(${n}, 1fr)`, gap: 1,
    }}>
      {cells.map((c, i) => (
        <div key={i} style={{ background: c ? '#0f1117' : '#fff', borderRadius: 1 }} />
      ))}
    </div>
  );
}

function QRScreen({ onBack }) {
  const A = _A2();
  const { tables, showToast } = useAdmin2();

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AdminHeader title="QR Codes" onBack={onBack} />

      <div className="scroll-y" style={{ flex: 1, padding: '16px 16px 100px' }}>
        <div style={{ fontFamily: A.sans, fontSize: 12.5, color: A.muted, padding: '0 4px 14px' }}>
          Customers scan to open the table's ordering page on their phone.
        </div>
        {tables.map((t, i) => (
          <div key={t.id} className="fade-up" style={{
            animationDelay: `${i * 0.04}s`,
            background: A.card, borderRadius: 16, padding: 14, marginBottom: 10,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <QRSquare seed={t.id * 7} size={86} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 17, color: A.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</div>
              <div style={{ fontFamily: A.sans, fontSize: 11.5, color: A.muted, marginTop: 4, wordBreak: 'break-all' }}>brew.menu/?table={t.id}</div>
              <ATap onClick={() => showToast(`Downloaded QR · Table ${t.id}`, 'blue')} style={{
                marginTop: 8, padding: '7px 14px', borderRadius: 999,
                border: `1px solid ${A.divider}`, color: A.textDim,
                fontFamily: A.sans, fontWeight: 500, fontSize: 12,
                display: 'inline-block',
              }}>↓ Download</ATap>
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '12px 16px 22px', background: A.surface, borderTop: `1px solid ${A.divider}`, zIndex: 10 }}>
        <ATap onClick={() => showToast('🖨 Sent all QR codes to printer', 'pink')} style={{
          width: '100%', height: 56, borderRadius: 14,
          background: `linear-gradient(135deg, ${A.pink}, ${A.pinkDeep})`, color: '#fff',
          fontFamily: A.sans, fontWeight: 700, fontSize: 15,
          boxShadow: `0 8px 20px ${A.pink}55`,
        }}>🖨 Print All QR Codes</ATap>
      </div>
    </div>
  );
}

// ────────── SCREEN 10 — CUSTOMERS ──────────
function CustomersScreen({ onBack }) {
  const A = _A2();
  const { customers, setCustomers, showToast } = useAdmin2();
  const [q, setQ] = s2State('');
  const [detail, setDetail] = s2State(null);

  const filtered = customers.filter(c =>
    !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.phone.includes(q)
  );

  const adjustPoints = (id, delta) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, points: Math.max(0, c.points + delta) } : c));
  };

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: `linear-gradient(135deg, ${A.pink}, ${A.green})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontFamily: A.serif, fontWeight: 600, fontSize: 17, flexShrink: 0,
            }}>{c.name.split(' ').map(w => w[0]).slice(0, 2).join('')}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 15, color: A.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
              <div style={{ fontFamily: A.sans, fontSize: 11.5, color: A.muted, marginTop: 2 }}>{c.visits} visits · ₹{c.spent.toLocaleString('en-IN')} spent</div>
            </div>
            <div style={{
              padding: '5px 10px', borderRadius: 999,
              background: A.pinkSoft, color: A.pink,
              fontFamily: A.sans, fontWeight: 700, fontSize: 12,
              display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
            }}>🌸 {c.points}</div>
          </ATap>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: A.muted, fontFamily: A.sans }}>No customers match.</div>
        )}
      </div>

      {detail && (
        <>
          <div onClick={() => setDetail(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50, backdropFilter: 'blur(4px)' }} />
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, top: 70, zIndex: 51,
            background: A.surface, borderRadius: '20px 20px 0 0',
            padding: '14px 20px 28px',
            animation: 'aSheet .3s var(--spring) both',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}>
            <div style={{ width: 36, height: 4, background: A.divider, borderRadius: 2, margin: '0 auto 14px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: `linear-gradient(135deg, ${A.pink}, ${A.green})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontFamily: A.serif, fontWeight: 600, fontSize: 22,
              }}>{detail.name.split(' ').map(w => w[0]).slice(0, 2).join('')}</div>
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
                <div key={i} style={{
                  padding: '10px 4px', borderBottom: `1px solid ${A.divider}`,
                  fontFamily: A.sans, fontSize: 13, color: A.textDim,
                  display: 'flex', justifyContent: 'space-between',
                }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>{line.split(' · ')[0]}</span>
                  <span style={{ color: A.pink, fontWeight: 600 }}>{line.split(' · ')[1]}</span>
                </div>
              ))}
            </div>

            <ATap onClick={() => { showToast(`${detail.name} blocked`, 'red'); setDetail(null); }} style={{
              marginTop: 12, width: '100%', height: 48, borderRadius: 12,
              background: 'transparent', border: `1px solid ${A.red}55`, color: A.red,
              fontFamily: A.sans, fontWeight: 600, fontSize: 13.5,
            }}>Block Account</ATap>
          </div>
        </>
      )}
    </div>
  );
}

window.ReportsScreen = ReportsScreen;
window.ExpensesScreen = ExpensesScreen;
window.QRScreen = QRScreen;
window.CustomersScreen = CustomersScreen;
