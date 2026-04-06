import { Outlet } from "react-router-dom";
import TeacherSidebar from "@/components/teacher/TeacherSidebar";
import TeacherHeader from "@/components/teacher/TeacherHeader";

const TeacherLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - fixed width */}
      <TeacherSidebar />

      {/* Main Content wrapper */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header - sticky top */}
        <TeacherHeader />
        
        {/* Page Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;
