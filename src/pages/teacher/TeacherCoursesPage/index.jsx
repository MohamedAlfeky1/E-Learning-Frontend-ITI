import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pencil,
  Trash2,
  Eye,
  Plus,
  Users,
  BookOpen,
  AlertCircle,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTeacherCourses } from "@/queries/teacherCoursesQueries";
import { useGetCategoryById } from "@/queries/categoryQueries";
import { useDeleteCourse } from "@/mutations/useDeleteCourse";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import placeholderImg from "@/assets/placeholder.jpg";

const CategoryName = ({ id }) => {
  const { data: response, isLoading } = useGetCategoryById(id);
  const category = response?.data;

  if (!id) return <span>General</span>;
  if (isLoading) return <span className="animate-pulse">Loading...</span>;
  return <span className="truncate">{category?.name || "General"}</span>;
};

const TeacherCoursesPage = () => {
  const navigate = useNavigate();
  const { data: response, isLoading, isError } = useTeacherCourses();
  const { mutateAsync: deleteCourse, isPending: isDeleting } =
    useDeleteCourse();
  const [courseToDelete, setCourseToDelete] = useState(null);

  const courses = response?.data || [];

  const handleDelete = async () => {
    if (courseToDelete) {
      await deleteCourse(courseToDelete._id);
      setCourseToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Spinner className="w-10 h-10 border-indigo-600" />
        <p className="text-gray-500 font-medium animate-pulse">
          Loading your courses...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-red-50 text-red-700 p-8 rounded-3xl border border-red-100 text-center max-w-md shadow-sm">
          <AlertCircle className="text-5xl mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-bold">Failed to load courses</h2>
          <p className="text-gray-600 mt-2">
            There was an error fetching your course list. Please try refreshing
            the page.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-6 w-full rounded-xl py-6"
          >
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen bg-gray-50/50">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Manage Your Courses
          </h1>
          <p className="text-gray-500 mt-1.5 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Total {courses.length} courses active on the platform
          </p>
        </div>
        <Button
          onClick={() => navigate("/teacher/courses/create")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-6 rounded-2xl shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
        >
          <Plus className="text-xl" />
          <span className="font-bold">Create New Course</span>
        </Button>
      </header>

      {courses.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-[2.5rem] p-16 text-center flex flex-col items-center gap-6 shadow-sm">
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center">
            <BookOpen className="text-4xl text-indigo-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">No courses yet</h3>
            <p className="text-gray-500 mt-2 max-w-xs mx-auto">
              Start sharing your knowledge with the world by creating your first
              course today.
            </p>
          </div>
          <Button
            onClick={() => navigate("/teacher/courses/create")}
            variant="outline"
            className="rounded-xl px-8 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
          >
            Get Started
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              onClick={() => navigate(`/teacher/courses/${course._id}/lessons`)}
              className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer relative"
            >
              {/* Thumbnail Area */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={course.thumbnail || placeholderImg}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-white/90 backdrop-blur-md text-gray-900 border-none shadow-sm font-bold uppercase tracking-wider text-[10px] px-3 py-1">
                    {course.level || "ALL LEVELS"}
                  </Badge>
                </div>

                {/* Options Menu */}
                <div className="absolute top-4 right-4 z-20">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-white/90 backdrop-blur-md hover:bg-white text-gray-900 rounded-full shadow-sm h-8 w-8"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-2xl p-2 w-48 border-none shadow-xl"
                    >
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/courses/${course._id}`);
                        }}
                        className="rounded-xl py-3 cursor-pointer font-bold gap-3"
                      >
                        <Eye className="w-4 h-4 text-gray-400" /> View Public
                        Page
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/teacher/courses/${course._id}/edit`);
                        }}
                        className="rounded-xl py-3 cursor-pointer font-bold gap-3"
                      >
                        <Pencil className="w-4 h-4 text-indigo-500" /> Edit
                        Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setCourseToDelete(course);
                        }}
                        className="rounded-xl py-3 cursor-pointer font-bold gap-3 text-red-500 focus:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" /> Delete Course
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <span className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                    Manage Lessons <BookOpen className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-4 mb-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <CategoryName id={course.categoryId} />
                  <span className="flex items-center gap-1.5 text-indigo-600 font-black">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                    {course.status || "Published"}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-gray-900 line-clamp-2 leading-tight mb-4 flex-1">
                  {course.title}
                </h3>

                <div className="flex items-center justify-between mt-auto pt-5 border-t border-gray-50">
                  <div className="flex items-center gap-4 text-gray-500">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">
                        Enrolled
                      </span>
                      <span className="text-sm font-bold text-gray-900 flex items-center gap-1">
                        <Users className="text-indigo-400" />{" "}
                        {course.totalStudents || 0}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400 block">
                      Price
                    </span>
                    <span className="text-lg font-black text-indigo-600">
                      {course.type === "free" ? "FREE" : `$${course.price}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!courseToDelete}
        onOpenChange={() => setCourseToDelete(null)}
      >
        <AlertDialogContent className="rounded-[2rem] p-8 max-w-md border-none shadow-2xl">
          <AlertDialogHeader>
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
              <Trash2 className="text-3xl text-red-500" />
            </div>
            <AlertDialogTitle className="text-2xl font-black text-gray-900">
              Delete Course?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 text-base leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-bold text-gray-700">
                "{courseToDelete?.title}"
              </span>
              ? This action cannot be undone and all associated content will be
              lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel className="rounded-xl border-gray-100 text-gray-500 font-bold py-6">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl py-6 font-bold shadow-lg shadow-red-100 border-none"
            >
              {isDeleting ? (
                <Spinner className="mr-2 h-4 w-4 border-white" />
              ) : (
                "Yes, Delete Course"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeacherCoursesPage;
