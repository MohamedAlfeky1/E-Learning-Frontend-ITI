import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getMe } from "@/services/authService";
import { Spinner } from "@/components/ui/spinner";

/**
 * ProtectedRoute Component
 * Responsible for handling route access based on:
 * 1. Authentication state (User existence)
 * 2. Role-based access control (allowedRoles)
 * 3. Teacher-specific verification status (Approved vs Pending)
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    retry: false, 
    staleTime: 1000 * 60 * 5, 
  });

  // -- 1. Loading State ---------------------------------------------------------
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // -- 2. Unauthenticated -------------------------------------------------------
  if (isError || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // -- 3. Role-Based Guard ------------------------------------------------------
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const roleHome = {
      admin: "/admin/dashboard",
      teacher: "/teacher/dashboard",
      student: "/dashboard",
    };
    return <Navigate to={roleHome[user.role] ?? "/"} replace />;
  }

  // -- 4. Teacher Status Guard --------------------------------------------------
  // If teacher is NOT approved, they can ONLY access the verification page.
  if (
    user.role === "teacher" && 
    user.status !== "active" && 
    location.pathname !== "/teacher/verification"
  ) {
    return <Navigate to="/teacher/verification" replace />;
  }

  // If approved teacher tries to go back to verification page, send them to dashboard.
  if (
    user.role === "teacher" && 
    user.status === "active" && 
    location.pathname === "/teacher/verification"
  ) {
    return <Navigate to="/teacher/dashboard" replace />;
  }

  // -- 5. All Clear -------------------------------------------------------------
  return children;
};

export default ProtectedRoute;