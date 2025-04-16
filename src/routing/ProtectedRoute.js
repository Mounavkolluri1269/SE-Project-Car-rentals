import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = (user) => {
  const isAuthenticated = user?.id || !!localStorage.getItem("car-rentals");

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
