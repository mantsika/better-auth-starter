# Better Auth Starter

Production-ready authentication system with React, Better Auth, Tailwind, and Resend.

## What's included

| Feature | Details |
|---------|---------|
| Sign In / Sign Up | Email + password with strong password validation |
| Google Sign-In | OAuth via Better Auth social providers (toggle on/off) |
| Two-Factor Auth | TOTP with authenticator apps, backup codes, trusted devices |
| Email Verification | Resend integration, verify-email page with resend button |
| Forgot / Reset Password | Email link flow, confirm password, strength indicator |
| Brute-force Protection | Configurable max attempts + lockout window (server + client) |
| Responsive Design | Fits on a single mobile viewport, scales to desktop |
| Centralized Styling | All auth sizing in `src/auth.css`, not scattered in components |

## Usage

This repo can be used in two ways:

### A) As a template (new project)

Click **"Use this template"** on GitHub, or clone:

```bash
git clone https://github.com/mantsika/better-auth-starter.git my-app
cd my-app && npm install
```

### B) As a git submodule (existing project)

```bash
cd your-project
git submodule add https://github.com/mantsika/better-auth-starter.git packages/auth
```

Then configure path aliases (see [Submodule Setup](#submodule-setup) below).

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up your database

Create a PostgreSQL database (e.g. on [Neon](https://neon.tech)) and copy the connection string.

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

| Variable | Description |
|----------|-------------|
| `APP_NAME` | Your app name (used in emails + TOTP issuer) |
| `BRAND_COLOR` | Hex color for email buttons (e.g. `#0d9488`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Random secret (`openssl rand -hex 32`) |
| `APP_URL` | Backend URL |
| `FRONTEND_URL` | Frontend URL(s), comma-separated |
| `RESEND_API_KEY` | API key from [Resend](https://resend.com) |
| `EMAIL_FROM` | Sender address (must match verified Resend domain) |
| `ENABLE_GOOGLE_AUTH` | `true` to enable Google OAuth |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `ENABLE_2FA` | `true` (default) or `false` |
| `VITE_API_URL` | Backend URL for the frontend (build-time) |

### 4. Run database migrations

```bash
npx auth migrate
```

### 5. Brand your app

Edit **one file**: `src/brand.config.ts`

```ts
export const brand: AuthBrandConfig = {
  appName: "YourApp",
  logoComponent: YourLogo,
  homeRoute: "/",
  dashboardRoute: "/dashboard",
  maxLoginAttempts: 3,
  features: {
    googleAuth: true,   // show "Continue with Google" button
    twoFactor: true,    // enable 2FA setup in user settings
  },
  colors: {
    primary: "indigo-600",
    primaryHover: "indigo-700",
    // ...
  },
};
```

### 6. Run

```bash
npm run dev
```

## Project Structure

```
├── src/
│   ├── brand.config.ts          ← EDIT THIS (name, logo, colors, features)
│   ├── App.tsx                  ← Auth routes + your app pages
│   ├── index.css                ← Imports Tailwind + auth.css
│   ├── auth.css                 ← Auth responsive CSS tokens (importable)
│   ├── components/
│   │   ├── Logo.tsx             ← REPLACE THIS (your logo SVG)
│   │   └── auth/                ← Auth UI components (don't edit)
│   │       ├── config.ts        ← AuthBrandConfig type + defaults
│   │       ├── index.ts         ← Barrel exports
│   │       ├── AuthLayout.tsx
│   │       ├── SignInPage.tsx   ← Includes Google button + 2FA redirect
│   │       ├── SignUpPage.tsx
│   │       ├── ForgotPasswordPage.tsx
│   │       ├── ResetPasswordPage.tsx
│   │       ├── VerifyEmailPage.tsx
│   │       ├── GoogleSignInButton.tsx
│   │       ├── TwoFactorVerify.tsx  ← TOTP code entry during login
│   │       ├── TwoFactorSetup.tsx   ← Enable/disable 2FA, QR code, backup codes
│   │       ├── LogoutButton.tsx
│   │       ├── PasswordInput.tsx
│   │       └── PasswordStrength.tsx
│   └── lib/
│       ├── auth.ts              ← Better Auth client (with 2FA plugin)
│       ├── auth-server.ts       ← Better Auth server (Google, 2FA, emails)
│       └── api.ts               ← API fetch helper
├── server.ts                    ← Express server
├── Dockerfile                   ← Production backend container
├── .env.example                 ← Environment variable reference
└── index.html                   ← Vite entry point
```

## Auth Flow

```
Sign Up → Verify Email → Sign In ──→ Dashboard
                           │
                           ├── (2FA enabled) → Enter TOTP Code → Dashboard
                           │
                           └── (wrong password x3) → Locked → Reset Password → Sign In

Google Sign-In → Dashboard (skips email verification + 2FA)
```

## Submodule Setup

When using this repo as a git submodule in an existing project:

### 1. Add the submodule

```bash
git submodule add https://github.com/mantsika/better-auth-starter.git packages/auth
```

### 2. Configure path aliases

**vite.config.ts:**
```ts
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@auth": path.resolve(__dirname, "packages/auth/src"),
    },
  },
});
```

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "paths": {
      "@auth/*": ["./packages/auth/src/*"]
    }
  }
}
```

### 3. Import auth CSS

In your project's main CSS file:
```css
@import "tailwindcss";
@import "../../packages/auth/src/auth.css";
```

### 4. Import components

```tsx
import { SignInPage, TwoFactorVerify } from "@auth/components/auth";
import { authClient } from "@auth/lib/auth";
import type { AuthBrandConfig } from "@auth/components/auth";
```

### 5. Server-side

```ts
import { auth } from "./packages/auth/src/lib/auth-server";
```

### 6. CI/CD (GitHub Actions)

```yaml
- uses: actions/checkout@v4
  with:
    submodules: recursive
```

### 7. Cloning

```bash
git clone --recurse-submodules https://github.com/your-org/your-project.git
```

## Customization Guide

| What to change | Where |
|----------------|-------|
| App name, logo, colors, features | `src/brand.config.ts` |
| Logo SVG | `src/components/Logo.tsx` |
| Responsive sizing (fonts, padding) | `src/auth.css` (auth-* classes) |
| Email templates | `.env` (`APP_NAME`, `BRAND_COLOR`) |
| Max login attempts | `.env` (`MAX_LOGIN_ATTEMPTS`) |
| Lockout duration | `.env` (`LOCKOUT_WINDOW_SECONDS`) |
| Google OAuth | `.env` (`ENABLE_GOOGLE_AUTH`, credentials) |
| Two-Factor Auth | `.env` (`ENABLE_2FA`) |
| Password rules | `src/components/auth/PasswordStrength.tsx` |
| Add your app pages | `src/App.tsx` (add routes after auth) |

## Tech Stack

- **React 19** + React Router 7
- **Tailwind CSS 4** (Vite plugin)
- **Better Auth** (email/password, Google OAuth, 2FA TOTP, email verification, rate limiting)
- **Resend** (transactional emails)
- **PostgreSQL** (via `pg`, works with Neon)
- **Express** (API server)
- **TypeScript**
