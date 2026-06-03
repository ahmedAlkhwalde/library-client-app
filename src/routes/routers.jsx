import { createBrowserRouter, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Register from "../pages/Register.jsx";
import Login from "../pages/Login.jsx";
import OtpVerification from "../pages/OtpVerification.jsx";
import  DashboardPage  from "../pages/DashboardPage.jsx";
import MainLayout from "../layout/MainLayout.jsx";

function RootRedirect() {
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  return (
    <Navigate
      to={isAuthenticated ? "/app/dashboard" : "/app/login"}
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
    path: "/app",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      // {
      //   path: "books",
      //   element: <BooksPage />,
      // },
      // {
      //   path: "myborrowing",
      //   element: <BorrowRequestsView />,
      // },
    ],
  }
]);
