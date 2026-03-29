import type { ComponentType } from "react";

export interface AuthBrandConfig {
  appName: string;
  logoComponent: ComponentType<{ size?: number; className?: string }>;
  homeRoute: string;
  dashboardRoute: string;
  maxLoginAttempts?: number; // default 3
  colors: {
    primary: string;       // e.g. "teal-600"
    primaryHover: string;  // e.g. "teal-700"
    primaryLight: string;  // e.g. "teal-50"
    ring: string;          // e.g. "teal-600"
    shadow: string;        // e.g. "teal-100"
    logoShadow: string;    // e.g. "teal-200/50"
    link: string;          // e.g. "teal-600"
    linkHover: string;     // e.g. "teal-700"
  };
}

export const defaultBrandConfig: AuthBrandConfig = {
  appName: "MyApp",
  logoComponent: () => null,
  homeRoute: "/",
  dashboardRoute: "/dashboard",
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
