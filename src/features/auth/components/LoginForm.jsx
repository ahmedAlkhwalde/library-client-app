import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import InputField from "./InputField";
import PasswordField from "./PasswordField";
import { useLoginMutation } from "../services/authService";
import AppSnackbar from "../../../components/AppSnackbar";
import { setLoginSuccess } from "../store/authSlice";

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navigateTimeoutRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const loginMutation = useLoginMutation({
    onSuccess: (data) => {
      const token =
        data?.token || data?.access_token || data?.data?.token || null;
      const user = data?.user || data?.data?.user || null;
      if (token) {
        dispatch(setLoginSuccess({ user, token }));
      }
      setSnackbar({
        open: true,
        message: "Login successful.",
        variant: "success",
      });
      navigateTimeoutRef.current = setTimeout(
        () => navigate("/app/main-page"),
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
        "Login failed. Please try again.";
      setSnackbar({ open: true, message, variant: "error" });
    },
  });

  useEffect(() => () => clearTimeout(navigateTimeoutRef.current), []);

  const validateField = (field, value) => {
    switch (field) {
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Email is invalid.";
      case "password":
        return value.length >= 8
          ? ""
          : "Password must be at least 8 characters.";
      default:
        return "";
    }
  };

  const validateAll = (allValues) => {
    const nextErrors = {};
    ["email", "password"].forEach((field) => {
      const message = validateField(field, allValues[field]);
      if (message) nextErrors[field] = message;
    });
    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      if (touched[name]) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: validateField(name, value),
        }));
      }
      return next;
    });
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateAll(values);
    setErrors(nextErrors);
    setTouched({ email: true, password: true });
    if (Object.keys(nextErrors).length === 0) {
      loginMutation.mutate({
        email: values.email,
        password: values.password,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5 lg:space-y-3.5">
      <InputField
        name="email"
        label="Email"
        type="email"
        placeholder="omar@gmail.com"
        Icon={MailOutlineIcon}
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email ? errors.email : ""}
      />

      <PasswordField
        name="password"
        label="Password"
        show={showPassword}
        onToggle={() => setShowPassword(!showPassword)}
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.password ? errors.password : ""}
      />

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full bg-[var(--ui-primary)] hover:bg-[var(--ui-primary-hover)] text-white rounded-full py-2.5 lg:py-3 text-[17px] cursor-pointer font-semibold transition-all mt-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loginMutation.isPending ? "Signing in..." : "Sign In"}
      </button>

      <div className="flex items-center text-center my-1.5 before:content-[''] before:flex-1 before:border-b before:border-gray-200 before:mr-3 after:content-[''] after:flex-1 after:border-b after:border-gray-200 after:ml-3">
        <span className="text-gray-400 text-[9px] font-bold uppercase opacity-80">
          or you can
        </span>
      </div>

      <div className="text-center text-[14px] text-[var(--ui-text-muted)] font-medium">
        Don&#39;t have an account?{" "}
        <Link
          to="/app/register"
          className="text-[var(--ui-link)] font-bold cursor-pointer"
        >
          Create free account
        </Link>
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
