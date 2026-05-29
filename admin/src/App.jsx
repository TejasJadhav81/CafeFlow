import { useState } from 'react';
import { AdminProvider, useAdmin } from './AdminContext';
import { BottomNav, Drawer, Toast, NotificationBanner } from './components/Shell';
import TableGridScreen from './screens/TableGridScreen';
import BillScreen from './screens/BillScreen';
import AddItemsScreen from './screens/AddItemsScreen';
import OrdersScreen from './screens/OrdersScreen';
import MenuMgmtScreen from './screens/MenuMgmtScreen';
import ReportsScreen from './screens/ReportsScreen';
import ExpensesScreen from './screens/ExpensesScreen';
import QRScreen from './screens/QRScreen';
import CustomersScreen from './screens/CustomersScreen';
import SettingsScreen from './screens/SettingsScreen';

function AdminRoot() {
  const { toast, notification, setNotification, isOnline, tables } = useAdmin();
  const [tab, setTab] = useState('tables');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // stack: array of { screen, props }
  const [stack, setStack] = useState([]);

  const push = (screen, props = {}) => setStack(s => [...s, { screen, props }]);
  const pop = () => setStack(s => s.slice(0, -1));

  function navigateDrawer(key) {
    if (key === 'expenses') push('expenses');
    else if (key === 'qr') push('qr');
    else if (key === 'customers') push('customers');
    else if (key === 'settings') push('settings');
  }

  const current = stack.length > 0 ? stack[stack.length - 1] : null;

  function renderCurrent() {
    if (current) {
      const { screen, props } = current;
      if (screen === 'bill') {
        // Always use live table from state so added items appear immediately
        const liveTable = tables.find(t => t.id === props.table.id) || props.table;
        return <BillScreen table={liveTable} onBack={pop} onAddItems={() => push('addItems', { table: liveTable })} />;
      }
      if (screen === 'addItems') {
        const liveTable = tables.find(t => t.id === props.table.id) || props.table;
        return <AddItemsScreen table={liveTable} onBack={pop} />;
      }
      if (screen === 'expenses') return <ExpensesScreen onBack={pop} />;
      if (screen === 'qr') return <QRScreen onBack={pop} />;
      if (screen === 'customers') return <CustomersScreen onBack={pop} />;
      if (screen === 'settings') return <SettingsScreen onBack={pop} />;
    }

    // tab root screens
    if (tab === 'tables') return (
      <TableGridScreen
        onOpenBill={t => push('bill', { table: t })}
        onHamburger={() => setDrawerOpen(true)}
        notification={notification}
      />
    );
    if (tab === 'orders') return <OrdersScreen onHamburger={() => setDrawerOpen(true)} />;
    if (tab === 'menu') return <MenuMgmtScreen onHamburger={() => setDrawerOpen(true)} />;
    if (tab === 'reports') return <ReportsScreen onHamburger={() => setDrawerOpen(true)} />;
    return null;
  }

  const showBottomNav = !current;

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0f1117', overflow: 'hidden' }}>
      {renderCurrent()}

      {showBottomNav && <BottomNav active={tab} onChange={t => { setTab(t); setStack([]); }} />}

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onNavigate={navigateDrawer} />

      <NotificationBanner
        notification={notification}
        onView={() => {
          setNotification(null);
          setTab('tables');
          setStack([]);
        }}
        onDismiss={() => setNotification(null)}
      />

      {/* Network status dot — top-right corner */}
      <div style={{
        position: 'absolute', top: 14, right: 14, zIndex: 200,
        display: 'flex', alignItems: 'center', gap: 5,
        background: isOnline ? 'transparent' : 'rgba(224,92,92,0.15)',
        border: isOnline ? 'none' : '1px solid rgba(224,92,92,0.4)',
        borderRadius: 999,
        padding: isOnline ? 0 : '3px 8px 3px 5px',
        transition: 'all .3s ease',
        pointerEvents: 'none',
      }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%',
          background: isOnline ? '#4caf7d' : '#e05c5c',
          boxShadow: isOnline ? '0 0 6px #4caf7d' : '0 0 8px #e05c5c',
          flexShrink: 0,
        }} />
        {!isOnline && (
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: '#e05c5c' }}>
            Offline
          </span>
        )}
      </div>

      <Toast toast={toast} />
    </div>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <AdminRoot />
    </AdminProvider>
  );
}
