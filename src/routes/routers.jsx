import { createBrowserRouter, Navigate } from "react-router-dom";
import Register from "../pages/Register.jsx";
import Login from "../pages/Login.jsx";
import OtpVerification from "../pages/OtpVerification.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/app/register" replace />,
    // element: <OtpVerification />,
  },
  {
    path: "/app/register",
    element: <Register />,
  },
  {
    path: "/app/login",
    element: <Login />,
  },
  {
    path: "/app/otp",
    element: <OtpVerification />,
  },
]);
