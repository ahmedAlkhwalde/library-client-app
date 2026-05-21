import React from "react";
import AuthCard from "../features/auth/components/AuthCard";
import OtpVerificationForm from "../features/auth/components/OtpVerificationForm";

export default function OtpVerification() {
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[var(--ui-bg)] px-4 py-6">
      <AuthCard>
        <OtpVerificationForm />
      </AuthCard>
    </div>
  );
}
