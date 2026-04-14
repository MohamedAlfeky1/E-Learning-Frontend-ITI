import { Bell, Settings, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserQuery } from "@/queries/authQueries";

const StudentHeader = ({ setIsSidebarOpen }) => {
  const { data: user } = useUserQuery();
  console.log(user);

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between lg:justify-end px-4 sm:px-6 sticky top-0 z-30 transition-all">
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -ml-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {/* Vertical divider */}
        <div className="hidden sm:block h-8 w-px bg-slate-200"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 sm:pl-0">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800">
              {`${user?.firstName} ${user?.lastName}` || ""}
            </p>
            <p className="text-xs font-medium text-emerald-600 bg-emerald-50 inline-block px-1.5 py-0.5 rounded">
              Student
            </p>
          </div>
          <Avatar className="h-10 w-10 border-2 border-indigo-100 shadow-sm cursor-pointer hover:border-indigo-300 transition-colors">
            <AvatarImage
              src={user?.avatar || "https://github.com/shadcn.png"}
              alt="@student"
            />
            <AvatarFallback className="bg-indigo-600 text-white font-bold">
              {user?.firstName?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;
