import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Mail, ArrowRight, Loader2, RefreshCw, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "../../lib/auth";
import { AuthLayout } from "./AuthLayout";
import type { AuthBrandConfig } from "./config";

interface VerifyEmailPageProps {
  brand: AuthBrandConfig;
}

export function VerifyEmailPage({ brand }: VerifyEmailPageProps) {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const verified = searchParams.get("verified") === "true";
  const [resending, setResending] = useState(false);
  const [sent, setSent] = useState(false);
  const c = brand.colors;

  const handleResend = async () => {
    if (!email) {
      toast.error("No email address provided");
      return;
    }
    setResending(true);
    try {
      await authClient.sendVerificationEmail({
        email,
        callbackURL: window.location.origin + "/auth/verify-email?verified=true",
      });
      setSent(true);
    } catch {
      toast.error("Failed to resend email. Please try again.");
    } finally {
      setResending(false);
    }
  };

  if (verified) {
    return (
      <AuthLayout brand={brand}>
        <div className="text-center py-4 sm:py-6">
          <div className="auth-icon-circle bg-green-50">
            <CheckCircle className="text-green-500" size={24} />
          </div>
          <h2 className="auth-heading mb-2 sm:mb-3">Email Verified!</h2>
          <p className="auth-subtext mb-6 sm:mb-8">
            Your account is ready. Sign in to get started.
          </p>
          <Link
            to="/auth/signin?verified=true"
            className={`auth-btn bg-${c.primary} hover:bg-${c.primaryHover} shadow-xl shadow-${c.shadow}`}
          >
            Sign In
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout brand={brand}>
      <div className="text-center py-2 sm:py-6">
        <div className={`auth-icon-circle bg-${c.primaryLight}`}>
          <Mail className={`text-${c.primary}`} size={24} />
        </div>
        <h2 className="auth-heading mb-2 sm:mb-3">Check Your Email</h2>
        <p className="auth-subtext mb-1 sm:mb-2 leading-relaxed">
          We've sent a verification link to
        </p>
        {email && (
          <p className="text-xs sm:text-sm font-bold text-neutral-900 mb-4 sm:mb-8 break-all">
            {email}
          </p>
        )}
        <p className="auth-footer-text mb-4 sm:mb-8 leading-relaxed">
          Click the link in the email to verify your account.
        </p>

        <div className="space-y-2 sm:space-y-3">
          {sent ? (
            <div className="flex items-center justify-center gap-2 py-3 text-green-600 font-semibold text-xs sm:text-sm">
              <CheckCircle size={16} />
              Verification email sent! Check your inbox.
            </div>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className={`auth-btn bg-${c.primary} hover:bg-${c.primaryHover} shadow-xl shadow-${c.shadow} disabled:opacity-50`}
            >
              {resending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              Resend Verification Email
            </button>
          )}

          <Link
            to="/auth/signin"
            className="w-full auth-footer-text font-semibold hover:text-neutral-700 py-2.5 sm:py-3 rounded-xl hover:bg-neutral-50 transition-all flex items-center justify-center gap-1.5"
          >
            Back to Sign In
            <ArrowRight size={14} />
          </Link>
        </div>

        <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-4 sm:mt-6">
          Didn't receive the email? Check your spam folder or try resending.
        </p>
      </div>
    </AuthLayout>
  );
}
