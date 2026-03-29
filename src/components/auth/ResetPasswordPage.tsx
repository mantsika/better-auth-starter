import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "../../lib/auth";
import { AuthLayout } from "./AuthLayout";
import { PasswordInput } from "./PasswordInput";
import { PasswordStrength, isPasswordValid } from "./PasswordStrength";
import type { AuthBrandConfig } from "./config";

interface ResetPasswordPageProps {
  brand: AuthBrandConfig;
}

export function ResetPasswordPage({ brand }: ResetPasswordPageProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const c = brand.colors;
  const token = searchParams.get("token") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid(password)) {
      toast.error("Please meet all password requirements");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await authClient.resetPassword({ newPassword: password, token });
      setSuccess(true);
      toast.success("Password reset successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout brand={brand}>
      <div className="auth-header">
        <h2 className="auth-heading">
          {success ? "Password Reset" : "New Password"}
        </h2>
        <p className="auth-subtext">
          {success
            ? "Your password has been updated."
            : "Enter your new password below."}
        </p>
      </div>

      {success ? (
        <div className="text-center py-4 sm:py-6">
          <div className="auth-icon-circle bg-green-50">
            <CheckCircle className="text-green-600" size={24} />
          </div>
          <p className="auth-status-detail text-neutral-500">
            You can now sign in with your new password.
          </p>
          <button
            onClick={() => navigate("/auth/signin")}
            className={`auth-btn bg-${c.primary} hover:bg-${c.primaryHover} shadow-xl shadow-${c.shadow}`}
          >
            Go to Sign In
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label className="auth-label">New Password</label>
            <PasswordInput
              value={password}
              onChange={setPassword}
              ringColor={c.ring}
            />
            <PasswordStrength password={password} />
          </div>

          <div>
            <label className="auth-label">Confirm Password</label>
            <PasswordInput
              value={confirmPassword}
              onChange={setConfirmPassword}
              ringColor={c.ring}
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="mt-1 text-[11px] text-red-500 font-medium">
                Passwords do not match
              </p>
            )}
            {confirmPassword && password === confirmPassword && (
              <p className="mt-1 text-[11px] text-green-600 font-medium">
                Passwords match
              </p>
            )}
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
                Reset Password
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
