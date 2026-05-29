import { useMemo } from 'react';
import QRCode from 'qrcode';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { useAdmin, A } from '../AdminContext';
import { AdminHeader, ATap } from '../components/Shell';

async function downloadQR(tableId, tableName) {
  const url = `https://customer-sable-seven.vercel.app?table=${tableId}`;
  const canvas = document.createElement('canvas');
  await QRCode.toCanvas(canvas, url, {
    width: 400,
    margin: 2,
    color: { dark: '#0f1117', light: '#ffffff' },
  });

  const base64 = canvas.toDataURL('image/png').split(',')[1];
  const fileName = `QR-${tableName.replace(/\s+/g, '-')}.png`;

  try {
    // Try Capacitor Filesystem (Android app)
    await Filesystem.writeFile({
      path: fileName,
      data: base64,
      directory: Directory.Documents,
    });
  } catch {
    // Fallback for browser/desktop
    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
}

function QRSquare({ seed, size = 90 }) {
  const cells = useMemo(() => {
    const n = 11;
    const arr = [];
    let x = seed * 9301 + 49297;
    const rand = () => { x = (x * 9301 + 49297) % 233280; return x / 233280; };
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const isFinder = (r < 3 && c < 3) || (r < 3 && c > n - 4) || (r > n - 4 && c < 3);
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
    <div style={{ width: size, height: size, background: '#fff', padding: 6, borderRadius: 8, flexShrink: 0, display: 'grid', gridTemplateColumns: `repeat(${n}, 1fr)`, gap: 1 }}>
      {cells.map((c, i) => <div key={i} style={{ background: c ? '#0f1117' : '#fff', borderRadius: 1 }} />)}
    </div>
  );
}

export default function QRScreen({ onBack }) {
  const { tables, showToast } = useAdmin();
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AdminHeader title="QR Codes" onBack={onBack} />
      <div className="scroll-y" style={{ flex: 1, padding: '16px 16px 100px' }}>
        <div style={{ fontFamily: A.sans, fontSize: 12.5, color: A.muted, padding: '0 4px 14px' }}>
          Customers scan to open the table's ordering page.
        </div>
        {tables.map((t, i) => (
          <div key={t.id} className="fade-up" style={{ animationDelay: `${i * 0.04}s`, background: A.card, borderRadius: 16, padding: 14, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14 }}>
            <QRSquare seed={t.id * 7} size={86} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 17, color: A.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</div>
              <div style={{ fontFamily: A.sans, fontSize: 11.5, color: A.muted, marginTop: 4 }}>customer-sable-seven.vercel.app?table={t.id}</div>
              <ATap onClick={() => { downloadQR(t.id, t.name); showToast(`Downloaded QR · ${t.name}`, 'blue'); }} style={{ marginTop: 8, padding: '7px 14px', borderRadius: 999, border: `1px solid ${A.divider}`, color: A.textDim, fontFamily: A.sans, fontWeight: 500, fontSize: 12, display: 'inline-flex' }}>↓ Download</ATap>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '12px 16px 22px', background: A.surface, borderTop: `1px solid ${A.divider}`, zIndex: 10 }}>
        <ATap onClick={async () => { for (const t of tables) { await downloadQR(t.id, t.name); } showToast('Downloaded all QR codes!', 'pink'); }} style={{ width: '100%', height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${A.pink}, ${A.pinkDeep})`, color: '#fff', fontFamily: A.sans, fontWeight: 700, fontSize: 15, boxShadow: `0 8px 20px ${A.pink}55` }}>↓ Download All QR Codes</ATap>
      </div>
    </div>
  );
}
