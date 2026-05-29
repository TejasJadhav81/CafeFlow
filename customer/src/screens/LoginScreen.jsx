import { useState } from 'react';
import { CoffeeCup } from './WelcomeScreen';
import { auth } from '../firebase/config';
import { signInEmail, signUpEmail, sendPhoneOTP, verifyPhoneOTP } from '../firebase/auth';

export default function LoginScreen({ onSuccess, onBack, tableNumber }) {
  const [tab, setTab] = useState('email'); // 'phone' | 'email'
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('input'); // 'input' | 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const clearError = () => setError('');

  async function handlePhoneSend() {
    clearError();
    if (!auth) { setError('Firebase not configured. Use guest mode.'); return; }
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) { setError('Enter a valid phone number'); return; }
    setLoading(true);
    try {
      await sendPhoneOTP('+91' + digits.slice(-10));
      setStep('otp');
    } catch (e) {
      setError(e.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  }

  async function handleOTPVerify() {
    clearError();
    if (otp.length < 6) { setError('Enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      await verifyPhoneOTP(otp);
      onSuccess();
    } catch (e) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleEmail() {
    clearError();
    if (!auth) { setError('Firebase not configured. Use guest mode.'); return; }
    if (!email.includes('@')) { setError('Enter a valid email'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      try {
        await signInEmail(email, password);
      } catch {
        await signUpEmail(email, password);
      }
      onSuccess();
    } catch (e) {
      setError(e.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#1a0f06',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      color: 'var(--cream-text)',
    }}>
      {/* blobs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[
          { w: 300, h: 300, left: '-10%', top: '5%', c: 'rgba(232,168,56,0.4)', blur: 50, anim: 'blob1 16s ease-in-out infinite' },
          { w: 260, h: 260, right: '-5%', bottom: '20%', c: 'rgba(245,201,106,0.35)', blur: 45, anim: 'blob2 20s ease-in-out infinite' },
          { w: 220, h: 220, left: '20%', bottom: '-5%', c: 'rgba(139,94,60,0.4)', blur: 40, anim: 'blob3 18s ease-in-out infinite' },
        ].map((b, i) => (
          <div key={i} style={{
            position: 'absolute', width: b.w, height: b.h, borderRadius: '50%',
            left: b.left, right: b.right, top: b.top, bottom: b.bottom,
            background: `radial-gradient(circle, ${b.c}, rgba(0,0,0,0) 65%)`,
            filter: `blur(${b.blur}px)`,
            animation: b.anim,
          }} />
        ))}
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(26,15,6,0.5) 0%, rgba(26,15,6,0.2) 50%, rgba(26,15,6,0.7) 100%)' }} />

      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', padding: '0 24px 36px' }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', paddingTop: 56, marginBottom: 32 }}>
          <button onClick={onBack} style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(245,237,214,0.08)', border: '1px solid rgba(245,237,214,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, color: 'var(--cream-text)',
          }}>←</button>
          <span style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 600, marginRight: 40 }}>
            Welcome back
          </span>
        </div>

        {/* cup */}
        <div className="fade-up" style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <CoffeeCup size={72} />
        </div>

        {/* tab toggle */}
        <div className="fade-up" style={{
          animationDelay: '0.1s',
          display: 'flex',
          background: 'rgba(245,237,214,0.06)',
          borderRadius: 999,
          padding: 4,
          marginBottom: 28,
          border: '1px solid rgba(245,237,214,0.1)',
        }}>
          {['phone', 'email'].map(t => (
            <button key={t} onClick={() => { setTab(t); clearError(); setStep('input'); }}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 999,
                fontFamily: 'var(--sans)', fontWeight: 500, fontSize: 14,
                transition: 'all .25s ease',
                background: tab === t ? 'rgba(232,168,56,0.9)' : 'transparent',
                color: tab === t ? '#1a0f06' : 'rgba(245,237,214,0.6)',
              }}>
              {t === 'phone' ? '📱 Phone' : '✉️ Email'}
            </button>
          ))}
        </div>

        {/* inputs */}
        <div className="fade-up" style={{ animationDelay: '0.2s', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tab === 'phone' ? (
            step === 'input' ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{
                  background: 'rgba(245,237,214,0.06)', border: '1px solid rgba(245,237,214,0.15)',
                  borderRadius: 14, padding: '16px 14px',
                  color: 'rgba(245,237,214,0.7)', fontFamily: 'var(--sans)', fontSize: 16,
                  display: 'flex', alignItems: 'center',
                }}>+91</div>
                <input
                  className="input-frost"
                  type="tel" inputMode="numeric"
                  placeholder="Phone number"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  maxLength={10}
                  style={{ flex: 1 }}
                />
              </div>
            ) : (
              <>
                <div style={{ textAlign: 'center', fontSize: 13, color: 'rgba(245,237,214,0.6)', marginBottom: 4 }}>
                  OTP sent to +91 {phone.slice(-10)}
                </div>
                <input
                  className="input-frost"
                  type="tel" inputMode="numeric"
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  autoFocus
                />
                <button onClick={() => setStep('input')} style={{
                  fontSize: 13, color: 'var(--amber-light)', textAlign: 'center',
                  background: 'none', border: 'none', cursor: 'pointer',
                }}>← Change number</button>
              </>
            )
          ) : (
            <>
              <input className="input-frost" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
              <input className="input-frost" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            </>
          )}

          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: 10,
              background: 'rgba(232,130,154,0.12)', border: '1px solid rgba(232,130,154,0.3)',
              color: '#f7c5d0', fontSize: 13, fontFamily: 'var(--sans)',
            }}>{error}</div>
          )}
        </div>


        <div style={{ flex: 1 }} />

        {/* actions */}
        <div className="fade-up" style={{ animationDelay: '0.3s', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            className="btn-amber"
            disabled={loading}
            onClick={tab === 'phone' ? (step === 'input' ? handlePhoneSend : handleOTPVerify) : handleEmail}
            style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? '…' : tab === 'phone' ? (step === 'input' ? 'Send OTP' : 'Verify & Sign In') : 'Sign In / Sign Up'}
          </button>
          <button className="btn-ghost-dark" onClick={onSuccess}>
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
