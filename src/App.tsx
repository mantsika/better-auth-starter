import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  SignInPage,
  SignUpPage,
  ForgotPasswordPage,
  VerifyEmailPage,
  ResetPasswordPage,
} from "./components/auth";
import { authClient } from "./lib/auth";
import { brand } from "./brand.config";
import { Toaster } from "sonner";

function RequireVerified({
  session,
  children,
}: {
  session: any;
  children: React.ReactNode;
}) {
  if (!session) return <Navigate to="/auth/signin" />;
  if (!session.user?.emailVerified) {
    return (
      <Navigate
        to={`/auth/verify-email?email=${encodeURIComponent(session.user?.email || "")}`}
      />
    );
  }
  return <>{children}</>;
}

function Dashboard({ session }: { session: any }) {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-black text-neutral-900 mb-2">
          Welcome, {session?.user?.name || "User"}
        </h1>
        <p className="text-neutral-500 mb-6">
          You're signed in. Replace this with your app.
        </p>
        <button
          onClick={() => {
            window.location.href = brand.homeRoute;
            authClient.signOut();
          }}
          className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${brand.colors.primary}`} />
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-center" richColors />
      <Routes>
        {/* Home — redirect to dashboard if signed in */}
        <Route
          path="/"
          element={
            session ? (
              <Navigate to={brand.dashboardRoute} />
            ) : (
              <Navigate to="/auth/signin" />
            )
          }
        />

        {/* Auth routes */}
        <Route
          path="/auth"
          element={
            session ? (
              <Navigate to={brand.dashboardRoute} />
            ) : (
              <Navigate to="/auth/signin" />
            )
          }
        />
        <Route
          path="/auth/signin"
          element={
            session ? <Navigate to={brand.dashboardRoute} /> : <SignInPage brand={brand} />
          }
        />
        <Route
          path="/auth/signup"
          element={
            session ? <Navigate to={brand.dashboardRoute} /> : <SignUpPage brand={brand} />
          }
        />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage brand={brand} />} />
        <Route path="/auth/verify-email" element={<VerifyEmailPage brand={brand} />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage brand={brand} />} />

        {/* Protected app routes — replace Dashboard with your pages */}
        <Route
          path="/dashboard"
          element={
            <RequireVerified session={session}>
              <Dashboard session={session} />
            </RequireVerified>
          }
        />
      </Routes>
    </Router>
  );
}
