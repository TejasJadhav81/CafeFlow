/* ───────── Brew & Co. — admin-screens.jsx ─────────
   Ten admin POS screens. All read shared state from AdminContext.
*/

const { useState: sUseState, useEffect: sUseEffect, useMemo: sUseMemo, useContext: sUseContext, useRef: sUseRef } = React;

// quick aliases
const _A = () => window.A;
const useAdmin = () => sUseContext(window.AdminContext);

// ────────── SCREEN 1 — TABLE GRID ──────────
function TableGridScreen({ onOpenBill, onHamburger, notification, onViewNotif }) {
  const A = _A();
  const { tables, showToast } = useAdmin();
  const [conn] = sUseState('online');
  const connColor = conn === 'online' ? A.greenSoft : conn === 'syncing' ? A.yellow : A.red;

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <AdminHeader title="Brew & Co." onHamburger={onHamburger}
        right={
          <>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: connColor, boxShadow: `0 0 8px ${connColor}` }} />
            <ATap style={{
              width: 40, height: 40, borderRadius: 12, background: A.card, color: A.text,
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 004 0" /></svg>
              <span style={{ position: 'absolute', top: 8, right: 9, width: 7, height: 7, borderRadius: '50%', background: A.pink, border: `1.5px solid ${A.card}` }} />
            </ATap>
          </>
        }
      />

      <div className="scroll-y" style={{ flex: 1, padding: '16px 16px 96px' }}>
        {/* greeting */}
        <div style={{ padding: '0 4px 16px' }}>
          <div style={{ fontFamily: A.serif, fontSize: 22, color: A.text, fontStyle: 'italic', fontWeight: 600, letterSpacing: '-0.01em' }}>
            Good afternoon ☕
          </div>
          <div style={{ fontFamily: A.sans, fontSize: 13, color: A.muted, marginTop: 4 }}>
            {tables.filter(t => t.status === 'free').length} free · {tables.filter(t => t.status === 'progress').length} active · {tables.filter(t => t.status === 'bill').length} bill ready
          </div>
        </div>

        {/* quick legend */}
        <div style={{ display: 'flex', gap: 14, padding: '0 4px 16px', fontFamily: A.sans, fontSize: 11.5, color: A.textDim, letterSpacing: '0.04em' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><StatusDot status="free" /> Free</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><StatusDot status="progress" /> Active</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><StatusDot status="bill" /> Bill Ready</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {tables.map((t, i) => {
            const isPulse = notification && notification.tableId === t.id;
            const tone = t.status === 'free'
              ? { bg: A.card, dot: A.greenSoft, label: 'Free', labelColor: A.greenSoft, border: A.divider, glow: 'none' }
              : t.status === 'progress'
              ? { bg: '#2a1a1d', dot: A.yellow, label: 'Order', labelColor: A.yellow, border: 'rgba(232,130,154,0.25)', glow: `0 0 18px ${A.pink}22` }
              : { bg: '#2a1f15', dot: A.orange, label: 'Bill Ready', labelColor: A.orange, border: 'rgba(240,147,58,0.4)', glow: `0 0 22px ${A.orange}44` };
            return (
              <ATap key={t.id} onClick={() => onOpenBill(t)} className={'fade-up ' + (isPulse ? 'pulsePink' : '')} style={{
                animationDelay: `${i * 0.04}s`,
                background: tone.bg,
                border: `1px solid ${isPulse ? A.pink : tone.border}`,
                borderRadius: 16,
                padding: '14px 6px 10px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                aspectRatio: '1',
                boxShadow: tone.glow,
                position: 'relative',
              }}>
                <div style={{ fontFamily: A.serif, fontSize: 32, fontWeight: 600, color: A.text, lineHeight: 1, letterSpacing: '-0.02em' }}>{t.id}</div>
                <div style={{ fontFamily: A.sans, fontSize: 10.5, color: tone.labelColor, fontWeight: 600, letterSpacing: '0.04em' }}>{tone.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 'auto', fontFamily: A.sans, fontSize: 10, color: A.muted }}>
                  <StatusDot status={t.status} size={6} />
                  {(t.items?.length || 0)} items
                </div>
              </ATap>
            );
          })}
          <ATap onClick={() => showToast('Tap to add a new table', 'blue')} style={{
            background: 'transparent',
            border: `1.5px dashed ${A.divider}`,
            borderRadius: 16,
            aspectRatio: '1',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: A.muted, gap: 6,
          }}>
            <div style={{ fontSize: 24, lineHeight: 1 }}>+</div>
            <div style={{ fontFamily: A.sans, fontSize: 10.5, letterSpacing: '0.04em' }}>Add Table</div>
          </ATap>
        </div>
      </div>
    </div>
  );
}

