import { LogOut } from "lucide-react";
import { authClient } from "../../lib/auth";
import { apiFetch } from "../../lib/api";
import type { AuthBrandConfig } from "./config";

interface LogoutButtonProps {
  brand: AuthBrandConfig;
  className?: string;
  showLabel?: boolean;
}

export function LogoutButton({
  brand,
  className = "",
  showLabel = false,
}: LogoutButtonProps) {
  const handleLogout = () => {
    window.location.href = brand.homeRoute;
    authClient.signOut().catch(() => {
      apiFetch("/api/auth/sign-out", { method: "POST" });
    });
  };

  return (
    <button
      onClick={handleLogout}
      className={`text-neutral-400 hover:text-red-500 transition-colors ${className}`}
      title="Sign out"
    >
      <LogOut size={18} />
      {showLabel && <span className="ml-1.5">Sign Out</span>}
    </button>
  );
}
