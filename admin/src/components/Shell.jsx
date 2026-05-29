import { A } from '../AdminContext';

/* ── ATap ── */
export function ATap({ children, style, onClick, className = '', disabled }) {
  return (
    <button onClick={disabled ? undefined : onClick}
      className={'a-tap ' + className}
      style={{ ...style, opacity: disabled ? 0.5 : 1 }}>
      {children}
    </button>
  );
}

/* ── StatusDot ── */
export function StatusDot({ status, size = 8 }) {
  const color = status === 'free' ? A.greenSoft : status === 'progress' ? A.yellow : A.orange;
  return (
    <span style={{ display: 'inline-block', width: size, height: size, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}88` }} />
  );
}

/* ── Toast ── */
export function Toast({ toast }) {
  if (!toast) return null;
  const map = {
    green: { bg: A.greenSoft, fg: '#0a1410' },
    pink: { bg: A.pink, fg: '#1a0a10' },
    orange: { bg: A.orange, fg: '#1a1108' },
    blue: { bg: A.blue, fg: '#08101a' },
    red: { bg: A.red, fg: '#1a0808' },
  };
  const tone = map[toast.tone] || map.green;
  return (
    <div key={toast.key} style={{
      position: 'absolute', left: '50%', bottom: 90,
      transform: 'translateX(-50%)',
      background: tone.bg, color: tone.fg,
      fontFamily: A.sans, fontWeight: 600, fontSize: 13.5,
      padding: '10px 18px', borderRadius: 999,
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      zIndex: 100,
      animation: 'aToast 0.3s var(--spring) both',
      whiteSpace: 'nowrap',
    }}>{toast.msg}</div>
  );
}

/* ── AdminHeader ── */
export function AdminHeader({ title, onBack, onHamburger, right, sub }) {
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

/* ── BottomNav ── */
const NAV_TABS = [
  { key: 'tables', label: 'Tables', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 12h18" /></svg> },
  { key: 'orders', label: 'Orders', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></svg> },
  { key: 'menu', label: 'Menu', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4h16v4H4zM4 12h16v4H4zM4 18h10" /></svg> },
  { key: 'reports', label: 'Reports', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg> },
];

export function BottomNav({ active, onChange }) {
  const idx = NAV_TABS.findIndex(t => t.key === active);
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      background: A.surface,
      borderTop: `1px solid ${A.divider}`,
      paddingBottom: 22,
      zIndex: 30,
    }}>
      <div style={{ position: 'relative', display: 'flex' }}>
        {idx >= 0 && (
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

/* ── Drawer ── */
export function Drawer({ open, onClose, onNavigate }) {
  if (!open) return null;
  const ICONS = {
    expenses: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    ),
    qr: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none"/>
        <rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none"/>
        <rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none"/>
        <line x1="14" y1="14" x2="17" y2="14"/><line x1="17" y1="14" x2="17" y2="17"/><line x1="17" y1="17" x2="21" y2="17"/><line x1="21" y1="14" x2="21" y2="21"/><line x1="14" y1="21" x2="21" y2="21"/>
      </svg>
    ),
    customers: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
    settings: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
  };
  const items = [
    { key: 'expenses', label: 'Daily Expenses' },
    { key: 'qr', label: 'QR Codes' },
    { key: 'customers', label: 'Customers' },
    { key: 'settings', label: 'Settings' },
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
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: `linear-gradient(135deg, ${A.pink}33, ${A.pinkDeep}22)`,
                border: `1px solid ${A.pink}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: A.pink,
              }}>{ICONS[it.key]}</span>
              <span style={{ lineHeight: 1 }}>{it.label}</span>
            </ATap>
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, fontFamily: A.sans, fontSize: 11, color: A.muted, letterSpacing: '0.08em' }}>
          v1.0 · Brew &amp; Co. POS
        </div>
      </div>
    </>
  );
}

/* ── NotificationBanner ── */
export function NotificationBanner({ notification, onView, onDismiss }) {
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
