import { useState, useRef, useEffect } from "react";
import { Menu, UserPen, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserQuery } from "@/queries/authQueries";
import { Link } from "react-router-dom";
import { useLogout } from "@/hooks/useLogout";

const TeacherHeader = ({ onMenuClick }) => {
  const { data: user } = useUserQuery();
  const logout = useLogout();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase() || "T";

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
      {/* Mobile Menu Toggle */}
      <div className="flex items-center md:hidden">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 mr-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 ml-auto">
        {/* User Profile */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : "Teacher"}
              </p>
              <p className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 inline-block px-1.5 py-0.5 rounded tracking-wide uppercase">
                Teacher
              </p>
            </div>
            <Avatar className="h-10 w-10 border-2 border-indigo-100 shadow-sm hover:border-indigo-300 transition-colors">
              <AvatarImage
                src={user?.avatar || "https://github.com/shadcn.png"}
                alt="Teacher avatar"
              />
              <AvatarFallback className="bg-indigo-600 text-white font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
              {/* User info */}
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-800 truncate">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : "Teacher"}
                </p>
                <p className="text-xs text-slate-400 truncate">{user?.email || ""}</p>
              </div>

              {/* Actions */}
              <div className="py-1">
                <Link
                  to="/teacher/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <UserPen className="w-4 h-4 text-slate-400" />
                  Edit Profile
                </Link>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
                >
                  <LogOut className="w-4 h-4 text-slate-400" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TeacherHeader;
