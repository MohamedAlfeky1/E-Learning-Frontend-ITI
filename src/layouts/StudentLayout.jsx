import { Outlet } from "react-router-dom";
import StudentSidebar from "@/components/student/StudentSidebar";
import StudentHeader from "@/components/student/StudentHeader";

const StudentLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - fixed width */}
      <StudentSidebar />

      {/* Main Content wrapper */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header - sticky top */}
        <StudentHeader />
        
        {/* Page Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
