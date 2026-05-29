import { auth, db } from './config';
import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithPhoneNumber, RecaptchaVerifier, signOut, onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export function onAuthChange(callback) {
  if (!auth) { callback(null); return () => {}; }
  return onAuthStateChanged(auth, callback);
}

export async function signInEmail(email, password) {
  if (!auth) throw new Error('Firebase not configured');
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUpEmail(email, password) {
  if (!auth) throw new Error('Firebase not configured');
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, 'customers', cred.user.uid), {
    loginMethod: 'email',
    email,
    loyaltyPoints: 0,
    totalVisits: 0,
    totalSpent: 0,
    orderIds: [],
    status: 'active',
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  });
  return cred;
}

export async function sendPhoneOTP(phone) {
  if (!auth) throw new Error('Firebase not configured');

  // Clear any old verifier so it re-renders fresh
  if (window.recaptchaVerifier) {
    try { window.recaptchaVerifier.clear(); } catch (_) {}
    window.recaptchaVerifier = null;
  }

  window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
    size: 'invisible',
    callback: () => {},
    'expired-callback': () => {
      window.recaptchaVerifier = null;
    },
  });

  await window.recaptchaVerifier.render();
  const confirmationResult = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
  window.confirmationResult = confirmationResult;
  return confirmationResult;
}

export async function verifyPhoneOTP(otp) {
  if (!window.confirmationResult) throw new Error('No OTP sent');
  const cred = await window.confirmationResult.confirm(otp);
  const user = cred.user;
  await setDoc(doc(db, 'customers', user.uid), {
    loginMethod: 'phone',
    phone: user.phoneNumber,
    loyaltyPoints: 0,
    totalVisits: 0,
    totalSpent: 0,
    orderIds: [],
    status: 'active',
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  }, { merge: true });
  return cred;
}

export function logOut() {
  return signOut(auth);
}

export function currentUser() {
  return auth.currentUser;
}
