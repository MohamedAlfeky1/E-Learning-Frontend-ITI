import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - fixed width */}
      <AdminSidebar />

      {/* Main Content wrapper */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header - sticky top */}
        <AdminHeader />

        {/* Page Content */}
        <main className="flex-1 p-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
