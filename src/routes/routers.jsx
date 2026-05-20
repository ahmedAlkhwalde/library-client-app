import { createBrowserRouter, Navigate } from "react-router-dom";
import Register from "../pages/Register.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/app/register" replace />,
  },
  {
    path: "/app/register",
    element: <Register />,
  },
]);
