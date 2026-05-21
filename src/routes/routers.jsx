import { createBrowserRouter, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Register from "../pages/Register.jsx";
import Login from "../pages/Login.jsx";
import OtpVerification from "../pages/OtpVerification.jsx";
import { MainPage } from "../pages/mainpage.jsx";

function RootRedirect() {
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  return (
    <Navigate
      to={isAuthenticated ? "/app/main-page" : "/app/login"}
      replace
    />
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
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
  {
    path: "/app/main-page",
    element: <MainPage />,
  },
]);
