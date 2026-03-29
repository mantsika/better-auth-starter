# Better Auth Starter

Production-ready authentication system with React, Better Auth, Tailwind, and Resend.

## What's included

| Feature | Details |
|---------|---------|
| Sign In / Sign Up | Email + password with strong password validation |
| Email Verification | Resend integration, verify-email page with resend button |
| Forgot / Reset Password | Email link flow, confirm password, strength indicator |
| Brute-force Protection | Configurable max attempts + lockout window (server + client) |
| Responsive Design | Fits on a single mobile viewport, scales to desktop |
| Centralized Styling | All auth sizing in `src/index.css`, not scattered in components |

## Quick Start

### 1. Use this template

Click **"Use this template"** on GitHub, or clone:

```bash
git clone https://github.com/mantsika/better-auth-starter.git my-app
cd my-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your database

Create a PostgreSQL database (e.g. on [Neon](https://neon.tech)) and copy the connection string.

### 4. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

| Variable | Description |
|----------|-------------|
| `APP_NAME` | Your app name (used in emails) |
| `BRAND_COLOR` | Hex color for email buttons (e.g. `#0d9488`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Random secret (`openssl rand -hex 32`) |
| `APP_URL` | Backend URL |
| `FRONTEND_URL` | Frontend URL(s), comma-separated |
| `RESEND_API_KEY` | API key from [Resend](https://resend.com) |
| `EMAIL_FROM` | Sender address (must match verified Resend domain) |
| `VITE_API_URL` | Backend URL for the frontend (build-time) |

### 5. Brand your app

Edit **one file**: `src/brand.config.ts`

```ts
export const brand: AuthBrandConfig = {
  appName: "YourApp",
  logoComponent: YourLogo,    // replace src/components/Logo.tsx
  homeRoute: "/",
  dashboardRoute: "/dashboard",
  maxLoginAttempts: 3,
  colors: {
    primary: "indigo-600",     // any Tailwind color
    primaryHover: "indigo-700",
    primaryLight: "indigo-50",
    ring: "indigo-600",
    shadow: "indigo-100",
    logoShadow: "indigo-200/50",
    link: "indigo-600",
    linkHover: "indigo-700",
  },
};
```

### 6. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── src/
│   ├── brand.config.ts          ← EDIT THIS (name, logo, colors)
│   ├── App.tsx                  ← Auth routes + your app pages
│   ├── index.css                ← Auth responsive CSS tokens
│   ├── components/
│   │   ├── Logo.tsx             ← REPLACE THIS (your logo SVG)
│   │   └── auth/               ← Auth UI components (don't edit)
│   │       ├── config.ts        ← AuthBrandConfig type + defaults
│   │       ├── index.ts         ← Barrel exports
│   │       ├── AuthLayout.tsx
│   │       ├── SignInPage.tsx
│   │       ├── SignUpPage.tsx
│   │       ├── ForgotPasswordPage.tsx
│   │       ├── ResetPasswordPage.tsx
│   │       ├── VerifyEmailPage.tsx
│   │       ├── LogoutButton.tsx
│   │       ├── PasswordInput.tsx
│   │       └── PasswordStrength.tsx
│   └── lib/
│       ├── auth.ts              ← Better Auth client
│       ├── auth-server.ts       ← Better Auth server (emails, rate limits)
│       └── api.ts               ← API fetch helper
├── server.ts                    ← Express server
├── Dockerfile                   ← Production backend container
├── .env.example                 ← Environment variable reference
└── index.html                   ← Vite entry point
```

## Auth Flow

```
Sign Up → Verify Email → Sign In → Dashboard
                                ↓ (wrong password x3)
                          Account Locked → Reset Password → Sign In
```

## Customization Guide

| What to change | Where |
|----------------|-------|
| App name, logo, colors | `src/brand.config.ts` |
| Logo SVG | `src/components/Logo.tsx` |
| Responsive sizing (fonts, padding) | `src/index.css` (auth-* classes) |
| Email templates | `.env` (`APP_NAME`, `BRAND_COLOR`) |
| Max login attempts | `.env` (`MAX_LOGIN_ATTEMPTS`) |
| Lockout duration | `.env` (`LOCKOUT_WINDOW_SECONDS`) |
| Password rules | `src/components/auth/PasswordStrength.tsx` |
| Add your app pages | `src/App.tsx` (add routes after auth) |

## Deployment

### Frontend (Cloudflare Pages)

```bash
npm run build
npx wrangler pages deploy dist --project-name=your-project
```

### Backend (Docker)

```bash
docker build -t my-app-api .
docker run -d --env-file .env -p 4000:3000 my-app-api
```

## Tech Stack

- **React 19** + React Router 7
- **Tailwind CSS 4** (Vite plugin)
- **Better Auth** (email + password, email verification, rate limiting)
- **Resend** (transactional emails)
- **PostgreSQL** (via `pg`, works with Neon)
- **Express** (API server)
- **TypeScript**
