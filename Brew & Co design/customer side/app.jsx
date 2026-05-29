/* ───────── Brew & Co. — app.jsx ───────── */

const { useState, useEffect, useCallback, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mood": "Cozy",
  "rhythm": "Scattered",
  "voice": "Editorial"
}/*EDITMODE-END*/;

// ── Mood palettes ──────────────────────────────────────────────────────
const MOODS = {
  Cozy: { // Blossom — pink + matcha green + cream (default for couples retheme)
    cream: '#faf5ee', creamWarm: '#f5efe6',
    espresso: '#1a1208', espressoSoft: '#1c2b1e',
    amber: '#e8829a', amberLight: '#f7c5d0', amberDeep: '#c9a84c',
    warmBrown: '#8a7060', warmBrownSoft: '#3d2e1a',
    creamText: '#f5ede0',
    welcomeBg: '#1c2b1e',
    blob1: 'rgba(232,130,154,0.55)', blob2: 'rgba(247,197,208,0.55)',
    blob3: 'rgba(45,90,61,0.55)',     blob4: 'rgba(82,135,106,0.45)',
    pink: '#e8829a', pinkLight: '#f7c5d0',
    greenDark: '#2d5a3d', greenMid: '#52876a',
    gold: '#c9a84c',
    textHeading: '#1a1208', textBody: '#3d2e1a', textMuted: '#8a7060',
    textOnDark: '#f5ede0', divider: '#e8ddd0',
    cardSurface: '#f5efe6', darkSurface: '#1c2b1e',
    pageBg: '#faf5ee',
  },
  Bright: { // sun-bleached linen, terracotta, sage
    cream: '#fbf6ec', creamWarm: '#f6ecda',
    espresso: '#3a2418', espressoSoft: '#5a3a26',
    amber: '#d97a4a', amberLight: '#eaa279', amberDeep: '#b85a2c',
    warmBrown: '#9a7556', warmBrownSoft: '#bfa085',
    creamText: '#fbf6ec',
    welcomeBg: '#2e1d12',
    blob1: 'rgba(217,122,74,0.55)', blob2: 'rgba(234,162,121,0.55)',
    blob3: 'rgba(150,165,130,0.45)', blob4: 'rgba(217,122,74,0.35)',
    pink: '#d97a4a', pinkLight: '#eaa279',
    greenDark: '#7a8a5a', greenMid: '#a8b889',
    gold: '#c9a84c',
    textHeading: '#3a2418', textBody: '#5a3a26', textMuted: '#9a7556',
    textOnDark: '#fbf6ec', divider: '#e5d8c4',
    cardSurface: '#f6ecda', darkSurface: '#2e1d12',
    pageBg: '#fbf6ec',
  },
  Midnight: { // deep noir, copper, smoke
    cream: '#191510', creamWarm: '#221c14',
    espresso: '#f0e6d2', espressoSoft: '#d8c9a8',
    amber: '#d4a04a', amberLight: '#e8c178', amberDeep: '#b8842a',
    warmBrown: '#a89580', warmBrownSoft: '#7d6c58',
    creamText: '#f0e6d2',
    welcomeBg: '#0d0a06',
    blob1: 'rgba(212,160,74,0.45)', blob2: 'rgba(232,193,120,0.35)',
    blob3: 'rgba(120,90,60,0.45)',   blob4: 'rgba(212,160,74,0.3)',
    pink: '#e8829a', pinkLight: '#f7c5d0',
    greenDark: '#2d5a3d', greenMid: '#52876a',
    gold: '#d4a04a',
    textHeading: '#f0e6d2', textBody: '#d8c9a8', textMuted: '#a89580',
    textOnDark: '#f0e6d2', divider: '#3a2e20',
    cardSurface: '#221c14', darkSurface: '#0d0a06',
    pageBg: '#191510',
  },
};

// ── Type voices ───────────────────────────────────────────────────────
const VOICES = {
  Editorial:   { serif: "'Playfair Display', Georgia, serif", sans: "'DM Sans', system-ui, sans-serif",       hand: "'Caveat', cursive",        serifWeight: 600, italic: true },
  Handwritten: { serif: "'Cormorant Garamond', Georgia, serif", sans: "'DM Sans', system-ui, sans-serif",     hand: "'Homemade Apple', cursive", serifWeight: 500, italic: true },
  Modernist:   { serif: "'Archivo', system-ui, sans-serif",     sans: "'Space Grotesk', system-ui, sans-serif", hand: "'Space Grotesk', sans-serif", serifWeight: 700, italic: false },
};

// ── Menu rhythms ──────────────────────────────────────────────────────
const RHYTHMS = {
  Whispered:  { dxScale: 0.25, angScale: 0,    sizeBoost: -2, padY: 10, featuredBoost: 1 },
  Scattered:  { dxScale: 1,    angScale: 1,    sizeBoost: 0,  padY: 12, featuredBoost: 2 },
  Theatrical: { dxScale: 1.6,  angScale: 2.2,  sizeBoost: 2,  padY: 16, featuredBoost: 5 },
};

const BrewContext = React.createContext({ mood: MOODS.Cozy, voice: VOICES.Editorial, rhythm: RHYTHMS.Scattered });

