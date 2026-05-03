import { useMyCoursesQuery } from "@/queries/enrollmentQueries";
import Loader from "@/components/ui/loader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import cubesBg from "@/assets/cubes.png";

import {
  BookOpen,
  LayoutGrid,
  PlayCircle,
  CheckCircle2,
  GraduationCap,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const MyCoursesPage = () => {
  const { data: enrollments, isLoading } = useMyCoursesQuery();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All Courses");

  const filteredEnrollments = enrollments?.filter((enrollment) => {
    if (activeTab === "All Courses") return true;
    if (activeTab === "Completed") return enrollment?.progress == 100;
    if (activeTab === "In Progress") return enrollment.progress < 100;
    return true;
  });

  if (isLoading)
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="min-h-screen bg-background px-4 py-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl p-10 mb-12 shadow-xl bg-gradient-to-br from-primary via-primary/90 to-purple-900 text-primary-foreground z-0">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url(${cubesBg})`,
              backgroundRepeat: "repeat",
            }}
          ></div>

          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <Badge
                variant="secondary"
                className="mb-4 px-4 py-1 backdrop-blur-md bg-white/20 border-none text-white font-medium"
              >
                Learning Dashboard
              </Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                Keep Growing
              </h1>
              <p className="opacity-90 mt-2 text-lg">
                You've mastered{" "}
                <span className="font-bold text-white underline decoration-2 underline-offset-4">
                  {enrollments?.filter((e) => e.progress === 100).length || 0}
                </span>{" "}
                skills so far. Keep the momentum!
              </p>
            </div>

            <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 translate-x-0">
              <div className="bg-white/15 p-6 rounded-[2.5rem] backdrop-blur-xl border border-white/20 shadow-2xl group transition-all duration-500 ease-out hover:bg-white/25 hover:scale-110 hover:-rotate-3">
                <GraduationCap
                  size={80}
                  className="text-white drop-shadow-2xl transition-transform duration-500 group-hover:rotate-12"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center md:justify-start mb-10">
          <div className="flex bg-card border border-border p-1.5 rounded-2xl shadow-sm">
            {["All Courses", "In Progress", "Completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filteredEnrollments?.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <div className="bg-muted p-6 rounded-full mb-4">
              {activeTab === "Completed" ? (
                <Trophy size={60} className="text-muted-foreground" />
              ) : (
                <BookOpen size={60} className="text-muted-foreground" />
              )}
            </div>
            <h3 className="text-2xl font-bold mb-2 text-foreground">
              {activeTab === "Completed"
                ? "No completed courses yet"
                : activeTab === "In Progress"
                  ? "No courses in progress"
                  : "Your journey hasn’t started yet"}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              {activeTab === "Completed"
                ? "Finish your current courses to see them here and celebrate your success!"
                : activeTab === "In Progress"
                  ? "Pick up where you left off or find something new to learn."
                  : "Explore our library and start building your future today."}
            </p>
            <Button
              size="lg"
              className="bg-primary hover:opacity-90"
              onClick={() => navigate("/browse-courses")}
            >
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
                  className="group cursor-pointer rounded-2xl overflow-hidden bg-card border-border hover:shadow-xl transition-all duration-300 flex flex-col p-0 shadow-sm"
                >
                  <div className="relative w-full h-44 overflow-hidden block">
                    <img
                      src={course?.thumbnail || "/placeholder.png"}
                      className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                      <div className="bg-background/90 p-3 rounded-full shadow-lg">
                        <PlayCircle className="text-primary" size={24} />
                      </div>
                    </div>
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-background/90 text-primary border-none text-xs font-bold shadow-sm">
                        {course?.categoryId?.name || "General"}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-base text-card-foreground mb-2 group-hover:text-primary transition line-clamp-1">
                      {course?.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-4">
                      <img
                        src={teacher?.avatar || "/avatar.png"}
                        className="w-6 h-6 rounded-full object-cover border border-border"
                      />
                      <span className="text-xs text-muted-foreground font-medium">
                        {teacher?.firstName} {teacher?.lastName}
                      </span>
                    </div>

                    <div className="mt-auto space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          <span>Progress</span>
                          <span className="text-primary">
                            {enrollment.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-1000"
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border flex justify-between items-center">
                        <span className="text-[10px] text-muted-foreground font-medium uppercase">
                          {new Date(
                            enrollment.lastAccessedAt,
                          ).toLocaleDateString()}
                        </span>
                        {enrollment.progress === 100 && (
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-green-600 font-bold">
                              COMPLETED
                            </span>
                            <CheckCircle2
                              className="text-green-500"
                              size={12}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}

            {activeTab === "All Courses" && (
              <div
                onClick={() => navigate("/browse-courses")}
                className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl p-10 hover:bg-accent/50 hover:border-primary/50 cursor-pointer transition-all duration-300"
              >
                <div className="bg-muted p-4 rounded-full mb-4">
                  <LayoutGrid className="text-primary" size={32} />
                </div>
                <h4 className="font-bold text-foreground">Explore More</h4>
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Discover new skills and interests
                </p>
                <Button
                  variant="outline"
                  className="border-primary text-primary transition-all duration-300 ease-in-out hover:!bg-primary hover:!text-white hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                >
                  Browse
                </Button>{" "}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;