// ────────── SCREEN 2 — BILL ──────────
function BillScreen({ table, onBack, onAddItems }) {
  const A = _A();
  const { setTables, showToast } = useAdmin();
  const [warn, setWarn] = sUseState(null);

  const items = table.items || [];
  // turn the seed items (just name+qty) into full rows by looking up MENU
  const rows = sUseMemo(() => items.map(it => {
    const m = window.MENU.find(x => x.name === it.name);
    return { name: it.name, qty: it.qty, price: m?.price || 200, glyph: m?.glyph || '☕' };
  }), [items]);
  const total = rows.reduce((s, r) => s + r.qty * r.price, 0);

  const updateQty = (name, delta) => {
    setTables(prev => prev.map(t => {
      if (t.id !== table.id) return t;
      const its = (t.items || []).map(it => it.name === name ? { ...it, qty: it.qty + delta } : it).filter(it => it.qty > 0);
      return { ...t, items: its, status: its.length ? t.status : 'free' };
    }));
  };

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AdminHeader title={`Table ${table.id}`} sub={`${items.length} items · Open`} onBack={onBack} />

      <div className="scroll-y" style={{ flex: 1, padding: '16px 16px 220px' }}>
        {rows.map((r, i) => (
          <div key={r.name} className="fade-up" style={{
            animationDelay: `${i * 0.04}s`,
            background: A.card, borderRadius: 14, marginBottom: 10,
            padding: 12,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <img src={window.IMG[r.name]} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `2px solid ${A.cardHi}` }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 15.5, color: A.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</div>
              <div style={{ fontFamily: A.sans, fontSize: 12, color: A.muted, marginTop: 2 }}>₹{r.price} each</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6,
              background: 'transparent', border: `1px solid ${A.pink}`, borderRadius: 10, padding: 2,
            }}>
              <ATap onClick={() => updateQty(r.name, -1)} style={{ width: 28, height: 32, color: A.pink, fontSize: 18, fontWeight: 500 }}>−</ATap>
              <span style={{ minWidth: 18, textAlign: 'center', fontFamily: A.sans, fontWeight: 600, fontSize: 14, color: A.text }}>{r.qty}</span>
              <ATap onClick={() => r.name === 'Avocado Sourdough' ? setWarn(r.name) : updateQty(r.name, 1)} style={{ width: 28, height: 32, color: A.pink, fontSize: 18, fontWeight: 500 }}>+</ATap>
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

      {/* total + actions */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: A.surface, borderTop: `1px solid ${A.divider}`,
        padding: '18px 16px 22px',
        zIndex: 10,
      }}>
        <div style={{ background: A.card, borderRadius: 14, padding: '14px 16px', marginBottom: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontFamily: A.sans, fontSize: 12, color: A.muted, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Total Amount</div>
          <div key={total} style={{
            fontFamily: A.serif, fontWeight: 700, fontSize: 30, color: A.gold,
            animation: 'aPop 0.35s var(--spring) both', letterSpacing: '-0.01em',
          }}>₹{total}</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <ATap onClick={() => { showToast('✓ Bill saved', 'green'); }} style={{
            flex: 1, height: 56, borderRadius: 14, background: A.card, color: A.text,
            fontFamily: A.sans, fontWeight: 600, fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>💾 Save Only</ATap>
          <ATap onClick={() => { showToast('🖨 Printing…', 'pink'); setTimeout(() => showToast('✓ Bill saved · Printed', 'green'), 1200); }} style={{
            flex: 1, height: 56, borderRadius: 14,
            background: `linear-gradient(135deg, ${A.pink}, ${A.pinkDeep})`, color: '#fff',
            fontFamily: A.sans, fontWeight: 700, fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: `0 8px 20px ${A.pink}55`,
          }}>🖨 Save + Print</ATap>
        </div>
      </div>

      {warn && (
        <>
          <div onClick={() => setWarn(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50, backdropFilter: 'blur(4px)' }} />
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 51,
            background: A.surface, borderRadius: '20px 20px 0 0',
            padding: '16px 20px 28px',
            animation: 'aSheet .25s var(--spring) both',
            borderTop: `1px solid ${A.yellow}55`,
          }}>
            <div style={{ width: 36, height: 4, background: A.divider, borderRadius: 2, margin: '0 auto 14px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(240,180,41,0.18)', color: A.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚠</span>
              <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 18, color: A.text }}>Item may be out of stock</div>
            </div>
            <div style={{ fontFamily: A.sans, fontSize: 13, color: A.textDim, padding: '0 4px 14px' }}>
              <strong style={{ color: A.text }}>{warn}</strong> — kitchen flagged low stock 8 minutes ago. Continue anyway?
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <ATap onClick={() => setWarn(null)} style={{ flex: 1, height: 52, borderRadius: 12, background: A.card, color: A.text, fontFamily: A.sans, fontWeight: 600, fontSize: 13.5 }}>Fix Bill</ATap>
              <ATap onClick={() => { updateQty(warn, 1); setWarn(null); }} style={{ flex: 1, height: 52, borderRadius: 12, background: A.yellow, color: '#1a1108', fontFamily: A.sans, fontWeight: 700, fontSize: 13.5 }}>Ignore &amp; Continue</ATap>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ────────── SCREEN 3 — ADD ITEMS TO BILL ──────────
function AddItemsScreen({ table, onBack }) {
  const A = _A();
  const { setTables, showToast, menuItems } = useAdmin();
  const [q, setQ] = sUseState('');
  const [cat, setCat] = sUseState('All');
  const [added, setAdded] = sUseState({}); // { name: count }

  const cats = ['All', 'Coffee', 'Food', 'Cold', 'Snacks'];
  const filtered = menuItems.filter(m =>
    (cat === 'All' || m.cat === cat) &&
    (!q || m.name.toLowerCase().includes(q.toLowerCase())) &&
    m.visible
  );

  const totalAdded = Object.values(added).reduce((a, b) => a + b, 0);

  const tap = (m) => {
    setAdded(prev => ({ ...prev, [m.name]: (prev[m.name] || 0) + 1 }));
  };

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
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AdminHeader title="Add Items" sub={`Table ${table.id}`} onBack={onBack} />

      <div style={{ padding: '12px 16px 8px' }}>
        <div style={{ position: 'relative' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: A.muted }}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
          <input
            autoFocus
            placeholder="Search menu…"
            value={q}
            onChange={e => setQ(e.target.value)}
            style={{
              width: '100%', height: 48, borderRadius: 14,
              background: A.card, border: `1px solid ${A.divider}`,
              padding: '0 16px 0 40px', color: A.text,
              fontFamily: A.sans, fontSize: 14, outline: 'none',
            }}
          />
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
            transition: 'all .2s ease',
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
                transition: 'all .18s ease',
              }}>
                <div style={{
                  height: 86, position: 'relative',
                  background: `url(${window.IMG[m.name]}) center/cover, linear-gradient(135deg, ${A.pink}55, ${A.green}55)`,
                }}>
                  {count > 0 && (
                    <div key={count} style={{
                      position: 'absolute', top: 8, right: 8,
                      minWidth: 24, height: 24, padding: '0 7px', borderRadius: 999,
                      background: A.pink, color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: A.sans, fontWeight: 700, fontSize: 12,
                      animation: 'aPop .3s var(--spring) both',
                      boxShadow: `0 4px 12px ${A.pink}88`,
                    }}>{count}</div>
                  )}
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 13.5, color: A.text, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
                  <div style={{ fontFamily: A.sans, fontSize: 13, color: A.pink, fontWeight: 600, marginTop: 4 }}>₹{m.price}</div>
                </div>
              </ATap>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: A.muted, fontFamily: A.sans, fontSize: 13 }}>No items match.</div>
        )}
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '12px 16px 24px', background: A.surface, borderTop: `1px solid ${A.divider}`, zIndex: 10 }}>
        <ATap onClick={commit} disabled={totalAdded === 0} style={{
          width: '100%', height: 56, borderRadius: 14,
          background: totalAdded > 0 ? `linear-gradient(135deg, ${A.pink}, ${A.pinkDeep})` : A.card,
          color: totalAdded > 0 ? '#fff' : A.muted,
          fontFamily: A.sans, fontWeight: 700, fontSize: 15,
          boxShadow: totalAdded > 0 ? `0 8px 20px ${A.pink}55` : 'none',
        }}>
          {totalAdded > 0 ? <span key={totalAdded} style={{ animation: 'aPop .3s var(--spring)' }}>Done · {totalAdded} {totalAdded === 1 ? 'item' : 'items'} added</span> : 'Tap items to add'}
        </ATap>
      </div>
    </div>
  );
}

