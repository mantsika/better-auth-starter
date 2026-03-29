import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight, Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "../../lib/auth";
import { AuthLayout } from "./AuthLayout";
import type { AuthBrandConfig } from "./config";

interface TwoFactorVerifyProps {
  brand: AuthBrandConfig;
}

export function TwoFactorVerify({ brand }: TwoFactorVerifyProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [useBackup, setUseBackup] = useState(false);
  const [trustDevice, setTrustDevice] = useState(false);
  const navigate = useNavigate();
  const c = brand.colors;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) return;
    setLoading(true);
    try {
      const res = useBackup
        ? await authClient.twoFactor.verifyBackupCode({ code, trustDevice })
        : await authClient.twoFactor.verifyTotp({ code, trustDevice });
      if (res.error) {
        toast.error(res.error.message || "Invalid code. Please try again.");
      } else {
        navigate(brand.dashboardRoute);
      }
    } catch {
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout brand={brand}>
      <div className="auth-header">
        <div className={`auth-icon-circle bg-${c.primaryLight}`}>
          <ShieldCheck className={`text-${c.primary}`} size={24} />
        </div>
        <h2 className="auth-heading">Two-Factor Authentication</h2>
        <p className="auth-subtext">
          {useBackup
            ? "Enter one of your backup codes."
            : "Enter the 6-digit code from your authenticator app."}
        </p>
      </div>

      <form onSubmit={handleVerify} className="auth-form">
        <div>
          <label className="auth-label">
            {useBackup ? "Backup Code" : "Verification Code"}
          </label>
          <div className="relative">
            <KeyRound className="auth-input-icon" size={16} />
            <input
              type="text"
              inputMode={useBackup ? "text" : "numeric"}
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(useBackup ? /[^a-zA-Z0-9-]/g : /\D/g, ""))}
              className={`auth-input focus:ring-2 focus:ring-${c.ring} tracking-[0.3em] text-center font-mono`}
              placeholder={useBackup ? "xxxx-xxxx" : "000000"}
              maxLength={useBackup ? 20 : 6}
              autoFocus
              required
            />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={trustDevice}
            onChange={(e) => setTrustDevice(e.target.checked)}
            className={`rounded border-neutral-300 text-${c.primary} focus:ring-${c.ring}`}
          />
          <span className="text-xs sm:text-sm text-neutral-600">
            Trust this device for 30 days
          </span>
        </label>

        <button
          type="submit"
          disabled={loading || code.length < 6}
          className={`auth-btn bg-${c.primary} hover:bg-${c.primaryHover} shadow-xl shadow-${c.shadow} disabled:opacity-50`}
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              Verify
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        <button
          type="button"
          onClick={() => {
            setUseBackup(!useBackup);
            setCode("");
          }}
          className={`text-xs sm:text-sm font-bold text-${c.link} hover:text-${c.linkHover} transition-colors`}
        >
          {useBackup ? "Use authenticator app instead" : "Use a backup code"}
        </button>
      </div>
    </AuthLayout>
  );
}
