import React, { useRef, useState } from "react";
import logoBranding from "../../../assets/Logo Branding.png";

const CODE_LENGTH = 6;

export default function OtpVerificationForm() {
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  const isComplete = digits.every(Boolean);

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

    setError("");
    // Valid code; no submission behavior defined yet.
  };

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
            your@email.com
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
        className="w-full bg-[var(--ui-primary)] hover:bg-[var(--ui-primary-hover)] text-white rounded-full py-2.5 lg:py-3 text-[17px] cursor-pointer font-semibold transition-all mt-1 active:scale-[0.98]"
      >
        Verify email
      </button>

      <div className="text-center text-[12px] text-[var(--ui-text-muted)] space-y-1">
        <p>
          Resend code in{" "}
          <span className="text-[var(--ui-text)] font-semibold">14:30</span>
        </p>
        <button
          type="button"
          className="text-[var(--ui-link)] font-semibold hover:underline cursor-pointer"
        >
          Resend
        </button>
      </div>
    </form>
  );
}
