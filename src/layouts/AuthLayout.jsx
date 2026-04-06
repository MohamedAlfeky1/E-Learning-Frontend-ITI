import { Outlet, Navigate } from "react-router-dom";
import { useUserQuery } from "@/queries/authQueries";
import { Spinner } from "@/components/ui/spinner";

const AuthLayout = () => {
  const { data: user, isLoading } = useUserQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="auth-layout">
      <Outlet />
    </div>
  );
};

export default AuthLayout;