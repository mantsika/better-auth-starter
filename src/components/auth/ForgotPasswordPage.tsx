import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "../../lib/auth";
import { AuthLayout } from "./AuthLayout";
import type { AuthBrandConfig } from "./config";

interface ForgotPasswordPageProps {
  brand: AuthBrandConfig;
}

export function ForgotPasswordPage({ brand }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const c = brand.colors;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout brand={brand}>
      <div className="auth-header">
        <h2 className="auth-heading">Reset Password</h2>
        <p className="auth-subtext">
          {sent
            ? "Check your email for the reset link."
            : "Enter your email to receive a reset link."}
        </p>
      </div>

      {sent ? (
        <div className="text-center py-4 sm:py-6">
          <div className={`auth-icon-circle bg-${c.primaryLight}`}>
            <Mail className={`text-${c.primary}`} size={24} />
          </div>
          <p className="auth-status-text text-neutral-900 mb-2">Check your inbox</p>
          <p className="auth-status-detail text-neutral-500">
            If an account exists for <strong>{email}</strong>, we've sent a password reset link.
          </p>
          <button
            onClick={() => setSent(false)}
            className={`text-xs sm:text-sm font-semibold text-${c.link} hover:text-${c.linkHover} transition-colors`}
          >
            Try a different email
          </button>
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

          <button
            type="submit"
            disabled={loading}
            className={`auth-btn bg-${c.primary} hover:bg-${c.primaryHover} shadow-xl shadow-${c.shadow}`}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Send Reset Link
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      )}

      <div className="auth-footer">
        <Link
          to="/auth/signin"
          className="auth-footer-text font-semibold hover:text-neutral-700 transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          Back to Sign In
        </Link>
      </div>
    </AuthLayout>
  );
}
