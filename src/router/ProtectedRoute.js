import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getMe } from "@/services/authService";
import Spinner from "@/components/ui/Spinner";

/**
 * ProtectedRoute
 *
 * Wraps any route tree that requires:
 *   1. The user to be authenticated (valid JWT in localStorage)
 *   2. The user's role to be in `allowedRoles`
 *
 * Usage in router/index.jsx:
 *   <ProtectedRoute allowedRoles={["student"]}>
 *     <DashboardLayout />
 *   </ProtectedRoute>
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
    retry: false, // don't retry on 401 — user is simply not logged in
    staleTime: 1000 * 60 * 5, // cache for 5 minutes — avoids re-fetching on every navigation
  });

  // ── 1. Still resolving auth state ────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // ── 2. Not authenticated (JWT missing, expired, or invalid) ──────────────
  if (isError || !user) {
    // Save the page they tried to visit so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ── 3. Authenticated but wrong role ──────────────────────────────────────
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Send each role to its own home — never show a blank/forbidden screen
    const roleHome = {
      admin: "/admin/dashboard",
      teacher: "/teacher/dashboard",
      student: "/dashboard",
    };

    const redirectTo = roleHome[user.role] ?? "/";
    return <Navigate to={redirectTo} replace />;
  }

  // ── 4. All checks passed — render the protected content ──────────────────
  return children;
};

export default ProtectedRoute;
