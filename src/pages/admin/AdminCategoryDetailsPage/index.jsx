import React from "react";
import { useParams } from "react-router-dom";
import { useGetCategoryById } from "@/queries/categoryQueries";
import { useGetCoursesByCategory } from "@/queries/useCourses";
import CourseCard from "@/components/course/CourseCard";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, BookOpen } from "lucide-react";

const AdminCategoryDetailsPage = () => {
  const { id } = useParams();
  const {
    data: catResponse,
    isLoading: catLoading,
    isError: catError,
  } = useGetCategoryById(id);
  const { data: coursesResponse, isLoading: coursesLoading } =
    useGetCoursesByCategory(id);

  const category = catResponse?.data;
  const courses = coursesResponse?.data?.courses || [];

  if (catLoading) {
    return (
      <div className="bg-[#F9F9FF] min-h-screen flex flex-col items-center justify-center gap-4">
        <Spinner className="text-[#3525CD] size-12" />
        <p className="text-gray-500 font-medium animate-pulse">
          Loading category details...
        </p>
      </div>
    );
  }

  if (catError || !category) {
    return (
      <div className="bg-[#F9F9FF] min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-12 rounded-[3rem] border border-gray-100 text-center max-w-md shadow-sm">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 font-['Plus Jakarta Sans']">Category not found</h2>
          <p className="text-gray-500 mt-3 font-medium">
            The category you are looking for does not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F9FF] min-h-screen p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10 flex flex-col lg:flex-row gap-6 justify-between lg:items-end bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="space-y-1">
            <p className="uppercase text-[#3525CD] text-[10px] font-bold tracking-[2px] font-['Inter'] flex items-center gap-2">
              <span className="w-8 h-[2px] bg-[#3525CD]"></span>
              Category Insights
            </p>
            <h1 className="text-[#141B2B] text-[40px] font-extrabold leading-tight font-['Plus Jakarta Sans']">
              {category.name}
            </h1>
            <p className="text-[#464555] text-sm font-medium opacity-80 font-['Inter'] max-w-2xl">
              {category.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <p className="uppercase text-[#777587] text-[10px] font-black tracking-widest leading-none mb-1">
                Total Courses
              </p>
              <span className="text-[#3525CD] text-2xl font-black font-['Plus Jakarta Sans']">
                {courses.length}
              </span>
            </div>
          </div>
        </header>

        {/* Courses Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
              <BookOpen className="text-[#3525CD] w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-[#141B2B] font-['Plus Jakarta Sans']">
              Associated Courses
            </h2>
          </div>

          {coursesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-[400px] bg-white rounded-3xl animate-pulse border border-gray-100 shadow-sm"
                />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-gray-200 shadow-sm">
              <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-8 transform rotate-3">
                <BookOpen className="text-gray-300 text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 font-['Plus Jakarta Sans']">No courses yet</h3>
              <p className="text-gray-500 mt-3 text-lg font-medium max-w-md mx-auto">
                This domain doesn't have any courses yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="transition-transform duration-300 hover:scale-[1.02]"
                >
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCategoryDetailsPage;
