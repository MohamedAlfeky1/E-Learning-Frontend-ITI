import { Bell, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserQuery } from "@/queries/authQueries";

const StudentHeader = () => {
  const { data: user } = useUserQuery();
  console.log(user);

  return (
    <header className="h-16 border-b bg-white flex items-center justify-end px-6 sticky top-0 z-10">
      <div className="flex items-center gap-6">
        {/* Vertical divider */}
        <div className="h-8 w-px bg-slate-200"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">
              {`${user?.firstName} ${user?.lastName}` || ""}
            </p>
            <p className="text-xs text-slate-500">Student</p>
          </div>
          <Avatar>
            <AvatarImage
              src={user?.avatar || "https://github.com/shadcn.png"}
              alt="@student"
            />
            <AvatarFallback>{user?.firstName || ""}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;
