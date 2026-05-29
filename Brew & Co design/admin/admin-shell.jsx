/* ───────── Brew & Co. — admin-shell.jsx ─────────
   Dark POS panel for one café worker on a tablet/phone.
   Bottom nav, hamburger drawer, toasts, shared design tokens.
*/

const { useState: aUseState, useEffect: aUseEffect, useMemo: aUseMemo, useRef: aUseRef, useCallback: aUseCallback, createContext: aCreateContext, useContext: aUseContext } = React;

// ────────── design tokens ──────────
const A = {
  bg: '#0f1117',
  surface: '#1a1d27',
  card: '#242836',
  cardHi: '#2c3142',
  pink: '#e8829a',
  pinkDeep: '#c96080',
  pinkSoft: 'rgba(232,130,154,0.12)',
  green: '#52876a',
  greenSoft: '#4caf7d',
  text: '#e8e4dc',
  textDim: '#a8a4a0',
  muted: '#6b7280',
  yellow: '#f0b429',
  orange: '#f0933a',
  red: '#e05c5c',
  blue: '#4a9eff',
  gold: '#c9a84c',
  divider: 'rgba(232,228,220,0.08)',
  serif: "'Playfair Display', Georgia, serif",
  sans: "'DM Sans', system-ui, sans-serif",
};

// ────────── shared admin state ──────────
const AdminContext = aCreateContext(null);

const TABLES_SEED = [
  { id: 1, name: 'Garden Table 1', status: 'free' },
  { id: 2, name: 'Petal Table 2', status: 'progress', items: [{ name: 'Saffron Latte', qty: 2 }, { name: 'Almond Croissant', qty: 1 }] },
  { id: 3, name: 'Blossom Table 3', status: 'bill', items: [{ name: 'Cappuccino', qty: 1 }, { name: 'Avocado Sourdough', qty: 1 }] },
  { id: 4, name: 'Mossy Table 4', status: 'free' },
  { id: 5, name: 'Velvet Table 5', status: 'progress', items: [{ name: 'Cold Brew Tonic', qty: 2 }] },
  { id: 6, name: 'Cherry Table 6', status: 'free' },
  { id: 7, name: 'Linen Table 7', status: 'free' },
  { id: 8, name: 'Marble Table 8', status: 'bill', items: [{ name: 'Eggs Benedict', qty: 2 }, { name: 'Flat White', qty: 2 }] },
  { id: 9, name: 'Copper Table 9', status: 'free' },
];

const EXPENSES_SEED = [
  { id: 1, amount: 280, note: 'Whole milk · 4L', date: '2026-05-12', time: '08:14' },
  { id: 2, amount: 460, note: 'Coffee beans · single origin', date: '2026-05-12', time: '09:02' },
  { id: 3, amount: 110, note: 'Bakery delivery tip', date: '2026-05-12', time: '07:30' },
  { id: 4, amount: 850, note: 'Fresh produce — avocado, sourdough', date: '2026-05-11', time: '08:00' },
  { id: 5, amount: 220, note: 'Cleaning supplies', date: '2026-05-11', time: '21:10' },
];

const CUSTOMERS_SEED = [
  { id: 1, name: 'Anaya Sharma', phone: '+91 98765 12340', points: 240, visits: 18, spent: 8420 },
  { id: 2, name: 'Rohan Mehta', phone: '+91 98213 09814', points: 95, visits: 6, spent: 3210 },
  { id: 3, name: 'Priya & Karthik', phone: '+91 99102 44550', points: 420, visits: 31, spent: 14860 },
  { id: 4, name: 'Sana Iqbal', phone: '+91 98991 67721', points: 60, visits: 3, spent: 1490 },
  { id: 5, name: 'Vihaan Rao', phone: '+91 90048 28012', points: 180, visits: 12, spent: 6210 },
];

const ORDERS_SEED = [
  { id: 'BC-241', table: 3, total: 450, time: '14:22', status: 'confirmed', items: 'Cappuccino, Avocado Sourdough' },
  { id: 'BC-240', table: 5, total: 520, time: '14:08', status: 'confirmed', items: 'Cold Brew Tonic x2, Pistachio Cookie' },
  { id: 'BC-239', table: 2, total: 660, time: '13:54', status: 'confirmed', items: 'Saffron Latte x2, Almond Croissant' },
  { id: 'BC-238', table: 8, total: 1240, time: '13:30', status: 'pending', items: 'Eggs Benedict x2, Flat White x2' },
  { id: 'BC-237', table: 1, total: 320, time: '12:58', status: 'confirmed', items: 'Flat White, Banana Bread' },
  { id: 'BC-236', table: 6, total: 880, time: '12:35', status: 'confirmed', items: 'Mushroom Toast, Saffron Latte, Affogato' },
  { id: 'BC-235', table: 4, total: 410, time: '11:48', status: 'confirmed', items: 'Cortado, Dark Chocolate Tart' },
];

