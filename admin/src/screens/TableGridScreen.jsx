import { useAdmin, A } from '../AdminContext';
import { AdminHeader, ATap, StatusDot } from '../components/Shell';

export default function TableGridScreen({ onOpenBill, onHamburger, notification }) {
  const { tables, showToast } = useAdmin();

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <AdminHeader title="Brew & Co." onHamburger={onHamburger}
        right={
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: A.greenSoft, boxShadow: `0 0 8px ${A.greenSoft}` }} />
        }
      />

      <div className="scroll-y" style={{ flex: 1, padding: '16px 16px 96px' }}>
        <div style={{ padding: '0 4px 16px' }}>
          <div style={{ fontFamily: A.serif, fontSize: 22, color: A.text, fontStyle: 'italic', fontWeight: 600, letterSpacing: '-0.01em' }}>
            Good afternoon ☕
          </div>
          <div style={{ fontFamily: A.sans, fontSize: 13, color: A.muted, marginTop: 4 }}>
            {tables.filter(t => t.status === 'free').length} free · {tables.filter(t => t.status === 'progress').length} active · {tables.filter(t => t.status === 'bill').length} bill ready
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14, padding: '0 4px 16px', fontFamily: A.sans, fontSize: 11.5, color: A.textDim, letterSpacing: '0.04em' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><StatusDot status="free" /> Free</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><StatusDot status="progress" /> Active</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><StatusDot status="bill" /> Bill Ready</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {tables.map((t, i) => {
            const isPulse = notification && notification.tableId === t.id;
            const tone = t.status === 'free'
              ? { bg: A.card, labelColor: A.greenSoft, label: 'Free', border: A.divider, glow: 'none' }
              : t.status === 'progress'
              ? { bg: '#2a1a1d', labelColor: A.yellow, label: 'Order', border: 'rgba(232,130,154,0.25)', glow: `0 0 18px ${A.pink}22` }
              : { bg: '#2a1f15', labelColor: A.orange, label: 'Bill Ready', border: 'rgba(240,147,58,0.4)', glow: `0 0 22px ${A.orange}44` };
            return (
              <ATap key={t.id} onClick={() => onOpenBill(t)}
                className={'fade-up ' + (isPulse ? 'pulsePink' : '')}
                style={{
                  animationDelay: `${i * 0.04}s`,
                  background: tone.bg,
                  border: `1px solid ${isPulse ? A.pink : tone.border}`,
                  borderRadius: 16,
                  padding: '14px 6px 10px',
                  flexDirection: 'column', alignItems: 'center', gap: 6,
                  aspectRatio: '1',
                  boxShadow: tone.glow,
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
          <ATap onClick={() => showToast('Table management coming soon', 'blue')} style={{
            background: 'transparent',
            border: `1.5px dashed ${A.divider}`,
            borderRadius: 16,
            aspectRatio: '1',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
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
