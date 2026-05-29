import { useState, useMemo } from 'react';
import { useAdmin, A, IMG } from '../AdminContext';
import { AdminHeader, ATap } from '../components/Shell';
import { saveMenuItem, toggleMenuItemVisibility, deleteMenuItem } from '../firebase';

function Field({ label, children, last }) {
  return (
    <div style={{ paddingBottom: last ? 0 : 14, marginBottom: last ? 0 : 14, borderBottom: last ? 'none' : `1px solid ${A.divider}` }}>
      <div style={{ fontFamily: A.sans, fontSize: 11, fontWeight: 600, color: A.muted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  );
}

function inpStyle() {
  return {
    width: '100%', height: 42, borderRadius: 10,
    background: A.cardHi, border: `1px solid ${A.divider}`,
    padding: '0 12px', color: A.text,
    fontFamily: A.sans, fontSize: 14, outline: 'none',
  };
}

function EditSheet({ item, onClose, onSave }) {
  const editing = !!item;
  const [name, setName] = useState(item?.name || '');
  const [cat, setCat] = useState(item?.cat || 'Coffee');
  const [price, setPrice] = useState(item?.price ? String(item.price) : '');
  const [desc, setDesc] = useState(item?.description || '');
  const [visible, setVisible] = useState(item ? item.visible !== false : true);
  const { showToast } = useAdmin();

  const cats = ['Coffee', 'Food', 'Cold', 'Snacks'];
  const imgUrl = item ? IMG[item.name] : null;

  const save = () => {
    if (!name.trim() || !price) { showToast('Name & price required', 'red'); return; }
    onSave({ name, cat, price: +price, description: desc, visible, glyph: item?.glyph || '☕' });
  };

  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50, backdropFilter: 'blur(4px)' }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 51,
        background: A.surface, borderRadius: '20px 20px 0 0',
        maxHeight: '90%', display: 'flex', flexDirection: 'column',
        animation: 'aSheet .25s var(--spring) both',
      }}>
        <div style={{ padding: '14px 20px 0' }}>
          <div style={{ width: 36, height: 4, background: A.divider, borderRadius: 2, margin: '0 auto 14px' }} />
          <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 20, color: A.text, marginBottom: 18 }}>
            {editing ? 'Edit Item' : 'Add Item'}
          </div>
        </div>
        <div className="scroll-y" style={{ flex: 1, padding: '0 20px 24px' }}>
          {/* image preview */}
          {imgUrl && <div style={{ height: 120, borderRadius: 12, background: `url(${imgUrl}) center/cover`, marginBottom: 14 }} />}
          <div style={{ background: A.card, borderRadius: 14, padding: 14, marginBottom: 14 }}>
            <Field label="Item Name *"><input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rose Latte" style={inpStyle()} /></Field>
            <Field label="Category *">
              <select value={cat} onChange={e => setCat(e.target.value)} style={{ ...inpStyle(), appearance: 'none' }}>
                {cats.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Price (₹) *"><input value={price} onChange={e => setPrice(e.target.value.replace(/[^\d]/g, ''))} placeholder="220" inputMode="numeric" style={inpStyle()} /></Field>
            <Field label="Description" last><input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Short note about the item" style={inpStyle()} /></Field>
          </div>
          <div style={{ background: A.card, borderRadius: 14, padding: 14, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: A.sans, fontSize: 14, fontWeight: 600, color: A.text }}>Visible to customers</div>
              <div style={{ fontFamily: A.sans, fontSize: 12, color: A.muted, marginTop: 2 }}>Show on customer menu</div>
            </div>
            <ATap onClick={() => setVisible(v => !v)} style={{ width: 52, height: 30, borderRadius: 999, background: visible ? A.greenSoft : A.red, position: 'relative', transition: 'background .2s ease' }}>
              <div style={{ position: 'absolute', top: 3, left: visible ? 25 : 3, width: 24, height: 24, borderRadius: '50%', background: '#fff', transition: 'left .2s var(--spring)', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }} />
            </ATap>
          </div>
          <ATap onClick={save} style={{
            width: '100%', height: 56, borderRadius: 14,
            background: `linear-gradient(135deg, ${A.pink}, ${A.pinkDeep})`, color: '#fff',
            fontFamily: A.sans, fontWeight: 700, fontSize: 15,
            boxShadow: `0 8px 20px ${A.pink}55`,
          }}>Save Item ♥</ATap>
        </div>
      </div>
    </>
  );
}

