# ☕ CafeFlow

A full-stack café POS system with real-time ordering, built for zero hardware cost.

## Apps

| App | Tech | Description |
|-----|------|-------------|
| `customer/` | React + Vite → Vercel | Customer-facing menu & ordering via QR code |
| `admin/` | React + Vite + Capacitor → Android APK | Owner's POS — tables, billing, reports |

## Features

**Customer App**
- Scan QR → browse live menu → order instantly
- Add/adjust items with inline +/− controls
- Login with email or phone OTP for loyalty points
- No app download required

**Admin App**
- Real-time table grid — updates when customers order
- Notification chime on new orders
- Bill management — add items, adjust qty, confirm
- PDF receipt generation (saved to phone)
- Menu management — changes reflect on customer app instantly
- Daily expenses, reports, customer loyalty tracking
- Full offline support — syncs to Firebase when back online

## Tech Stack

- **Frontend:** React 18 + Vite 5
- **Mobile:** Capacitor 5 (Android APK)
- **Backend:** Firebase Firestore (real-time + offline persistence)
- **Auth:** Firebase Auth (email + phone OTP)
- **Hosting:** Vercel (customer app)
- **PDF:** jsPDF

## Setup

### Customer App
```bash
cd customer
cp .env.example .env   # add your Firebase credentials
npm install
npm run dev
```

### Admin App
```bash
cd admin
npm install
npm run dev            # web preview

# Build Android APK
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
```

## Environment Variables

Create `customer/.env`:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```