// ────────── SCREEN 4 — ORDER HISTORY ──────────
function OrdersScreen({ onHamburger }) {
  const A = _A();
  const { orders, showToast } = useAdmin();
  const [filter, setFilter] = sUseState('Today');

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AdminHeader title="Orders" onHamburger={onHamburger}
        right={
          <ATap style={{ width: 40, height: 40, borderRadius: 12, background: A.card, color: A.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M6 12h12M10 18h4" /></svg>
          </ATap>
        }
      />

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
                <ATap onClick={() => showToast('🖨 Reprinting…', 'pink')} style={{
                  padding: '6px 12px', borderRadius: 999, border: `1px solid ${A.divider}`,
                  fontFamily: A.sans, fontWeight: 500, fontSize: 11.5, color: A.textDim,
                }}>🖨 Reprint</ATap>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ────────── SCREEN 5 — MENU MANAGEMENT ──────────
function MenuMgmtScreen({ onHamburger, onAddEdit }) {
  const A = _A();
  const { menuItems, setMenuItems, showToast } = useAdmin();
  const [q, setQ] = sUseState('');
  const [cat, setCat] = sUseState('All');
  const [confirmDel, setConfirmDel] = sUseState(null);

  const filtered = menuItems.filter(m =>
    (cat === 'All' || m.cat === cat) &&
    (!q || m.name.toLowerCase().includes(q.toLowerCase()))
  );
  const grouped = sUseMemo(() => {
    const g = {};
    for (const m of filtered) (g[m.cat] = g[m.cat] || []).push(m);
    return g;
  }, [filtered]);

  const toggleVisible = (id) => {
    setMenuItems(prev => prev.map(m => m.id === id ? { ...m, visible: !m.visible } : m));
  };
  const doDelete = (id) => {
    setMenuItems(prev => prev.filter(m => m.id !== id));
    setConfirmDel(null);
    showToast('Item deleted', 'red');
  };

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AdminHeader title="Menu" onHamburger={onHamburger}
        right={
          <ATap onClick={() => onAddEdit(null)} style={{
            width: 40, height: 40, borderRadius: 12,
            background: `linear-gradient(135deg, ${A.pink}, ${A.pinkDeep})`,
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 12px ${A.pink}55`,
            fontSize: 22, fontWeight: 500,
          }}>+</ATap>
        }
      />

      <div style={{ padding: '12px 16px 8px' }}>
        <input
          placeholder="Search menu…"
          value={q}
          onChange={e => setQ(e.target.value)}
          style={{
            width: '100%', height: 44, borderRadius: 12,
            background: A.card, border: `1px solid ${A.divider}`,
            padding: '0 14px', color: A.text,
            fontFamily: A.sans, fontSize: 14, outline: 'none',
          }}
        />
      </div>

      <div className="no-scrollbar" style={{ padding: '4px 16px 8px', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {['All', 'Coffee', 'Food', 'Cold', 'Snacks'].map(c => (
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
        {Object.entries(grouped).map(([gname, items]) => (
          <div key={gname} style={{ marginBottom: 18 }}>
            <div style={{
              fontFamily: A.sans, fontSize: 10.5, fontWeight: 600,
              color: A.muted, letterSpacing: '0.16em', textTransform: 'uppercase',
              padding: '6px 4px 10px',
            }}>{gname}</div>
            {items.map((m, i) => (
              <div key={m.id} className="fade-up" style={{
                animationDelay: `${i * 0.03}s`,
                background: A.card, borderRadius: 14, padding: 12, marginBottom: 8,
                display: 'flex', alignItems: 'center', gap: 12,
                opacity: m.visible ? 1 : 0.55,
              }}>
                <img src={window.IMG[m.name]} alt="" style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 15, color: A.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <span style={{ fontFamily: A.sans, fontSize: 12.5, color: A.pink, fontWeight: 600 }}>₹{m.price}</span>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.visible ? A.greenSoft : A.red }} />
                    <span style={{ fontFamily: A.sans, fontSize: 11, color: A.muted }}>{m.visible ? 'Visible' : 'Hidden'}</span>
                  </div>
                </div>
                <ATap onClick={() => toggleVisible(m.id)} style={{
                  width: 34, height: 34, borderRadius: 10, background: A.cardHi,
                  color: m.visible ? A.greenSoft : A.red,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                }}>{m.visible ? '◉' : '◌'}</ATap>
                <ATap onClick={() => onAddEdit(m)} style={{
                  width: 34, height: 34, borderRadius: 10, background: A.cardHi, color: A.text,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4z" /></svg>
                </ATap>
                <ATap onClick={() => setConfirmDel(m)} style={{
                  width: 34, height: 34, borderRadius: 10, background: A.cardHi, color: A.red,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>🗑</ATap>
              </div>
            ))}
          </div>
        ))}
      </div>

      {confirmDel && (
        <>
          <div onClick={() => setConfirmDel(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50, backdropFilter: 'blur(4px)' }} />
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 51,
            background: A.surface, borderRadius: '20px 20px 0 0',
            padding: '16px 20px 28px',
            animation: 'aSheet .25s var(--spring) both',
          }}>
            <div style={{ width: 36, height: 4, background: A.divider, borderRadius: 2, margin: '0 auto 14px' }} />
            <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 20, color: A.text }}>Delete “{confirmDel.name}”?</div>
            <div style={{ fontFamily: A.sans, fontSize: 13, color: A.textDim, margin: '8px 0 18px' }}>This can't be undone. The item will be removed from the customer menu and bills.</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <ATap onClick={() => setConfirmDel(null)} style={{ flex: 1, height: 52, borderRadius: 12, background: A.card, color: A.text, fontFamily: A.sans, fontWeight: 600, fontSize: 13.5 }}>Cancel</ATap>
              <ATap onClick={() => doDelete(confirmDel.id)} style={{ flex: 1, height: 52, borderRadius: 12, background: A.red, color: '#fff', fontFamily: A.sans, fontWeight: 700, fontSize: 13.5 }}>Delete</ATap>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ────────── SCREEN 6 — ADD / EDIT MENU ITEM ──────────
function MenuItemEditScreen({ item, onBack }) {
  const A = _A();
  const { setMenuItems, showToast } = useAdmin();
  const editing = !!item;
  const [name, setName] = sUseState(item?.name || '');
  const [cat, setCat] = sUseState(item?.cat || 'Coffee');
  const [price, setPrice] = sUseState(item?.price ? String(item.price) : '');
  const [desc, setDesc] = sUseState(item?.desc || '');
  const [visible, setVisible] = sUseState(item ? item.visible !== false : true);
  const [tags, setTags] = sUseState(new Set(item?.tags || []));
  const [imgUrl] = sUseState(item ? window.IMG[item.name] : null);

  const toggleTag = (t) => {
    setTags(prev => {
      const s = new Set(prev);
      s.has(t) ? s.delete(t) : s.add(t);
      return s;
    });
  };

  const save = () => {
    if (!name.trim() || !price) { showToast('Name & price required', 'red'); return; }
    setMenuItems(prev => {
      if (editing) return prev.map(m => m.id === item.id ? { ...m, name, cat, price: +price, desc, visible, tags: [...tags] } : m);
      return [...prev, { id: Date.now(), name, cat, price: +price, desc, visible, glyph: '☕', tags: [...tags] }];
    });
    showToast(`✓ ${editing ? 'Saved' : 'Added'} ${name}`, 'green');
    onBack();
  };

  const cats = ['Coffee', 'Food', 'Cold', 'Snacks', 'For Two 💑'];
  const allTags = ['Couples Pick ✨', 'Perfect for Two 💑', "Chef's Special 👨‍🍳", 'New 🌟'];

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AdminHeader title={editing ? 'Edit Item' : 'Add Item'} onBack={onBack} />

      <div className="scroll-y" style={{ flex: 1, padding: '14px 16px 100px' }}>
        {/* image area */}
        <div style={{
          height: 160, borderRadius: 16,
          border: `2px dashed ${A.pink}`,
          background: imgUrl ? `url(${imgUrl}) center/cover` : 'rgba(232,130,154,0.05)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 8, color: A.pink, marginBottom: 10,
          position: 'relative', overflow: 'hidden',
        }}>
          {!imgUrl && (
            <>
              <div style={{ fontSize: 32 }}>📷</div>
              <div style={{ fontFamily: A.sans, fontSize: 13, fontWeight: 500 }}>Tap to add photo</div>
            </>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
          <ATap onClick={() => showToast('Camera coming soon', 'blue')} style={{ flex: 1, height: 44, borderRadius: 12, background: A.card, color: A.text, fontFamily: A.sans, fontWeight: 500, fontSize: 13 }}>📷 Camera</ATap>
          <ATap onClick={() => showToast('Gallery coming soon', 'blue')} style={{ flex: 1, height: 44, borderRadius: 12, background: A.card, color: A.text, fontFamily: A.sans, fontWeight: 500, fontSize: 13 }}>🖼 Gallery</ATap>
        </div>

        {/* form fields */}
        <div style={{ background: A.card, borderRadius: 14, padding: 14, marginBottom: 14 }}>
          <Field label="Item Name *">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rose Cardamom Latte" style={inp(A)} />
          </Field>
          <Field label="Category *">
            <select value={cat} onChange={e => setCat(e.target.value)} style={{ ...inp(A), appearance: 'none' }}>
              {cats.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Price (₹) *">
            <input value={price} onChange={e => setPrice(e.target.value.replace(/[^\d]/g, ''))} placeholder="220" inputMode="numeric" style={inp(A)} />
          </Field>
          <Field label="Description" last>
            <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="A short note about the drink" style={inp(A)} />
          </Field>
        </div>

        {/* tags */}
        <div style={{ background: A.card, borderRadius: 14, padding: 14, marginBottom: 14 }}>
          <div style={{ fontFamily: A.sans, fontSize: 11.5, fontWeight: 600, color: A.muted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Tags</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {allTags.map(t => {
              const on = tags.has(t);
              return (
                <ATap key={t} onClick={() => toggleTag(t)} style={{
                  padding: '8px 12px', borderRadius: 999,
                  background: on ? A.pink : 'transparent',
                  border: `1px solid ${on ? A.pink : A.divider}`,
                  color: on ? '#fff' : A.textDim,
                  fontFamily: A.sans, fontSize: 12, fontWeight: 600,
                }}>{t}</ATap>
              );
            })}
          </div>
        </div>

        {/* visibility */}
        <div style={{ background: A.card, borderRadius: 14, padding: 14, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: A.sans, fontSize: 14, fontWeight: 600, color: A.text }}>Visible to customers</div>
            <div style={{ fontFamily: A.sans, fontSize: 12, color: A.muted, marginTop: 2 }}>Show this on the customer menu</div>
          </div>
          <ATap onClick={() => setVisible(v => !v)} style={{
            width: 52, height: 30, borderRadius: 999,
            background: visible ? A.greenSoft : A.red,
            position: 'relative', transition: 'background .2s ease',
          }}>
            <div style={{
              position: 'absolute', top: 3, left: visible ? 25 : 3,
              width: 24, height: 24, borderRadius: '50%',
              background: '#fff', transition: 'left .2s var(--spring)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            }} />
          </ATap>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '12px 16px 22px', background: A.surface, borderTop: `1px solid ${A.divider}`, zIndex: 10 }}>
        <ATap onClick={save} style={{
          width: '100%', height: 56, borderRadius: 14,
          background: `linear-gradient(135deg, ${A.pink}, ${A.pinkDeep})`, color: '#fff',
          fontFamily: A.sans, fontWeight: 700, fontSize: 15,
          boxShadow: `0 8px 20px ${A.pink}55`,
        }}>Save Item ♥</ATap>
      </div>
    </div>
  );
}

function Field({ label, children, last }) {
  const A = _A();
  return (
    <div style={{ paddingBottom: last ? 0 : 14, marginBottom: last ? 0 : 14, borderBottom: last ? 'none' : `1px solid ${A.divider}` }}>
      <div style={{ fontFamily: A.sans, fontSize: 11, fontWeight: 600, color: A.muted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  );
}
function inp(A) {
  return {
    width: '100%', height: 42, borderRadius: 10,
    background: A.cardHi, border: `1px solid ${A.divider}`,
    padding: '0 12px', color: A.text,
    fontFamily: A.sans, fontSize: 14, outline: 'none',
  };
}

window.TableGridScreen = TableGridScreen;
window.BillScreen = BillScreen;
window.AddItemsScreen = AddItemsScreen;
window.OrdersScreen = OrdersScreen;
window.MenuMgmtScreen = MenuMgmtScreen;
window.MenuItemEditScreen = MenuItemEditScreen;
