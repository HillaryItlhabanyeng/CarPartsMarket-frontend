import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./useAuth";
import type { User } from "./AuthContext.types";

interface ProtectedRouteProps {
  allowedRoles?: User["role"][];
  children: ReactNode;
}

const HOME_BY_ROLE: Record<User["role"], string> = {
  buyer: "/shop",
  seller: "/my-listings",
  admin: "/admin",
};

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const { user } = useAuth();
  const location = useLocation();
  const hasToken = !!localStorage.getItem("token");

  
  if (!user || !hasToken) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={HOME_BY_ROLE[user.role] ?? "/"} replace />;
  }

  return children;
}