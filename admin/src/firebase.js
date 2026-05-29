import { initializeApp, getApps } from 'firebase/app';
import {
  initializeFirestore, persistentLocalCache,
  collection, onSnapshot, doc, updateDoc,
  addDoc, setDoc, deleteDoc, getDocs, query, orderBy, where, serverTimestamp, increment,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = initializeFirestore(app, { localCache: persistentLocalCache() });

/* ── Orders ── */
export function subscribeOrders(callback) {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => {
    const orders = snap.docs.map(d => {
      const data = d.data();
      const itemNames = (data.items || []).map(i => `${i.name}${i.qty > 1 ? ` x${i.qty}` : ''}`).join(', ');
      const createdAt = data.createdAt?.toDate?.();
      const time = createdAt
        ? createdAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        : '--:--';
      const tableNum = parseInt(data.tableNumber) || data.tableNumber;
      return { id: d.id, table: tableNum, total: data.total || 0, time, status: data.status || 'pending', items: itemNames, raw: data };
    });
    callback(orders);
  });
}

export async function saveOrder(table, rows, total) {
  try {
    await addDoc(collection(db, 'orders'), {
      tableNumber: table.id,
      tableName: table.name || `Table ${table.id}`,
      items: rows.map(r => ({ name: r.name, qty: r.qty, price: r.price, glyph: r.glyph })),
      total, status: 'confirmed', source: 'admin',
      confirmedAt: serverTimestamp(), createdAt: serverTimestamp(),
    });
  } catch (e) { console.log('Order save failed (offline):', e.message); }
}

/* Mark all pending orders for a table as confirmed so table goes free */
export async function closeTableOrders(tableId) {
  try {
    const q = query(
      collection(db, 'orders'),
      where('tableNumber', '==', String(tableId)),
      where('status', '==', 'pending'),
    );
    const snap = await getDocs(q);
    await Promise.all(snap.docs.map(d => updateDoc(doc(db, 'orders', d.id), {
      status: 'confirmed',
      confirmedAt: serverTimestamp(),
    })));
  } catch (e) { console.log('Close table orders failed:', e.message); }
}

/* ── Menu ── */
export function subscribeMenu(callback) {
  return onSnapshot(collection(db, 'menu'), snap => {
    if (snap.empty) return;
    const items = snap.docs.map(d => ({ id: d.id, firebaseId: d.id, ...d.data() }));
    callback(items);
  });
}

export async function saveMenuItem(item) {
  try {
    if (item.firebaseId) {
      await updateDoc(doc(db, 'menu', item.firebaseId), {
        name: item.name, cat: item.cat, price: item.price,
        description: item.description, visible: item.visible !== false,
        glyph: item.glyph || '☕',
      });
    } else {
      await addDoc(collection(db, 'menu'), {
        name: item.name, cat: item.cat, price: item.price,
        description: item.description || '', visible: item.visible !== false,
        glyph: item.glyph || '☕', createdAt: serverTimestamp(),
      });
    }
  } catch (e) { console.log('Menu save failed:', e.message); }
}

export async function toggleMenuItemVisibility(firebaseId, visible) {
  try { await updateDoc(doc(db, 'menu', firebaseId), { visible }); }
  catch (e) { console.log('Toggle failed:', e.message); }
}

export async function deleteMenuItem(firebaseId) {
  try { await deleteDoc(doc(db, 'menu', firebaseId)); }
  catch (e) { console.log('Delete failed:', e.message); }
}

/* ── Expenses ── */
export function subscribeExpenses(callback) {
  const q = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => {
    const expenses = snap.docs.map(d => {
      const data = d.data();
      const createdAt = data.createdAt?.toDate?.() || new Date();
      return {
        id: d.id,
        amount: data.amount,
        note: data.note || '',
        date: createdAt.toISOString().split('T')[0],
        time: createdAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
    });
    callback(expenses);
  });
}

export async function saveExpense(amount, note) {
  try {
    await addDoc(collection(db, 'expenses'), {
      amount: +amount, note: note || 'Cash expense',
      createdAt: serverTimestamp(),
    });
  } catch (e) { console.log('Expense save failed:', e.message); }
}

export async function deleteExpense(id) {
  try { await deleteDoc(doc(db, 'expenses', id)); }
  catch (e) { console.log('Expense delete failed:', e.message); }
}

/* ── Customers ── */
export function subscribeCustomers(callback) {
  return onSnapshot(collection(db, 'customers'), snap => {
    if (snap.empty) return;
    const customers = snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        name: data.email || data.phone || 'Guest',
        phone: data.phone || '—',
        email: data.email || '—',
        points: data.loyaltyPoints || 0,
        visits: data.totalVisits || 0,
        spent: data.totalSpent || 0,
        status: data.status || 'active',
      };
    });
    callback(customers);
  });
}

export async function updateCustomerPoints(customerId, delta) {
  try {
    const ref = doc(db, 'customers', customerId);
    await updateDoc(ref, { loyaltyPoints: increment(delta) });
  } catch (e) { console.log('Points update failed:', e.message); }
}

/* ── Tables ── */
export function subscribeTables(callback) {
  return onSnapshot(collection(db, 'tables'), snap => {
    if (snap.empty) return;
    callback(snap.docs.map(d => ({ id: d.data().id || parseInt(d.id), ...d.data() })));
  });
}

export async function updateTableStatus(tableId, status, items = []) {
  try { await updateDoc(doc(db, 'tables', String(tableId)), { status, items }); }
  catch (e) { console.log('Table update failed:', e.message); }
}
