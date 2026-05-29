/* ───────── Brew & Co. Admin — entry + tweaks ─────────
   Three expressive controls that reshape the POS feel:
   • Vibe        — flips the whole surface palette (Espresso Noir / Linen Day / Rose Velvet)
   • Service     — density preset for different rush moods (Cozy / Standard / Brisk)
   • Accent       — accent gradient for primary actions & live highlights
*/

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "vibe": "Espresso Noir",
  "service": "Standard",
  "accent": "Pink Blossom"
}/*EDITMODE-END*/;

// ── palette presets ───────────────────────────────────────────────
const VIBES = {
  'Espresso Noir': { // default — dark roast
    bg: '#0f1117', surface: '#1a1d27', card: '#242836', cardHi: '#2c3142',
    text: '#e8e4dc', muted: '#6b7280', divider: 'rgba(232,228,220,0.08)',
    appGrad: 'radial-gradient(ellipse at top, #1a1d27 0%, #0a0b10 80%)',
    chrome: 'dark',
  },
  'Linen Daylight': { // warm cream café in the morning
    bg: '#f6f1e7', surface: '#fbf6ec', card: '#ffffff', cardHi: '#f3ead8',
    text: '#2a1f14', muted: '#8a7355', divider: 'rgba(50,36,20,0.10)',
    appGrad: 'radial-gradient(ellipse at top, #f6f1e7 0%, #e8dec8 80%)',
    chrome: 'light',
  },
  'Rose Velvet': { // late-evening, candle-lit
    bg: '#1e0f15', surface: '#2a1620', card: '#371d2b', cardHi: '#432437',
    text: '#fce8ec', muted: '#a08593', divider: 'rgba(252,232,236,0.10)',
    appGrad: 'radial-gradient(ellipse at top, #2a1620 0%, #15080d 80%)',
    chrome: 'dark',
  },
};

// ── density / service-pace presets ────────────────────────────────
const SERVICES = {
  'Cozy':     { gridCols: 2, cardPad: 18, gap: 14, scale: 1.04, radius: 22, hush: 1 },     // slow café morning, generous space
  'Standard': { gridCols: 3, cardPad: 14, gap: 10, scale: 1.00, radius: 16, hush: 0.6 },   // default
  'Brisk':    { gridCols: 4, cardPad: 9,  gap: 6,  scale: 0.94, radius: 12, hush: 0.2 },   // rush hour, max info density
};

// ── accent presets ────────────────────────────────────────────────
const ACCENTS = {
  'Pink Blossom': { from: '#e8829a', to: '#c96080', soft: 'rgba(232,130,154,0.12)', glow: 'rgba(232,130,154,0.55)' },
  'Amber Glow':   { from: '#f0b429', to: '#c98a1f', soft: 'rgba(240,180,41,0.14)',  glow: 'rgba(240,180,41,0.55)'  },
  'Mint Service': { from: '#5ec79a', to: '#3a8f6a', soft: 'rgba(94,199,154,0.14)',  glow: 'rgba(94,199,154,0.55)'  },
};

function applyAdminTokens(vibe, accent, service) {
  const r = document.documentElement.style;
  r.setProperty('--bg', vibe.bg);
  r.setProperty('--surface', vibe.surface);
  r.setProperty('--card', vibe.card);
  r.setProperty('--card-hi', vibe.cardHi);
  r.setProperty('--text', vibe.text);
  r.setProperty('--muted', vibe.muted);
  r.setProperty('--divider', vibe.divider);
  r.setProperty('--pink', accent.from);
  r.setProperty('--pink-deep', accent.to);
  r.setProperty('--pink-soft', accent.soft);
  r.setProperty('--pink-glow', accent.glow);
  r.setProperty('--svc-pad', service.cardPad + 'px');
  r.setProperty('--svc-gap', service.gap + 'px');
  r.setProperty('--svc-radius', service.radius + 'px');
  r.setProperty('--svc-cols', String(service.gridCols));
  r.setProperty('--svc-hush', String(service.hush));
  document.body.style.background = vibe.bg;
  // mutate window.A for inline-styled screens
  if (window.A) {
    Object.assign(window.A, {
      bg: vibe.bg, surface: vibe.surface, card: vibe.card, cardHi: vibe.cardHi,
      text: vibe.text, textDim: vibe.muted, muted: vibe.muted, divider: vibe.divider,
      pink: accent.from, pinkDeep: accent.to, pinkSoft: accent.soft,
    });
  }
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const vibe = VIBES[t.vibe] || VIBES['Espresso Noir'];
  const accent = ACCENTS[t.accent] || ACCENTS['Pink Blossom'];
  const service = SERVICES[t.service] || SERVICES['Standard'];

  React.useEffect(() => { applyAdminTokens(vibe, accent, service); }, [vibe, accent, service]);

  // tick re-render so window.A mutations propagate into child inline styles
  const [, force] = React.useState(0);
  React.useEffect(() => { force(x => x + 1); }, [t.vibe, t.accent, t.service]);

  return (
    <>
      <div style={{
        minHeight: '100vh',
        background: vibe.appGrad,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
        transition: 'background .4s ease',
      }}>
        <IOSDevice width={390} height={844} dark={vibe.chrome === 'dark'}>
          <div style={{
            position: 'absolute', inset: 0,
            transform: `scale(${service.scale})`,
            transformOrigin: 'top center',
            transition: 'transform .35s var(--spring)',
          }}>
            <window.AdminRoot />
          </div>
        </IOSDevice>
      </div>

      <TweaksPanel title="POS Tweaks">
        <TweakSection label="Vibe">
          <TweakRadio
            label="Surface palette"
            value={t.vibe}
            options={['Espresso Noir', 'Linen Daylight', 'Rose Velvet']}
            onChange={(v) => setTweak('vibe', v)}
          />
        </TweakSection>

        <TweakSection label="Service pace">
          <TweakRadio
            label="Density"
            value={t.service}
            options={['Cozy', 'Standard', 'Brisk']}
            onChange={(v) => setTweak('service', v)}
          />
        </TweakSection>

        <TweakSection label="Accent">
          <TweakColor
            label="Primary gradient"
            value={ACCENTS[t.accent].from}
            options={['#e8829a', '#f0b429', '#5ec79a']}
            onChange={(hex) => {
              const k = hex === '#e8829a' ? 'Pink Blossom' : hex === '#f0b429' ? 'Amber Glow' : 'Mint Service';
              setTweak('accent', k);
            }}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
