/**
 * ─── Brand Configuration ───────────────────────────────────────────
 * This is the ONLY file you need to edit to brand the auth system.
 * Change the app name, logo, colors, and routes below.
 * ────────────────────────────────────────────────────────────────────
 */

import type { AuthBrandConfig } from "./components/auth";
import { LogoIcon } from "./components/Logo";

export const brand: AuthBrandConfig = {
  appName: "MyApp",
  logoComponent: LogoIcon,
  homeRoute: "/",
  dashboardRoute: "/dashboard",
  maxLoginAttempts: 3,
  features: {
    googleAuth: false,
    twoFactor: true,
  },
  colors: {
    primary: "teal-600",
    primaryHover: "teal-700",
    primaryLight: "teal-50",
    ring: "teal-600",
    shadow: "teal-100",
    logoShadow: "teal-200/50",
    link: "teal-600",
    linkHover: "teal-700",
  },
};
