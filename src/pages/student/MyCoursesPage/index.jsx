import { useMyCoursesQuery } from "@/queries/enrollmentQueries";
import Loader from "@/components/ui/loader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  LayoutGrid,
  PlayCircle,
  CheckCircle2,
  GraduationCap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const MyCoursesPage = () => {
  const { data: enrollments, isLoading } = useMyCoursesQuery();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All Courses");

  const filteredEnrollments = enrollments?.filter((enrollment) => {
    if (activeTab === "All Courses") return true;
    if (activeTab === "Completed") return enrollment.completed === true;
    if (activeTab === "In Progress") return enrollment.completed === false;
    return true;
  });

  if (isLoading) return <div className="flex h-[80vh] items-center justify-center"><Loader /></div>;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-10 mb-12 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <Badge className="bg-white/20 text-white border-none mb-4 px-4 py-1 backdrop-blur-md">
                Learning Dashboard
              </Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Keep Growing
              </h1>
              <p className="text-indigo-100 mt-2">
                You completed{" "}
                <span className="font-bold underline">
                  {enrollments?.filter(e => e.completed).length || 0}
                </span>{" "}
                courses so far
              </p>
            </div>
            <div className="hidden lg:block bg-white/10 p-6 rounded-3xl backdrop-blur-xl flex justify-center items-center">
              <GraduationCap size={70} className="text-white" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center md:justify-start mb-10">
          <div className="flex bg-white shadow-sm p-1.5 rounded-2xl">
            {["All Courses", "In Progress", "Completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-gray-500 hover:text-black hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredEnrollments?.length === 0 ? (
          <div className="flex flex-col items-center py-24">
            <BookOpen size={60} className="text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold mb-2">
              Your journey hasn’t started yet
            </h3>
            <p className="text-gray-500 mb-6">
              Explore courses and start learning today
            </p>
            <Button size="lg" onClick={() => navigate("/courses")}>
              Browse Courses
            </Button>
          </div>
        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEnrollments.map((enrollment) => {
              const course = enrollment.courseId;
              const teacher = course?.teacherId;

              return (
                <Card
                  key={enrollment._id}
                  onClick={() => navigate(`/my-courses/${course?._id}/learn`)}
                  className="group cursor-pointer rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col p-0"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full h-44 overflow-hidden block">
                    <img
                      src={course?.thumbnail || "/placeholder.png"}
                      className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                      <div className="bg-white/90 p-3 rounded-full shadow-lg">
                        <PlayCircle className="text-indigo-600" size={24} />
                      </div>
                    </div>
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white/95 text-indigo-600 border-none text-xs font-bold shadow-sm">
                        {course?.categoryId?.name || "General"}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-base text-gray-800 mb-2 group-hover:text-indigo-600 transition line-clamp-1">
                      {course?.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <img
                        src={teacher?.avatar || "/avatar.png"}
                        className="w-6 h-6 rounded-full object-cover border border-gray-100"
                      />
                      <span className="text-xs text-gray-500 font-medium">
                        {teacher?.firstName} {teacher?.lastName}
                      </span>
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-[10px] text-gray-400 font-medium">
                        LAST ACCESS: {new Date(enrollment.lastAccessedAt).toLocaleDateString()}
                      </span>
                      {enrollment.completed && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-green-600 font-bold">COMPLETED</span>
                          <CheckCircle2 className="text-green-500" size={14} />
                        </div>
                      )}
                    </div>

                    {/* Progress */}
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-xs font-semibold text-gray-400">
                        <span>PROGRESS</span>
                        <span className="text-indigo-600 font-bold">{enrollment.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-1000"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}

            {activeTab === "All Courses" && (
              <div
                onClick={() => navigate("/courses")}
                className="flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-10 hover:bg-indigo-50 cursor-pointer transition-all duration-300"
              >
                <LayoutGrid className="text-indigo-500 mb-4" size={40} />
                <h4 className="font-bold">Explore Courses</h4>
                <p className="text-sm text-gray-500 mb-4">
                  Discover new skills
                </p>
                <Button variant="outline">Browse</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;