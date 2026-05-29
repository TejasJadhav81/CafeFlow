/* ───────── Brew & Co. — admin-app.jsx ─────────
   Top-level admin shell with stack navigation between screens.
*/

const { useState: aaState, useEffect: aaEffect } = React;

function AdminApp() {
  const [tab, setTab] = aaState('tables'); // tables | orders | menu | reports
  const [stack, setStack] = aaState([]);   // pages pushed over the tab
  const [drawer, setDrawer] = aaState(false);

  const { tables, notification, setNotification } = React.useContext(window.AdminContext);

  const push = (page) => setStack(s => [...s, page]);
  const pop = () => setStack(s => s.slice(0, -1));
  const top = stack[stack.length - 1];

  const onOpenBill = (t) => push({ name: 'bill', table: t });
  const onAddItems = (t) => push({ name: 'addItems', table: t });
  const onAddEdit = (m) => push({ name: 'editItem', item: m });

  const viewNotif = () => {
    if (!notification) return;
    const t = tables.find(x => x.id === notification.tableId);
    if (t) push({ name: 'bill', table: t });
    setNotification(null);
  };

  const navHamburger = (key) => {
    if (key === 'expenses') push({ name: 'expenses' });
    else if (key === 'qr') push({ name: 'qr' });
    else if (key === 'customers') push({ name: 'customers' });
    else { /* categories/settings stub */ }
  };

  const A = window.A;

  let body;
  if (top) {
    if (top.name === 'bill') {
      const liveTable = tables.find(t => t.id === top.table.id) || top.table;
      body = <BillScreen table={liveTable} onBack={pop} onAddItems={() => onAddItems(liveTable)} />;
    } else if (top.name === 'addItems') {
      body = <AddItemsScreen table={top.table} onBack={pop} />;
    } else if (top.name === 'editItem') {
      body = <MenuItemEditScreen item={top.item} onBack={pop} />;
    } else if (top.name === 'expenses') {
      body = <ExpensesScreen onBack={pop} />;
    } else if (top.name === 'qr') {
      body = <QRScreen onBack={pop} />;
    } else if (top.name === 'customers') {
      body = <CustomersScreen onBack={pop} />;
    }
  } else if (tab === 'tables') {
    body = <TableGridScreen onOpenBill={onOpenBill} onHamburger={() => setDrawer(true)} notification={notification} onViewNotif={viewNotif} />;
  } else if (tab === 'orders') {
    body = <OrdersScreen onHamburger={() => setDrawer(true)} />;
  } else if (tab === 'menu') {
    body = <MenuMgmtScreen onHamburger={() => setDrawer(true)} onAddEdit={onAddEdit} />;
  } else if (tab === 'reports') {
    body = <ReportsScreen onHamburger={() => setDrawer(true)} />;
  }

  // hide bottom nav on stacked screens
  const showNav = !top;
  const { toast } = React.useContext(window.AdminContext);

  return (
    <div style={{ position: 'absolute', inset: 0, background: A.bg, color: A.text, overflow: 'hidden' }}>
      {body}
      <NotificationBanner notification={notification && !top ? notification : null} onView={viewNotif} onDismiss={() => setNotification(null)} />
      {showNav && <BottomNav active={tab} onChange={(k) => { setTab(k); setStack([]); }} />}
      <Drawer open={drawer} onClose={() => setDrawer(false)} onNavigate={navHamburger} />
      <Toast toast={toast} />
    </div>
  );
}

function AdminRoot() {
  return (
    <window.AdminProvider>
      <AdminApp />
    </window.AdminProvider>
  );
}

window.AdminRoot = AdminRoot;
