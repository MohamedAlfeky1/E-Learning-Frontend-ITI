import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { TooltipProvider } from "@/components/ui/tooltip";

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("adminSidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("adminSidebarCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen bg-slate-50 flex relative">
        <AdminSidebar 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Main Content wrapper */}
        <div className={`flex-1 flex flex-col transition-all duration-300 w-full min-w-0 ${isCollapsed ? 'md:ml-[72px]' : 'md:ml-[260px]'}`}>
          <AdminHeader onMenuClick={() => setIsMobileOpen(true)} />

          <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AdminLayout;
