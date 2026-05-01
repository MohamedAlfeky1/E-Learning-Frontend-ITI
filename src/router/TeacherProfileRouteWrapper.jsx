import { useUserQuery } from "@/queries/authQueries";
import MainLayout from "@/layouts/MainLayout";
import TeacherLayout from "@/layouts/TeacherLayout";
import Loader from "@/components/ui/loader";

const TeacherProfileRouteWrapper = () => {
  const { data: userData, isLoading } = useUserQuery();
  const token = localStorage.getItem("token");

  if (token && isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (userData?.role === "teacher") {
    return <TeacherLayout />;
  }

  return <MainLayout />;
};

export default TeacherProfileRouteWrapper;
