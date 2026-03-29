import { useState } from "react";
import {
  ShieldCheck,
  ShieldOff,
  Loader2,
  Copy,
  Check,
  KeyRound,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "../../lib/auth";
import type { AuthBrandConfig } from "./config";

interface TwoFactorSetupProps {
  brand: AuthBrandConfig;
  enabled: boolean;
  onStatusChange: (enabled: boolean) => void;
}

type Step = "idle" | "password" | "qr" | "verify" | "backup" | "disabling";

export function TwoFactorSetup({
  brand,
  enabled,
  onStatusChange,
}: TwoFactorSetupProps) {
  const c = brand.colors;
  const [step, setStep] = useState<Step>("idle");
  const [password, setPassword] = useState("");
  const [totpURI, setTotpURI] = useState("");
  const [code, setCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleEnable = async () => {
    if (!password) return;
    setLoading(true);
    try {
      const res = await authClient.twoFactor.enable({ password });
      if (res.error) {
        toast.error(res.error.message || "Failed to enable 2FA");
        return;
      }
      setTotpURI(res.data?.totpURI || "");
      setBackupCodes(res.data?.backupCodes || []);
      setStep("qr");
    } catch {
      toast.error("Failed to enable 2FA");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (code.length < 6) return;
    setLoading(true);
    try {
      const res = await authClient.twoFactor.verifyTotp({ code });
      if (res.error) {
        toast.error("Invalid code. Please try again.");
        return;
      }
      toast.success("Two-factor authentication enabled!");
      setStep("backup");
      onStatusChange(true);
    } catch {
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    if (!password) return;
    setLoading(true);
    try {
      const res = await authClient.twoFactor.disable({ password });
      if (res.error) {
        toast.error(res.error.message || "Failed to disable 2FA");
        return;
      }
      toast.success("Two-factor authentication disabled");
      onStatusChange(false);
      setStep("idle");
      setPassword("");
    } catch {
      toast.error("Failed to disable 2FA");
    } finally {
      setLoading(false);
    }
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    setCopied(true);
    toast.success("Backup codes copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (step === "idle") {
    return (
      <div className="border border-neutral-200 rounded-2xl p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              enabled ? `bg-green-50` : `bg-neutral-100`
            }`}
          >
            {enabled ? (
              <ShieldCheck className="text-green-600" size={20} />
            ) : (
              <ShieldOff className="text-neutral-400" size={20} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-neutral-900">
              Two-Factor Authentication
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              {enabled
                ? "Your account is protected with an authenticator app."
                : "Add an extra layer of security to your account."}
            </p>
          </div>
          <button
            onClick={() => {
              setStep(enabled ? "disabling" : "password");
              setPassword("");
              setCode("");
            }}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-colors ${
              enabled
                ? "text-red-600 hover:bg-red-50"
                : `text-${c.primary} hover:bg-${c.primaryLight}`
            }`}
          >
            {enabled ? "Disable" : "Enable"}
          </button>
        </div>
      </div>
    );
  }

  if (step === "disabling") {
    return (
      <div className="border border-neutral-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold text-neutral-900">
          Disable Two-Factor Authentication
        </h3>
        <p className="text-xs text-neutral-500">
          Enter your password to confirm.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          className={`auth-input focus:ring-2 focus:ring-${c.ring} !pl-4`}
          autoFocus
        />
        <div className="flex gap-2">
          <button
            onClick={() => { setStep("idle"); setPassword(""); }}
            className="flex-1 auth-btn !bg-neutral-100 !text-neutral-700 hover:!bg-neutral-200"
          >
            Cancel
          </button>
          <button
            onClick={handleDisable}
            disabled={loading || !password}
            className="flex-1 auth-btn bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Disable 2FA"}
          </button>
        </div>
      </div>
    );
  }

  if (step === "password") {
    return (
      <div className="border border-neutral-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold text-neutral-900">
          Enable Two-Factor Authentication
        </h3>
        <p className="text-xs text-neutral-500">
          Enter your password to get started.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          className={`auth-input focus:ring-2 focus:ring-${c.ring} !pl-4`}
          autoFocus
        />
        <div className="flex gap-2">
          <button
            onClick={() => { setStep("idle"); setPassword(""); }}
            className="flex-1 auth-btn !bg-neutral-100 !text-neutral-700 hover:!bg-neutral-200"
          >
            Cancel
          </button>
          <button
            onClick={handleEnable}
            disabled={loading || !password}
            className={`flex-1 auth-btn bg-${c.primary} hover:bg-${c.primaryHover} disabled:opacity-50`}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Continue"}
          </button>
        </div>
      </div>
    );
  }

  if (step === "qr") {
    return (
      <div className="border border-neutral-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold text-neutral-900">
          Scan QR Code
        </h3>
        <p className="text-xs text-neutral-500">
          Scan this code with your authenticator app (Google Authenticator,
          Authy, 1Password, etc.).
        </p>
        <div className="flex justify-center py-4">
          <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(totpURI)}`}
              alt="2FA QR Code"
              width={200}
              height={200}
              className="rounded-lg"
            />
          </div>
        </div>
        <p className="text-[10px] text-neutral-400 text-center break-all font-mono">
          {totpURI}
        </p>
        <div>
          <label className="auth-label">Verification Code</label>
          <div className="relative">
            <KeyRound className="auth-input-icon" size={16} />
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className={`auth-input focus:ring-2 focus:ring-${c.ring} tracking-[0.3em] text-center font-mono`}
              placeholder="000000"
              maxLength={6}
              autoFocus
            />
          </div>
        </div>
        <button
          onClick={handleVerify}
          disabled={loading || code.length < 6}
          className={`auth-btn bg-${c.primary} hover:bg-${c.primaryHover} disabled:opacity-50`}
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Verify & Enable"}
        </button>
      </div>
    );
  }

  if (step === "backup") {
    return (
      <div className="border border-neutral-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-green-600" size={20} />
          <h3 className="text-sm font-bold text-neutral-900">
            Save Your Backup Codes
          </h3>
        </div>
        <p className="text-xs text-neutral-500">
          Store these codes in a safe place. Each code can only be used once to
          sign in if you lose access to your authenticator app.
        </p>
        <div className="bg-neutral-50 rounded-xl p-4 grid grid-cols-2 gap-2">
          {backupCodes.map((c, i) => (
            <code
              key={i}
              className="text-xs font-mono text-neutral-700 bg-white rounded-lg px-3 py-2 text-center border border-neutral-200"
            >
              {c}
            </code>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyBackupCodes}
            className="flex-1 auth-btn !bg-neutral-100 !text-neutral-700 hover:!bg-neutral-200"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied!" : "Copy All"}
          </button>
          <button
            onClick={() => {
              setStep("idle");
              setPassword("");
              setCode("");
              setBackupCodes([]);
            }}
            className={`flex-1 auth-btn bg-${brand.colors.primary} hover:bg-${brand.colors.primaryHover}`}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return null;
}
