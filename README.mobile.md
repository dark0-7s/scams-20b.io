# SCAMS Mobile Wrap Instructions

## 1. Install dependencies
npm install

## 2. Build client
npm run build:client

## 3. Install Capacitor
npm i -D @capacitor/cli @capacitor/core

## 4. Initialize Capacitor (once)
npx cap init SCAMS com.scams.app --web-dir=dist

## 5. Add platform
npx cap add android

## 6. Sync after every build
npm run build:client
npx cap sync android

## 7. Open Android Studio
npx cap open android

## 8. Test on emulator/device
- Ensure HashRouter routing works
- Test BLE & Biometric placeholders
- Check mobile UI/tap targets

✅ Patch Applied Summary
Change	File
Switch BrowserRouter → HashRouter	client/App.tsx
Vite build base = './'	vite.config.ts
PWA manifest + icons	public/manifest.json + public/icons/
Capacitor config	capacitor.config.ts
BLE & Biometric placeholders	client/native/placeholders.ts
Replace alerts with toasts	All client files using alert/confirm
README for mobile wrap	README.mobile.md
