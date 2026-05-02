import { useUserQuery } from "@/queries/authQueries";
import MainLayout from "@/layouts/MainLayout";
import StudentLayout from "@/layouts/StudentLayout";
import TeacherLayout from "@/layouts/TeacherLayout";
import AdminLayout from "@/layouts/AdminLayout";
import Loader from "@/components/ui/loader";

const CourseDetailsRouteWrapper = () => {
  const { data: userData, isLoading } = useUserQuery();
  const token = localStorage.getItem("token");

  if (token && isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (userData?.role === "student") {
    return <StudentLayout />;
  }
  
  if (userData?.role === "teacher") {
    return <TeacherLayout />;
  }

  if (userData?.role === "admin") {
    return <AdminLayout />;
  }

  return <MainLayout />;
};

export default CourseDetailsRouteWrapper;
