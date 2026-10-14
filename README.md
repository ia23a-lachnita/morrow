# Morrow

A day is given as 86,400 seconds. It refills at your dawn. Nothing is scored.

The day stays on the device. There is no account.

## App

```bash
npm install
npm run dev
```

Open the printed local address. The product code is `src/components`, `src/routes`, and `src/lib/copy.ts`, `store.ts`, `time.ts`.

## Android

Pushing to `main` builds a sideload APK with GitHub Actions (`.github/workflows/android.yml`). The file is the `morrow-apk` artifact on that run. It is signed with the debug key, so a phone will install it after you allow installs from unknown apps. It is not a Play Store build.

The shell is Capacitor. `npm run build:mobile` writes the offline web bundle to `dist-mobile/`.
