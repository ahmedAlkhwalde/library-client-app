import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import InputField from "./InputField";
import PasswordField from "./PasswordField";
import { useRegisterMutation } from "../services/authService";
import AppSnackbar from "../../../components/AppSnackbar";

export default function RegisterForm() {
  const navigate = useNavigate();
  const navigateTimeoutRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showpassword_confirmation, setShowpassword_confirmation] =
    useState(false);
  const [values, setValues] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const registerMutation = useRegisterMutation({
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "Registration completed. Check your email for the code.",
        variant: "success",
      });
      navigateTimeoutRef.current = setTimeout(
        () => navigate("/app/otp", { state: { email: values.email } }),
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
        "Registration failed. Please try again.";
      setSnackbar({ open: true, message, variant: "error" });
    },
  });

  useEffect(() => () => clearTimeout(navigateTimeoutRef.current), []);

  const validateField = (field, value, allValues) => {
    switch (field) {
      case "name":
        return value.trim() ? "" : "Name is required.";
      case "mobile":
        return /^\d{10}$/.test(value) ? "" : "Phone number must be 10 digits.";
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Email is invalid.";
      case "password":
        return value.length >= 8
          ? ""
          : "Password must be at least 8 characters.";
      case "password_confirmation":
        if (!value) return "Please confirm your password.";
        return value === allValues.password ? "" : "Passwords do not match.";
      default:
        return "";
    }
  };

  const validateAll = (allValues) => {
    const nextErrors = {};
    ["name", "mobile", "email", "password", "password_confirmation"].forEach(
      (field) => {
        const message = validateField(field, allValues[field], allValues);
        if (message) nextErrors[field] = message;
      },
    );
    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      if (touched[name]) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: validateField(name, value, next),
        }));
      }
      if (name === "password" && touched.password_confirmation) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password_confirmation: validateField(
            "password_confirmation",
            next.password_confirmation,
            next,
          ),
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
      [name]: validateField(name, value, values),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateAll(values);
    setErrors(nextErrors);
    setTouched({
      name: true,
      mobile: true,
      email: true,
      password: true,
      password_confirmation: true,
    });
    if (Object.keys(nextErrors).length === 0) {
      registerMutation.mutate({
        name: values.name,
        mobile: values.mobile,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5 lg:space-y-3.5">
      <InputField
        name="name"
        label="Your name"
        placeholder="Omar Abo Hawa"
        Icon={PermIdentityOutlinedIcon}
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.name ? errors.name : ""}
      />

      <InputField
        name="mobile"
        label="Phone number"
        type="tel"
        placeholder="0985311857"
        Icon={LocalPhoneOutlinedIcon}
        value={values.mobile}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.mobile ? errors.mobile : ""}
      />

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

      <PasswordField
        name="password_confirmation"
        label="Confirm"
        show={showpassword_confirmation}
        onToggle={() =>
          setShowpassword_confirmation(!showpassword_confirmation)
        }
        value={values.password_confirmation}
        onChange={handleChange}
        onBlur={handleBlur}
        error={
          touched.password_confirmation ? errors.password_confirmation : ""
        }
      />
      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full bg-[var(--ui-primary)] hover:bg-[var(--ui-primary-hover)] text-white rounded-full py-2.5 lg:py-3 text-[17px] cursor-pointer font-semibold transition-all mt-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {registerMutation.isPending ? "Signing up..." : "Sign Up"}
      </button>

      <div className="flex items-center text-center my-1.5 before:content-[''] before:flex-1 before:border-b before:border-gray-200 before:mr-3 after:content-[''] after:flex-1 after:border-b after:border-gray-200 after:ml-3">
        <span className="text-gray-400 text-[9px] font-bold uppercase opacity-80">
          or you can
        </span>
      </div>

      <div className="text-center text-[14px] text-[var(--ui-text-muted)] font-medium">
        Already have an account?{" "}
        <Link
          to="/app/login"
          className="text-[var(--ui-link)] font-bold cursor-pointer"
        >
          Sign In
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
