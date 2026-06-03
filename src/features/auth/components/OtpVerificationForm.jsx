import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import logoBranding from "../../../assets/Logo Branding.png";
import {
  useResendCodeMutation,
  useVerifyCodeMutation,
} from "../services/authService";
import AppSnackbar from "../../../components/AppSnackbar";
import { setLoginSuccess } from "../store/authSlice";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function OtpVerificationForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navigateTimeoutRef = useRef(null);
  const location = useLocation();
  const email = location.state?.email || "";
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [resendSeconds, setResendSeconds] = useState(RESEND_SECONDS);
  const inputRefs = useRef([]);

  const verifyMutation = useVerifyCodeMutation({
    onSuccess: (data) => {
      const token =
        data?.token || data?.access_token || data?.data?.token || null;
      const user = data?.user || data?.data?.user || null;
      if (token) {
        dispatch(setLoginSuccess({ user, token }));
      }
      setSnackbar({
        open: true,
        message: "Verification successful.",
        variant: "success",
      });
      navigateTimeoutRef.current = setTimeout(
        () => navigate("/app/dashboard"),
        500,
      );
    },
    onError: (error) => {
      const responseErrors = error?.response?.data?.errors;
      const firstError = Array.isArray(responseErrors)
        ? responseErrors[0]
        : responseErrors && typeof responseErrors === "object"
          ? Object.values(responseErrors).flat()?.[0]
          : null;
      const message =
        firstError ||
        error?.response?.data?.message ||
        error?.message ||
        "Verification failed. Please try again.";
      setSnackbar({ open: true, message, variant: "error" });
    },
  });

  useEffect(() => () => clearTimeout(navigateTimeoutRef.current), []);

  const resendMutation = useResendCodeMutation({
    onSuccess: () => {
      setResendSeconds(RESEND_SECONDS);
      setSnackbar({
        open: true,
        message: "A new verification code has been sent.",
        variant: "info",
      });
    },
    onError: (error) => {
      const responseErrors = error?.response?.data?.errors;
      const firstError = Array.isArray(responseErrors)
        ? responseErrors[0]
        : responseErrors && typeof responseErrors === "object"
          ? Object.values(responseErrors).flat()?.[0]
          : null;
      const message =
        firstError ||
        error?.response?.data?.message ||
        error?.message ||
        "Resend failed. Please try again.";
      setSnackbar({ open: true, message, variant: "error" });
    },
  });

  const isComplete = digits.every(Boolean);

  useEffect(() => {
    if (resendSeconds <= 0) return undefined;
    const timer = setTimeout(
      () => setResendSeconds((prev) => Math.max(prev - 1, 0)),
      1000,
    );
    return () => clearTimeout(timer);
  }, [resendSeconds]);

  const focusInput = (index) => {
    inputRefs.current[index]?.focus();
  };

  const handleChange = (index) => (event) => {
    const digit = event.target.value.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = digit;
    setDigits(nextDigits);

    if (digit && index < CODE_LENGTH - 1) {
      focusInput(index + 1);
    }

    if (error && nextDigits.every(Boolean)) {
      setError("");
    }
  };

  const handleKeyDown = (index) => (event) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handlePaste = (event) => {
    const text = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);

    if (!text) return;

    event.preventDefault();
    const nextDigits = Array(CODE_LENGTH).fill("");
    text.split("").forEach((digit, idx) => {
      nextDigits[idx] = digit;
    });
    setDigits(nextDigits);

    const nextFocus = Math.min(text.length, CODE_LENGTH) - 1;
    if (nextFocus >= 0) {
      focusInput(nextFocus);
    }

    if (error && text.length === CODE_LENGTH) {
      setError("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isComplete) {
      setError("Please enter the 6-digit code.");
      return;
    }

    if (!email) {
      setSnackbar({
        open: true,
        message: "Email is missing. Please register again.",
        variant: "error",
      });
      return;
    }

    setError("");
    verifyMutation.mutate({
      email,
      code: digits.join(""),
    });
  };

  const handleResend = () => {
    if (resendSeconds > 0 || resendMutation.isPending) return;
    if (!email) {
      setSnackbar({
        open: true,
        message: "Email is missing. Please register again.",
        variant: "error",
      });
      return;
    }

    resendMutation.mutate({ email });
  };

  const resendLabel =
    resendSeconds > 0
      ? `Resend code in 0:${String(resendSeconds).padStart(2, "0")}`
      : "You can resend the code now";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-18 h-18 md:w-24 md:h-24 rounded-[22px] flex items-center justify-center">
          <img
            src={logoBranding}
            alt="Logo branding"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="space-y-1">
          <h2 className="text-[20px] md:text-[22px] font-bold text-[var(--ui-text)] tracking-tight">
            Verify your email
          </h2>
          <p className="text-[11px] md:text-[12px] text-[var(--ui-text-muted)]">
            We have sent a 6-digit verification code to
          </p>
          <span className="text-[12px] font-semibold text-[var(--ui-link)]">
            {email || "your@email.com"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            value={digit}
            onChange={handleChange(index)}
            onKeyDown={handleKeyDown(index)}
            onPaste={handlePaste}
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            aria-label={`Digit ${index + 1}`}
            className={`w-11 h-12 md:w-12 md:h-14 rounded-[10px] text-center text-[16px] md:text-[18px] font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400 transition ${
              digit
                ? "bg-purple-200 text-gray-900"
                : "bg-[var(--ui-input-bg)] text-[var(--ui-text)]"
            }`}
          />
        ))}
      </div>

      {error ? (
        <p className="text-red-500 text-[10px] text-center">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={verifyMutation.isPending}
        className="w-full bg-[var(--ui-primary)] hover:bg-[var(--ui-primary-hover)] text-white rounded-full py-2.5 lg:py-3 text-[17px] cursor-pointer font-semibold transition-all mt-1 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {verifyMutation.isPending ? "Verifying..." : "Verify email"}
      </button>

      <div className="text-center text-[12px] text-[var(--ui-text-muted)] space-y-1">
        <p>
          <span className="text-[var(--ui-text)] font-semibold">
            {resendLabel}
          </span>
        </p>
        <button
          type="button"
          onClick={handleResend}
          disabled={resendSeconds > 0 || resendMutation.isPending}
          className="text-[var(--ui-link)] font-semibold hover:underline cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {resendMutation.isPending ? "Sending..." : "Resend"}
        </button>
      </div>

      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        variant={snackbar.variant}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </form>
  );
}
