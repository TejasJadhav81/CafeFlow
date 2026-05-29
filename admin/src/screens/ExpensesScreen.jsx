import { useState, useMemo } from 'react';
import { useAdmin, A } from '../AdminContext';
import { AdminHeader, ATap } from '../components/Shell';
import { saveExpense, deleteExpense } from '../firebase';

export default function ExpensesScreen({ onBack }) {
  const { expenses, showToast } = useAdmin();
  const [period, setPeriod] = useState('Today');
  const [adding, setAdding] = useState(false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [confirmDel, setConfirmDel] = useState(null);

  const grouped = useMemo(() => {
    const g = {};
    for (const e of expenses) (g[e.date] = g[e.date] || []).push(e);
    return g;
  }, [expenses]);

  const save = async () => {
    if (!amount) { showToast('Amount required', 'red'); return; }
    await saveExpense(amount, note);
    showToast(`✓ ₹${amount} expense saved`, 'green');
    setAmount(''); setNote(''); setAdding(false);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AdminHeader title="Daily Expenses" onBack={onBack}
        right={
          <ATap onClick={() => setAdding(true)} style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${A.pink}, ${A.pinkDeep})`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 12px ${A.pink}55`, fontSize: 22, fontWeight: 500 }}>+</ATap>
        }
      />

      <div style={{ padding: '12px 16px 8px', display: 'flex', gap: 6 }}>
        {['Today', 'This Week', 'This Month'].map(p => (
          <ATap key={p} onClick={() => setPeriod(p)} style={{ flex: 1, padding: '10px 0', borderRadius: 999, background: period === p ? A.pink : A.card, color: period === p ? '#fff' : A.textDim, fontFamily: A.sans, fontSize: 12.5, fontWeight: 600 }}>{p}</ATap>
        ))}
      </div>

      <div className="scroll-y" style={{ flex: 1, padding: '8px 16px 24px' }}>
        {Object.entries(grouped).map(([date, items]) => {
          const dayTotal = items.reduce((s, e) => s + e.amount, 0);
          const d = new Date(date);
          const human = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' });
          return (
            <div key={date} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 4px 12px' }}>
                <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 15, color: A.text }}>{human}</div>
                <div style={{ fontFamily: A.serif, fontWeight: 700, fontSize: 17, color: A.gold }}>Total ₹{dayTotal}</div>
              </div>
              {items.map((e, i) => (
                <div key={e.id} className="fade-up" style={{ animationDelay: `${i * 0.03}s`, background: A.card, borderRadius: 14, padding: 14, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
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

      {adding && (
        <>
          <div onClick={() => setAdding(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50, backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 51, background: A.surface, borderRadius: '20px 20px 0 0', padding: '16px 20px 28px', animation: 'aSheet .25s var(--spring) both' }}>
            <div style={{ width: 36, height: 4, background: A.divider, borderRadius: 2, margin: '0 auto 14px' }} />
            <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 22, color: A.text, marginBottom: 18 }}>Add Expense</div>
            <div style={{ background: A.card, borderRadius: 14, padding: 14, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: A.serif, fontSize: 28, color: A.pink }}>₹</span>
              <input autoFocus inputMode="numeric" value={amount} onChange={e => setAmount(e.target.value.replace(/[^\d]/g, ''))} placeholder="0"
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: A.serif, fontWeight: 700, fontSize: 32, color: A.text }} />
            </div>
            <div style={{ background: A.card, borderRadius: 14, padding: 12, marginBottom: 18 }}>
              <input value={note} onChange={e => setNote(e.target.value)} placeholder="Note · e.g. Milk delivery"
                style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontFamily: A.sans, fontSize: 14, color: A.text, padding: '6px 4px' }} />
            </div>
            <ATap onClick={save} style={{ width: '100%', height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${A.pink}, ${A.pinkDeep})`, color: '#fff', fontFamily: A.sans, fontWeight: 700, fontSize: 15, boxShadow: `0 8px 20px ${A.pink}55` }}>Save Expense ♥</ATap>
          </div>
        </>
      )}

      {confirmDel && (
        <>
          <div onClick={() => setConfirmDel(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 60, backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 61, background: A.surface, borderRadius: '20px 20px 0 0', padding: '16px 20px 28px', animation: 'aSheet .25s var(--spring) both' }}>
            <div style={{ width: 36, height: 4, background: A.divider, borderRadius: 2, margin: '0 auto 14px' }} />
            <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 18, color: A.text }}>Delete expense?</div>
            <div style={{ fontFamily: A.sans, fontSize: 13, color: A.textDim, margin: '8px 0 18px' }}>₹{confirmDel.amount} · {confirmDel.note}</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <ATap onClick={() => setConfirmDel(null)} style={{ flex: 1, height: 52, borderRadius: 12, background: A.card, color: A.text, fontFamily: A.sans, fontWeight: 600, fontSize: 13.5 }}>Cancel</ATap>
              <ATap onClick={async () => { await deleteExpense(confirmDel.id); setConfirmDel(null); showToast('Expense deleted', 'red'); }} style={{ flex: 1, height: 52, borderRadius: 12, background: A.red, color: '#fff', fontFamily: A.sans, fontWeight: 700, fontSize: 13.5 }}>Delete</ATap>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
