import { Bell, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TeacherHeader = () => {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-end px-6 sticky top-0 z-10">
      <div className="flex items-center gap-6">
        
        {/* Notifications & Settings */}
        <div className="flex items-center gap-4 text-slate-500">
          <button className="hover:text-slate-900 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button className="hover:text-slate-900 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Vertical divider */}
        <div className="h-8 w-px bg-slate-200"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">Dr. Sarah Jenkins</p>
            <p className="text-xs text-slate-500">Senior Educator</p>
          </div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>SJ</AvatarFallback>
          </Avatar>
        </div>

      </div>
    </header>
  );
};

export default TeacherHeader;
