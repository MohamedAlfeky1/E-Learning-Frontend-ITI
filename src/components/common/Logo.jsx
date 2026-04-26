import { Link } from "react-router-dom";
import { useUserQuery } from "@/queries/authQueries";

const ROLE_DASHBOARD = {
  admin: "/admin/dashboard",
  teacher: "/teacher/dashboard",
  student: "/dashboard",
};

const Logo = ({ className = "" }) => {
  const { data: user } = useUserQuery();
  const dashboardPath = user ? ROLE_DASHBOARD[user.role] || "/" : "/";

  return (
    <Link to={dashboardPath} className={`flex items-center gap-2 group ${className}`}>
      <span className="text-xl font-bold tracking-tight text-foreground">
        Nexora
      </span>
    </Link>
  );
};

export default Logo;
