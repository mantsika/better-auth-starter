import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, ArrowRight, Loader2, CheckCircle, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "../../lib/auth";
import { AuthLayout } from "./AuthLayout";
import { PasswordInput } from "./PasswordInput";
import type { AuthBrandConfig } from "./config";

interface SignInPageProps {
  brand: AuthBrandConfig;
}

export function SignInPage({ brand }: SignInPageProps) {
  const maxAttempts = brand.maxLoginAttempts ?? 3;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [searchParams] = useSearchParams();
  const justVerified = searchParams.get("verified") === "true";
  const navigate = useNavigate();
  const c = brand.colors;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) return;
    setLoading(true);
    try {
      const res = await authClient.signIn.email({ email, password });
      if (res.error) {
        if (res.error.status === 429) {
          setLocked(true);
          toast.error("Too many failed attempts. Please reset your password.");
          return;
        }
        if (res.error.status === 403) {
          toast.error("Please verify your email first");
          navigate(`/auth/verify-email?email=${encodeURIComponent(email)}`);
          return;
        }
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        if (newAttempts >= maxAttempts) {
          setLocked(true);
          toast.error("Too many failed attempts. Please reset your password.");
        } else {
          const remaining = maxAttempts - newAttempts;
          toast.error(
            `Invalid email or password. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
          );
        }
      } else {
        setFailedAttempts(0);
        navigate(brand.dashboardRoute);
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout brand={brand}>
      {justVerified && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6">
          <CheckCircle size={16} className="text-green-600 shrink-0" />
          <p className="text-sm font-medium text-green-700">Email verified! You can now sign in.</p>
        </div>
      )}

      <div className="auth-header">
        <h2 className="auth-heading">Welcome Back</h2>
        <p className="auth-subtext">Sign in to access your account.</p>
      </div>

      {locked ? (
        <div className="text-center py-4 sm:py-6">
          <div className="auth-icon-circle bg-red-50">
            <ShieldAlert className="text-red-500" size={24} />
          </div>
          <p className="auth-status-text text-neutral-900 mb-2">Account temporarily locked</p>
          <p className="auth-status-detail text-neutral-500">
            Too many failed sign-in attempts. Please reset your password to regain access.
          </p>
          <Link
            to="/auth/forgot-password"
            className={`auth-btn bg-${c.primary} hover:bg-${c.primaryHover} shadow-xl shadow-${c.shadow}`}
          >
            Reset Password
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label className="auth-label">Email Address</label>
            <div className="relative">
              <Mail className="auth-input-icon" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`auth-input focus:ring-2 focus:ring-${c.ring}`}
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <label className="auth-label !mb-0">Password</label>
              <Link
                to="/auth/forgot-password"
                tabIndex={-1}
                className={`text-[10px] sm:text-xs font-semibold text-${c.link} hover:text-${c.linkHover} transition-colors`}
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              value={password}
              onChange={setPassword}
              ringColor={c.ring}
            />
          </div>

          {failedAttempts > 0 && (
            <p className="text-[11px] sm:text-xs text-amber-600 font-medium text-center">
              {maxAttempts - failedAttempts} attempt{maxAttempts - failedAttempts === 1 ? "" : "s"} remaining before lockout
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`auth-btn bg-${c.primary} hover:bg-${c.primaryHover} shadow-xl shadow-${c.shadow}`}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      )}

      <div className="auth-footer">
        <p className="auth-footer-text">
          Don't have an account?{" "}
          <Link
            to="/auth/signup"
            className={`font-bold text-${c.link} hover:text-${c.linkHover} transition-colors underline underline-offset-2`}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
