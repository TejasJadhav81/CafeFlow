import { db } from './config';
import {
  collection, doc, setDoc, updateDoc, getDoc, getDocs,
  query, where, onSnapshot, arrayUnion, serverTimestamp,
} from 'firebase/firestore';

// ── Menu ──────────────────────────────────────────────────────
export function subscribeMenu(callback) {
  if (!db) return () => {};
  const q = query(collection(db, 'menu'), where('visible', '==', true));
  return onSnapshot(q, snap => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

// ── Orders ────────────────────────────────────────────────────
export async function placeOrAddToOrder(tableNumber, newItems, note, customerId) {
  if (!db) {
    // offline demo — simulate success
    return `BC-${Date.now()}`;
  }
  const pendingQ = query(
    collection(db, 'orders'),
    where('tableNumber', '==', String(tableNumber)),
    where('status', '==', 'pending'),
  );
  const snap = await getDocs(pendingQ);

  if (!snap.empty) {
    // merge into existing pending order
    const existing = snap.docs[0];
    const current = existing.data().items || [];
    const merged = mergeItems(current, newItems);
    await updateDoc(doc(db, 'orders', existing.id), {
      items: merged,
      total: merged.reduce((s, i) => s + i.qty * i.price, 0),
      note: note || existing.data().note || '',
      updatedAt: serverTimestamp(),
    });
    return existing.id;
  } else {
    const orderId = `BC-${Date.now()}`;
    await setDoc(doc(db, 'orders', orderId), {
      orderId,
      tableNumber: String(tableNumber),
      items: newItems,
      total: newItems.reduce((s, i) => s + i.qty * i.price, 0),
      status: 'pending',
      note: note || '',
      customerId: customerId || null,
      source: customerId ? 'qr' : 'qr',
      createdAt: serverTimestamp(),
    });
    return orderId;
  }
}

function mergeItems(existing, incoming) {
  const map = {};
  for (const it of existing) map[it.name] = { ...it };
  for (const it of incoming) {
    if (map[it.name]) map[it.name].qty += it.qty;
    else map[it.name] = { ...it };
  }
  return Object.values(map);
}

// ── Loyalty points ────────────────────────────────────────────
export async function getCustomerPoints(customerId) {
  if (!customerId || !db) return 0;
  const snap = await getDoc(doc(db, 'customers', customerId));
  return snap.exists() ? (snap.data().loyaltyPoints || 0) : 0;
}