export default function MenuMgmtScreen({ onHamburger }) {
  const { menuItems, showToast } = useAdmin();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [editItem, setEditItem] = useState(undefined); // undefined = closed, null = new, obj = edit
  const [confirmDel, setConfirmDel] = useState(null);

  const filtered = menuItems.filter(m =>
    (cat === 'All' || m.cat === cat) &&
    (!q || m.name.toLowerCase().includes(q.toLowerCase()))
  );
  const grouped = useMemo(() => {
    const g = {};
    for (const m of filtered) (g[m.cat] = g[m.cat] || []).push(m);
    return g;
  }, [filtered]);

  const toggleVisible = async (item) => {
    await toggleMenuItemVisibility(item.firebaseId || item.id, !item.visible);
  };
  const doDelete = async (item) => {
    await deleteMenuItem(item.firebaseId || item.id);
    setConfirmDel(null);
    showToast('Item deleted', 'red');
  };

  const handleSave = async (data) => {
    const itemToSave = editItem && (editItem.firebaseId || editItem.id)
      ? { ...data, firebaseId: editItem.firebaseId || editItem.id }
      : data;
    await saveMenuItem(itemToSave);
    showToast(`✓ ${editItem ? 'Saved' : 'Added'} ${data.name}`, 'green');
    setEditItem(undefined);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AdminHeader title="Menu" onHamburger={onHamburger}
        right={
          <ATap onClick={() => setEditItem(null)} style={{
            width: 40, height: 40, borderRadius: 12,
            background: `linear-gradient(135deg, ${A.pink}, ${A.pinkDeep})`,
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 12px ${A.pink}55`, fontSize: 22, fontWeight: 500,
          }}>+</ATap>
        }
      />

      <div style={{ padding: '12px 16px 8px' }}>
        <input placeholder="Search menu…" value={q} onChange={e => setQ(e.target.value)} style={{
          width: '100%', height: 44, borderRadius: 12, background: A.card, border: `1px solid ${A.divider}`, padding: '0 14px', color: A.text, fontFamily: A.sans, fontSize: 14, outline: 'none',
        }} />
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
            <div style={{ fontFamily: A.sans, fontSize: 10.5, fontWeight: 600, color: A.muted, letterSpacing: '0.16em', textTransform: 'uppercase', padding: '6px 4px 10px' }}>{gname}</div>
            {items.map((m, i) => (
              <div key={m.id} className="fade-up" style={{
                animationDelay: `${i * 0.03}s`,
                background: A.card, borderRadius: 14, padding: 12, marginBottom: 8,
                display: 'flex', alignItems: 'center', gap: 12,
                opacity: m.visible ? 1 : 0.55,
              }}>
                {IMG[m.name] ? (
                  <img src={IMG[m.name]} alt="" style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: A.cardHi, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{m.glyph}</div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 15, color: A.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <span style={{ fontFamily: A.sans, fontSize: 12.5, color: A.pink, fontWeight: 600 }}>₹{m.price}</span>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.visible ? A.greenSoft : A.red }} />
                    <span style={{ fontFamily: A.sans, fontSize: 11, color: A.muted }}>{m.visible ? 'Visible' : 'Hidden'}</span>
                  </div>
                </div>
                <ATap onClick={() => toggleVisible(m)} style={{ width: 34, height: 34, borderRadius: 10, background: A.cardHi, color: m.visible ? A.greenSoft : A.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{m.visible ? '◉' : '◌'}</ATap>
                <ATap onClick={() => setEditItem(m)} style={{ width: 34, height: 34, borderRadius: 10, background: A.cardHi, color: A.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4z" /></svg>
                </ATap>
                <ATap onClick={() => setConfirmDel(m)} style={{ width: 34, height: 34, borderRadius: 10, background: A.cardHi, color: A.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🗑</ATap>
              </div>
            ))}
          </div>
        ))}
      </div>

      {editItem !== undefined && (
        <EditSheet item={editItem} onClose={() => setEditItem(undefined)} onSave={handleSave} />
      )}

      {confirmDel && (
        <>
          <div onClick={() => setConfirmDel(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50, backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 51, background: A.surface, borderRadius: '20px 20px 0 0', padding: '16px 20px 28px', animation: 'aSheet .25s var(--spring) both' }}>
            <div style={{ width: 36, height: 4, background: A.divider, borderRadius: 2, margin: '0 auto 14px' }} />
            <div style={{ fontFamily: A.serif, fontWeight: 600, fontSize: 20, color: A.text }}>Delete "{confirmDel.name}"?</div>
            <div style={{ fontFamily: A.sans, fontSize: 13, color: A.textDim, margin: '8px 0 18px' }}>This can't be undone.</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <ATap onClick={() => setConfirmDel(null)} style={{ flex: 1, height: 52, borderRadius: 12, background: A.card, color: A.text, fontFamily: A.sans, fontWeight: 600, fontSize: 13.5 }}>Cancel</ATap>
              <ATap onClick={() => doDelete(confirmDel)} style={{ flex: 1, height: 52, borderRadius: 12, background: A.red, color: '#fff', fontFamily: A.sans, fontWeight: 700, fontSize: 13.5 }}>Delete</ATap>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