function AdminProvider({ children }) {
  const [tables, setTables] = aUseState(TABLES_SEED);
  const [expenses, setExpenses] = aUseState(EXPENSES_SEED);
  const [customers, setCustomers] = aUseState(CUSTOMERS_SEED);
  const [orders, setOrders] = aUseState(ORDERS_SEED);
  const [menuItems, setMenuItems] = aUseState(() =>
    window.MENU.map((m, i) => ({ ...m, id: i + 1, visible: true }))
  );
  const [toast, setToast] = aUseState(null);
  const [notification, setNotification] = aUseState(null);
  const toastTimer = aUseRef(null);

  const showToast = aUseCallback((msg, tone = 'green', ms = 2000) => {
    setToast({ msg, tone, key: Date.now() });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), ms);
  }, []);

  // Simulate an incoming QR order ~6s after mount
  aUseEffect(() => {
    const t = setTimeout(() => {
      setNotification({
        table: 'Blossom Table 3',
        tableId: 3,
        items: 'Cappuccino x1, Sandwich x1',
        key: Date.now(),
      });
      setTimeout(() => setNotification(null), 10000);
    }, 6000);
    return () => clearTimeout(t);
  }, []);

  const value = {
    tables, setTables,
    expenses, setExpenses,
    customers, setCustomers,
    orders, setOrders,
    menuItems, setMenuItems,
    toast, showToast,
    notification, setNotification,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

// ────────── primitives ──────────
function ATap({ children, style, onClick, className = '' }) {
  return (
    <button onClick={onClick} className={'a-tap ' + className} style={style}>{children}</button>
  );
}

function StatusDot({ status, size = 8 }) {
  const color = status === 'free' ? A.greenSoft : status === 'progress' ? A.yellow : A.orange;
  return <span style={{ display: 'inline-block', width: size, height: size, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}88` }} />;
}

function Toast({ toast }) {
  if (!toast) return null;
  const map = { green: { bg: A.greenSoft, fg: '#0a1410' }, pink: { bg: A.pink, fg: '#1a0a10' }, orange: { bg: A.orange, fg: '#1a1108' }, blue: { bg: A.blue, fg: '#08101a' }, red: { bg: A.red, fg: '#1a0808' } };
  const tone = map[toast.tone] || map.green;
  return (
    <div key={toast.key} style={{
      position: 'absolute', left: '50%', bottom: 96,
      transform: 'translateX(-50%)',
      background: tone.bg, color: tone.fg,
      fontFamily: A.sans, fontWeight: 600, fontSize: 13.5,
      padding: '10px 18px', borderRadius: 999,
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      zIndex: 100,
      animation: 'aToast 0.3s var(--spring) both',
      whiteSpace: 'nowrap'
    }}>{toast.msg}</div>
  );
}

// ────────── top header ──────────
function AdminHeader({ title, onBack, onHamburger, right, sub }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 20,
      background: A.bg, paddingTop: 50,
      borderBottom: `1px solid ${A.divider}`,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px 12px', gap: 10,
      }}>
        <div style={{ width: 44, display: 'flex', alignItems: 'center' }}>
          {onBack ? (
            <ATap onClick={onBack} style={{
              width: 40, height: 40, borderRadius: 12,
              background: A.card, color: A.text,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </ATap>
          ) : onHamburger ? (
            <ATap onClick={onHamburger} style={{
              width: 40, height: 40, borderRadius: 12,
              background: A.card, color: A.text,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 7h18M3 12h18M3 17h18" /></svg>
            </ATap>
          ) : null}
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 20, color: A.text, letterSpacing: '-0.01em' }}>{title}</div>
          {sub && <div style={{ fontFamily: A.sans, fontSize: 11.5, color: A.muted, marginTop: 2 }}>{sub}</div>}
        </div>
        <div style={{ width: 44, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
          {right}
        </div>
      </div>
    </div>
  );
}

// ────────── bottom nav ──────────
const NAV_TABS = [
  { key: 'tables', label: 'Tables', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 12h18" /></svg>
  ) },
  { key: 'orders', label: 'Orders', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></svg>
  ) },
  { key: 'menu', label: 'Menu', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4h16v4H4zM4 12h16v4H4zM4 18h10" /></svg>
  ) },
  { key: 'reports', label: 'Reports', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>
  ) },
];

function BottomNav({ active, onChange }) {
  const idx = NAV_TABS.findIndex(t => t.key === active);
  const visible = idx >= 0;
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      background: A.surface,
      borderTop: `1px solid ${A.divider}`,
      paddingBottom: 22,
      zIndex: 30,
    }}>
      <div style={{ position: 'relative', display: 'flex' }}>
        {/* sliding indicator */}
        {visible && (
          <div style={{
            position: 'absolute', top: 6,
            left: `${idx * 25}%`, width: '25%',
            display: 'flex', justifyContent: 'center',
            transition: 'left .25s var(--spring)',
            pointerEvents: 'none',
          }}>
            <div style={{ width: 32, height: 3, borderRadius: 2, background: A.pink, boxShadow: `0 0 12px ${A.pink}` }} />
          </div>
        )}
        {NAV_TABS.map(tab => (
          <ATap key={tab.key} onClick={() => onChange(tab.key)} style={{
            flex: 1, padding: '14px 0 8px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: active === tab.key ? A.pink : A.muted,
            fontFamily: A.sans, fontSize: 11, fontWeight: 500,
            transition: 'color .2s ease',
          }}>
            {tab.icon}
            <span>{tab.label}</span>
          </ATap>
        ))}
      </div>
    </div>
  );
}

// ────────── hamburger drawer ──────────
function Drawer({ open, onClose, onNavigate }) {
  if (!open) return null;
  const items = [
    { key: 'expenses', label: 'Daily Expenses', icon: '💸' },
    { key: 'qr', label: 'QR Codes', icon: '◳' },
    { key: 'customers', label: 'Customers', icon: '👤' },
    { key: 'categories', label: 'Categories', icon: '◷' },
    { key: 'settings', label: 'Settings', icon: '⚙' },
  ];
  return (
    <>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
        zIndex: 80, animation: 'fadeIn .2s ease both',
      }} />
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 280,
        background: A.surface, zIndex: 81,
        animation: 'drawerSlide .28s var(--ease-out) both',
        padding: '60px 0 20px',
        borderRight: `1px solid ${A.divider}`,
      }}>
        <div style={{ padding: '0 20px 24px', borderBottom: `1px solid ${A.divider}` }}>
          <div style={{ fontFamily: A.serif, fontSize: 24, color: A.text, fontStyle: 'italic', fontWeight: 600 }}>Brew &amp; Co.</div>
          <div style={{ fontFamily: A.sans, fontSize: 11.5, color: A.muted, letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: 4 }}>POS · counter</div>
        </div>
        <div style={{ padding: 14 }}>
          {items.map(it => (
            <ATap key={it.key} onClick={() => { onNavigate(it.key); onClose(); }} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 12px', borderRadius: 12,
              fontFamily: A.sans, fontSize: 15, fontWeight: 500,
              color: A.text, width: '100%', textAlign: 'left',
            }}>
              <span style={{
                width: 32, height: 32, borderRadius: 8,
                background: A.card, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, color: A.pink,
              }}>{it.icon}</span>
              {it.label}
            </ATap>
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, fontFamily: A.sans, fontSize: 11, color: A.muted, letterSpacing: '0.08em' }}>
          v2.4 · synced ✓
        </div>
      </div>
    </>
  );
}

// ────────── notification banner ──────────
function NotificationBanner({ notification, onView, onDismiss }) {
  if (!notification) return null;
  return (
    <div key={notification.key} style={{
      position: 'absolute', top: 50, left: 12, right: 12, zIndex: 70,
      background: A.surface,
      border: `1.5px solid ${A.pink}`,
      borderRadius: 16,
      padding: '12px 14px',
      display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: `0 12px 28px rgba(0,0,0,0.4), 0 0 32px ${A.pink}33`,
      animation: 'notifSlide .35s var(--spring) both',
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: '50%',
        background: A.pinkSoft, color: A.pink,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 004 0" /></svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: A.sans, fontWeight: 600, fontSize: 13.5, color: A.text }}>
          New Order · {notification.table}
        </div>
        <div style={{ fontFamily: A.sans, fontSize: 12, color: A.textDim, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
          {notification.items}
        </div>
      </div>
      <ATap onClick={onView} style={{
        background: `linear-gradient(135deg, ${A.pink}, ${A.pinkDeep})`,
        color: '#fff', padding: '8px 14px', borderRadius: 999,
        fontFamily: A.sans, fontWeight: 600, fontSize: 12.5,
      }}>View</ATap>
    </div>
  );
}

window.A = A;
window.AdminContext = AdminContext;
window.AdminProvider = AdminProvider;
window.ATap = ATap;
window.StatusDot = StatusDot;
window.Toast = Toast;
window.AdminHeader = AdminHeader;
window.BottomNav = BottomNav;
window.Drawer = Drawer;
window.NotificationBanner = NotificationBanner;
