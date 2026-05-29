import { useState, useRef, useContext, useCallback } from 'react';
import { BrewContext } from '../App';
import { useMenu, IMG } from '../hooks/useMenu';
import { CherryPetals } from './WelcomeScreen';

/* ── category order ── */
const CAT_ORDER = ['Coffee', 'Tea', 'Matcha', 'Smoothie', 'Bakery', 'Snacks'];

/* ── ItemSheet (bottom-sheet detail) ── */
function ItemSheet({ item, onClose, onAdd }) {
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');
  const { palette } = useContext(BrewContext);

  if (!item) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      <div onClick={onClose} style={{ flex: 1, background: 'rgba(26,15,6,0.6)', backdropFilter: 'blur(4px)' }} />
      <div style={{
        background: palette.surface,
        borderRadius: '24px 24px 0 0',
        padding: '0 0 40px',
        animation: 'slideUp .35s var(--ease-out) both',
        maxHeight: '82vh',
        overflowY: 'auto',
      }}>
        {/* image */}
        {IMG[item.name] && (
          <div style={{ height: 220, overflow: 'hidden', borderRadius: '24px 24px 0 0' }}>
            <img src={IMG[item.name]} alt={item.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div style={{ padding: '24px 24px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 600, color: palette.heading }}>
                {item.glyph} {item.name}
              </div>
              <div style={{ fontSize: 13, color: palette.muted, marginTop: 4 }}>{item.cat}</div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: palette.accent, marginTop: 4 }}>
              ₹{item.price}
            </div>
          </div>
          {item.description && (
            <div style={{ fontSize: 14, color: palette.body, lineHeight: 1.6, marginTop: 12 }}>
              {item.description}
            </div>
          )}
          {item.size && (
            <div style={{
              marginTop: 14, padding: '8px 14px', borderRadius: 10,
              background: 'rgba(232,168,56,0.08)', border: '1px solid rgba(232,168,56,0.2)',
              fontSize: 12, color: palette.muted,
            }}>☕ {item.size}</div>
          )}

          {/* note */}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: palette.muted, marginBottom: 8 }}>Special request</div>
            <textarea
              placeholder="e.g. extra sugar, no ice…"
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={2}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(26,15,6,0.04)', border: '1px solid var(--divider)',
                borderRadius: 12, padding: '12px 14px',
                fontFamily: 'var(--sans)', fontSize: 14, color: palette.body,
                resize: 'none', outline: 'none',
              }}
            />
          </div>

          {/* qty + add */}
          <div style={{ display: 'flex', gap: 12, marginTop: 24, alignItems: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 0,
              background: 'rgba(26,15,6,0.06)', borderRadius: 999,
              border: '1px solid var(--divider)',
            }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{
                width: 40, height: 40, fontSize: 18, fontWeight: 300,
                color: palette.body, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>−</button>
              <span style={{ minWidth: 28, textAlign: 'center', fontSize: 15, fontWeight: 600, color: palette.heading }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={{
                width: 40, height: 40, fontSize: 18, fontWeight: 300,
                color: palette.body, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>+</button>
            </div>
            <button
              className="btn-amber"
              style={{ flex: 1 }}
              onClick={() => { onAdd(item, qty, note); onClose(); }}>
              Add to order · ₹{item.price * qty}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── MenuItem row / card ── */
function MenuItem({ item, onTap, onQuickAdd, onInc, onDec, cartQty, palette }) {
  const [heart, setHeart] = useState(false);
  const img = IMG[item.name];

  function handleAdd(e) {
    e.stopPropagation();
    onQuickAdd(item, 1, '');
    setHeart(true);
    setTimeout(() => setHeart(false), 900);
  }

  function handleInc(e) { e.stopPropagation(); onInc(item.name); }
  function handleDec(e) { e.stopPropagation(); onDec(item.name); }

  return (
    <div className="tap" onClick={() => onTap(item)} style={{
      display: 'flex', gap: 14, alignItems: 'center',
      padding: '14px 0',
      borderBottom: '1px solid var(--divider)',
      position: 'relative',
    }}>
      {img ? (
        <img src={img} alt={item.name} className="menu-thumb" />
      ) : (
        <div style={{
          width: 60, height: 60, borderRadius: '50%', flexShrink: 0,
          background: 'var(--divider)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26,
        }}>{item.glyph}</div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="menu-item-name" style={{ fontWeight: 600, fontSize: 15, color: palette.heading }}>
          {item.name}
        </div>
        {item.description && (
          <div style={{ fontSize: 12, color: palette.muted, marginTop: 2, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {item.description}
          </div>
        )}
        <div style={{ fontSize: 14, fontWeight: 600, color: palette.accent, marginTop: 4 }}>₹{item.price}</div>
      </div>

      {/* inline qty controls */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        {heart && <span className="heart-pop">💛</span>}
        {cartQty > 0 ? (
          <div onClick={e => e.stopPropagation()} style={{
            display: 'flex', alignItems: 'center',
            background: 'linear-gradient(135deg,#f5c96a,#e8a838)',
            borderRadius: 999,
            boxShadow: '0 4px 12px rgba(232,168,56,0.35)',
            overflow: 'hidden',
          }}>
            <button onClick={handleDec} style={{
              width: 32, height: 34, fontSize: 18, fontWeight: 700,
              color: '#1a0f06', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>−</button>
            <span style={{
              minWidth: 22, textAlign: 'center',
              fontSize: 14, fontWeight: 700, color: '#1a0f06',
            }}>{cartQty}</span>
            <button onClick={handleInc} style={{
              width: 32, height: 34, fontSize: 18, fontWeight: 700,
              color: '#1a0f06', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>+</button>
          </div>
        ) : (
          <button onClick={handleAdd} style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'linear-gradient(135deg,#f5c96a,#e8a838)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, color: '#1a0f06', fontWeight: 700,
            boxShadow: '0 4px 12px rgba(232,168,56,0.35)',
          }}>+</button>
        )}
      </div>
    </div>
  );
}

/* ── CategoryGroup ── */
function CategoryGroup({ cat, items, onTap, onQuickAdd, onInc, onDec, cart, palette }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{
        padding: '20px 20px 4px',
        fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 600,
        color: palette.heading,
      }}>{cat}</div>
      <div style={{ padding: '0 20px' }}>
        {items.map(item => {
          const cartQty = cart.find(c => c.name === item.name)?.qty || 0;
          return (
            <MenuItem key={item.name} item={item} onTap={onTap} onQuickAdd={onQuickAdd}
              onInc={onInc} onDec={onDec} cartQty={cartQty} palette={palette} />
          );
        })}
      </div>
    </div>
  );
}

/* ── CartPill ── */
function CartPill({ cartCount, cartTotal, onOpen, bump }) {
  return (
    <button className={`cart-pill${bump ? ' bump' : ''}`} onClick={onOpen}>
      <span style={{ fontSize: 16 }}>🛒</span>
      <span>{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
      <span style={{ opacity: 0.6, fontSize: 13 }}>·</span>
      <span>₹{cartTotal}</span>
    </button>
  );
}

/* ── MenuScreen ── */
export default function MenuScreen({ onCart, cart, cartCount, cartTotal, onAddToCart, onIncrement, onDecrement, tableNumber, user, points, onLogin, onLogout }) {
  const { palette, voice, rhythm } = useContext(BrewContext);
  const { menu, loading } = useMenu();
  const [activeTab, setActiveTab] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [bump, setBump] = useState(false);
  const tabBarRef = useRef(null);
  const sectionRefs = useRef({});

  const cats = CAT_ORDER.filter(c => menu.some(i => i.cat === c));
  if (activeTab === null && cats.length) {
    // don't call setState here; use first render initialisation below
  }
  const currentTab = activeTab || cats[0];

  function handleQuickAdd(item, qty, note) {
    onAddToCart(item, qty, note);
    setBump(true);
    setTimeout(() => setBump(false), 600);
  }

  function scrollToTab(cat) {
    setActiveTab(cat);
    const el = sectionRefs.current[cat];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const titleFontSize = voice === 'editorial' ? 36 : voice === 'handwritten' ? 38 : 28;
  const titleFont = voice === 'handwritten' ? 'var(--hand)' : voice === 'editorial' ? 'var(--serif)' : 'var(--sans)';

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: palette.bg,
      display: 'flex', flexDirection: 'column',
      color: palette.body,
    }}>
      {/* cherry petals on cozy mood */}
      {palette.petals && <CherryPetals count={24} />}

      {/* header */}
      <div style={{
        background: palette.bg,
        padding: '52px 20px 0',
        zIndex: 10,
        borderBottom: `1px solid ${palette.divider || 'var(--divider)'}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div>
            <div style={{ fontFamily: titleFont, fontSize: titleFontSize, fontWeight: 700, color: palette.heading, lineHeight: 1.1 }}>
              Our Menu
            </div>
            <div style={{ fontSize: 12, color: palette.muted, marginTop: 4 }}>Table {tableNumber}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={user ? undefined : onLogin} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(232,168,56,0.1)', border: '1px solid rgba(232,168,56,0.3)',
              borderRadius: 999, padding: '8px 14px',
              fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500, color: palette.accent,
            }}>
              {user ? `⭐ ${points} pts` : '👤 Login'}
            </button>
            {user && (
              <button onClick={onLogout} style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(232,130,154,0.1)', border: '1px solid rgba(232,130,154,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, color: '#e8829a', cursor: 'pointer',
              }} title="Logout">↩</button>
            )}
          </div>
        </div>

        {/* category tabs */}
        <div className="no-scrollbar" ref={tabBarRef} style={{
          display: 'flex', gap: 6, overflowX: 'auto',
          padding: '12px 0',
        }}>
          {cats.map(c => (
            <button key={c} className={`tab-pill${c === currentTab ? ' active' : ''}`} onClick={() => scrollToTab(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* menu list */}
      <div className="scroll-y" style={{ flex: 1, paddingBottom: 100 }}
        onScroll={e => {
          const scrollTop = e.currentTarget.scrollTop;
          for (const cat of cats) {
            const el = sectionRefs.current[cat];
            if (el && el.offsetTop - 120 <= scrollTop) setActiveTab(cat);
          }
        }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: palette.muted }}>Loading menu…</div>
        ) : (
          cats.map(cat => {
            const items = menu.filter(i => i.cat === cat && i.available !== false);
            if (!items.length) return null;
            return (
              <div key={cat} ref={el => sectionRefs.current[cat] = el}>
                <CategoryGroup cat={cat} items={items} onTap={setSelectedItem} onQuickAdd={handleQuickAdd}
                  onInc={onIncrement} onDec={onDecrement} cart={cart || []} palette={palette} />
              </div>
            );
          })
        )}
      </div>

      {/* cart pill */}
      {cartCount > 0 && (
        <CartPill cartCount={cartCount} cartTotal={cartTotal} onOpen={onCart} bump={bump} />
      )}

      {/* item sheet */}
      {selectedItem && (
        <ItemSheet
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAdd={(item, qty, note) => handleQuickAdd(item, qty, note)}
        />
      )}
    </div>
  );
}
