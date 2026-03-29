import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, User, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "../../lib/auth";
import { AuthLayout } from "./AuthLayout";
import { PasswordInput } from "./PasswordInput";
import { PasswordStrength, isPasswordValid } from "./PasswordStrength";
import type { AuthBrandConfig } from "./config";

interface SignUpPageProps {
  brand: AuthBrandConfig;
}

export function SignUpPage({ brand }: SignUpPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const c = brand.colors;

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
      const res = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: window.location.origin + "/auth/verify-email?verified=true",
      });
      if (res.error) {
        toast.error(res.error.message || "Could not create account");
      } else {
        navigate(`/auth/verify-email?email=${encodeURIComponent(email)}`);
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout brand={brand}>
      <div className="auth-header">
        <h2 className="auth-heading">Create Account</h2>
        <p className="auth-subtext">Join {brand.appName} and get started.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div>
          <label className="auth-label">Full Name</label>
          <div className="relative">
            <User className="auth-input-icon" size={16} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`auth-input focus:ring-2 focus:ring-${c.ring}`}
              placeholder="John Doe"
              required
            />
          </div>
        </div>

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
          <label className="auth-label">Password</label>
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
              Create Account
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        <p className="auth-footer-text">
          Already have an account?{" "}
          <Link
            to="/auth/signin"
            className={`font-bold text-${c.link} hover:text-${c.linkHover} transition-colors underline underline-offset-2`}
          >
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
