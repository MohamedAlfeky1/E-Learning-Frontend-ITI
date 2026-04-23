import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/services/authService";
import { AlertTriangle, RefreshCw, LayoutDashboard } from "lucide-react";

const ErrorPage = () => {
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const getDashboardPath = () => {
    if (!user) return "/";
    const roleHome = {
      admin: "/admin/dashboard",
      teacher: "/teacher/dashboard",
      student: "/dashboard",
    };
    return roleHome[user.role] ?? "/";
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      {/* Decorative blurred orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-100 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-100 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-md w-full">
        {/* Icon */}
        <div className="mx-auto mb-8 w-24 h-24 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
          <AlertTriangle className="w-12 h-12 text-red-500" strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Oops!
        </h1>
        <p className="text-lg text-slate-700 mb-2">Something went wrong</p>
        <p className="text-sm text-slate-500 mb-10 max-w-sm mx-auto">
          An unexpected error has occurred. Please try refreshing the page or
          head back to your dashboard.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-sm hover:bg-slate-200 transition-all duration-200 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            Refresh Page
          </button>

          <button
            onClick={() => navigate(getDashboardPath())}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all duration-200 cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4" />
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