function applyTokens(mood, voice) {
  const r = document.documentElement.style;
  r.setProperty('--bg-cream', mood.cream);
  r.setProperty('--bg-cream-warm', mood.creamWarm);
  r.setProperty('--espresso', mood.espresso);
  r.setProperty('--espresso-soft', mood.espressoSoft);
  r.setProperty('--amber', mood.amber);
  r.setProperty('--amber-light', mood.amberLight);
  r.setProperty('--amber-deep', mood.amberDeep);
  r.setProperty('--warm-brown', mood.warmBrown);
  r.setProperty('--warm-brown-soft', mood.warmBrownSoft);
  r.setProperty('--cream-text', mood.creamText);
  r.setProperty('--serif', voice.serif);
  r.setProperty('--sans', voice.sans);
  r.setProperty('--hand', voice.hand);
  // Blossom retheme tokens
  r.setProperty('--pink', mood.pink);
  r.setProperty('--pink-light', mood.pinkLight);
  r.setProperty('--green-dark', mood.greenDark);
  r.setProperty('--green-mid', mood.greenMid);
  r.setProperty('--gold', mood.gold);
  r.setProperty('--text-heading', mood.textHeading);
  r.setProperty('--text-body', mood.textBody);
  r.setProperty('--text-muted', mood.textMuted);
  r.setProperty('--text-on-dark', mood.textOnDark);
  r.setProperty('--divider', mood.divider);
  r.setProperty('--card-surface', mood.cardSurface);
  r.setProperty('--dark-surface', mood.darkSurface);
  r.setProperty('--page-bg', mood.pageBg);
}

function App() {
  // route to admin POS when ?mode=admin
  const isAdmin = (() => {
    try { return new URL(window.location.href).searchParams.get('mode') === 'admin'; }
    catch { return false; }
  })();

  if (isAdmin) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at top, #1a1d27 0%, #0a0b10 80%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}>
        <IOSDevice width={390} height={844} dark={true}>
          <window.AdminRoot />
        </IOSDevice>
      </div>
    );
  }

  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const mood = MOODS[t.mood] || MOODS.Cozy;
  const voice = VOICES[t.voice] || VOICES.Editorial;
  const rhythm = RHYTHMS[t.rhythm] || RHYTHMS.Scattered;

  useEffect(() => { applyTokens(mood, voice); }, [mood, voice]);

  const ctx = useMemo(() => ({ mood, voice, rhythm }), [mood, voice, rhythm]);

  const [screen, setScreen] = useState('welcome');
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState(0);

  const tableNumber = (() => {
    try {
      const u = new URL(window.location.href);
      const n = parseInt(u.searchParams.get('table'), 10);
      return Number.isFinite(n) ? n : 3;
    } catch { return 3; }
  })();

  const addToCart = useCallback((item, qty) => {
    setCart(prev => {
      const idx = prev.findIndex(p => p.name === item.name);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { name: item.name, price: item.price, glyph: item.glyph, qty }];
    });
    setRecentlyAdded(Date.now());
  }, []);

  const incrementItem = (name) => setCart(p => p.map(r => r.name === name ? { ...r, qty: r.qty + 1 } : r));
  const decrementItem = (name) => setCart(p => p.flatMap(r => r.name !== name ? [r] : r.qty > 1 ? [{ ...r, qty: r.qty - 1 }] : []));

  const placeOrder = () => { setShowCart(false); setScreen('confirmed'); };
  const restart = () => { setCart([]); setScreen('menu'); };

  return (
    <BrewContext.Provider value={ctx}>
      <div style={{
        minHeight: '100vh',
        background: `radial-gradient(ellipse at top, ${mood.welcomeBg === '#1a0f06' ? '#2a1a0f' : mood.welcomeBg} 0%, #0e0703 80%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}>
        <IOSDevice width={390} height={844} dark={true}>
          <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: mood.welcomeBg }}>
            {screen === 'welcome' && (
              <WelcomeScreen key={'welcome-' + t.mood + t.voice} tableNumber={tableNumber}
                onMenu={() => setScreen('menu')} onLogin={() => setScreen('login')} />
            )}
            {screen === 'login' && (
              <LoginScreen key={'login-' + t.mood + t.voice} onContinue={() => setScreen('menu')} onBack={() => setScreen('welcome')} />
            )}
            {screen === 'menu' && (
              <MenuScreen key={'menu-' + t.rhythm + t.voice}
                cart={cart} addToCart={addToCart} onCart={() => setShowCart(true)}
                tableNumber={tableNumber} recentlyAdded={recentlyAdded} />
            )}
            {screen === 'confirmed' && (
              <ConfirmedScreen key={'conf-' + t.mood} cart={cart} onMore={restart} tableNumber={tableNumber} />
            )}

            {showCart && screen === 'menu' && (
              <CartSheet cart={cart} onClose={() => setShowCart(false)} onPlace={placeOrder}
                onIncrement={incrementItem} onDecrement={decrementItem} tableNumber={tableNumber} />
            )}
          </div>
        </IOSDevice>
      </div>

      <TweaksPanel title="Brew tweaks">
        <TweakSection label="Mood">
          <TweakRadio
            label="Palette"
            value={t.mood}
            options={['Cozy', 'Bright', 'Midnight']}
            onChange={(v) => setTweak('mood', v)}
          />
        </TweakSection>
        <TweakSection label="Menu rhythm">
          <TweakRadio
            label="Layout energy"
            value={t.rhythm}
            options={['Whispered', 'Scattered', 'Theatrical']}
            onChange={(v) => setTweak('rhythm', v)}
          />
        </TweakSection>
        <TweakSection label="Type voice">
          <TweakRadio
            label="Pairing"
            value={t.voice}
            options={['Editorial', 'Handwritten', 'Modernist']}
            onChange={(v) => setTweak('voice', v)}
          />
        </TweakSection>
        <TweakButton
          label={'Jump to ' + (screen === 'menu' ? 'Welcome' : 'Menu')}
          onClick={() => setScreen(screen === 'menu' ? 'welcome' : 'menu')}
          secondary
        />
      </TweaksPanel>
    </BrewContext.Provider>
  );
}

window.BrewContext = BrewContext;
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
