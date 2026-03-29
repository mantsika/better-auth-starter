import type { ComponentType } from "react";

export interface AuthBrandConfig {
  appName: string;
  logoComponent: ComponentType<{ size?: number; className?: string }>;
  homeRoute: string;
  dashboardRoute: string;
  maxLoginAttempts?: number;
  features?: {
    googleAuth?: boolean;
    twoFactor?: boolean;
  };
  colors: {
    primary: string;
    primaryHover: string;
    primaryLight: string;
    ring: string;
    shadow: string;
    logoShadow: string;
    link: string;
    linkHover: string;
  };
}

export const defaultBrandConfig: AuthBrandConfig = {
  appName: "MyApp",
  logoComponent: () => null,
  homeRoute: "/",
  dashboardRoute: "/dashboard",
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
