import React, { useState } from "react";
import { Link } from "react-router-dom";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import InputField from "./InputField";
import PasswordField from "./PasswordField";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const validateField = (field, value, allValues) => {
    switch (field) {
      case "name":
        return value.trim() ? "" : "Name is required.";
      case "phone":
        return /^\d{10}$/.test(value) ? "" : "Phone number must be 10 digits.";
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Email is invalid.";
      case "password":
        return value.length >= 8
          ? ""
          : "Password must be at least 8 characters.";
      case "confirmPassword":
        if (!value) return "Please confirm your password.";
        return value === allValues.password ? "" : "Passwords do not match.";
      default:
        return "";
    }
  };

  const validateAll = (allValues) => {
    const nextErrors = {};
    ["name", "phone", "email", "password", "confirmPassword"].forEach(
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
      if (name === "password" && touched.confirmPassword) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: validateField(
            "confirmPassword",
            next.confirmPassword,
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
      phone: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    if (Object.keys(nextErrors).length === 0) {
      // Valid form; no submission behavior defined yet.
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
        name="phone"
        label="Phone number"
        type="tel"
        placeholder="0985311857"
        Icon={LocalPhoneOutlinedIcon}
        value={values.phone}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.phone ? errors.phone : ""}
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
        name="confirmPassword"
        label="Confirm"
        show={showConfirmPassword}
        onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
        value={values.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.confirmPassword ? errors.confirmPassword : ""}
      />
      <Link to="/app/otp">
        <button
          type="submit"
          className="w-full bg-[var(--ui-primary)] hover:bg-[var(--ui-primary-hover)] text-white rounded-full py-2.5 lg:py-3 text-[17px] cursor-pointer font-semibold transition-all mt-2 active:scale-[0.98]"
        >
          Sign Up
        </button>
      </Link>

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
    </form>
  );
}
