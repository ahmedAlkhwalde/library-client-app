import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthCard from "../features/auth/components/AuthCard";
import OtpVerificationForm from "../features/auth/components/OtpVerificationForm";

export default function OtpVerification() {
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/app/main-page" replace />;
  }

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[var(--ui-bg)] px-4 py-6">
      <AuthCard>
        <OtpVerificationForm />
      </AuthCard>
    </div>
  );
}
