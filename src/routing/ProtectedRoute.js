import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = (user) => {
  const isAuthenticated = user?.id || !!localStorage.getItem("token");

  return isAuthenticated ? (
    <Outlet user={user} />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
