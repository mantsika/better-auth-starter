import { Link } from "react-router-dom";
import type { AuthBrandConfig } from "./config";

interface AuthLayoutProps {
  brand: AuthBrandConfig;
  children: React.ReactNode;
}

export function AuthLayout({ brand, children }: AuthLayoutProps) {
  const Logo = brand.logoComponent;

  return (
    <div className="auth-page">
      <Link to={brand.homeRoute} className="auth-logo-link">
        <Logo size={28} className="sm:w-10 sm:h-10" />
        <span className="auth-logo-text">{brand.appName}</span>
      </Link>
      <div className="auth-card">{children}</div>
    </div>
  );
}
