import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";
import { quizApi } from "@/api/quizApi";
import { Skeleton } from "@/components/ui/skeleton";
import QuizCard from "@/components/quiz/QuizCard";
import {
  BookOpen,
  GraduationCap,
  FileQuestion,
} from "lucide-react";

// ─── Fetch helpers ────────────────────────────────────────────────────────────

const fetchMyCourses = () =>
  axiosInstance.get(ENDPOINTS.ENROLLMENTS_MY).then((r) => r.data);

const fetchCourseQuizzes = (courseId) =>
  quizApi.getForStudent(courseId).then((r) => r.data);

// ─── Sub-components ───────────────────────────────────────────────────────────

const CourseSkeleton = () => (
  <div className="flex gap-3 flex-wrap">
    {[1, 2, 3].map((i) => (
      <Skeleton key={i} className="h-10 w-36 rounded-full" />
    ))}
  </div>
);

const QuizSkeleton = () => (
  <div className="flex flex-col gap-3">
    {[1, 2, 3].map((i) => (
      <Skeleton key={i} className="h-20 w-full rounded-xl" />
    ))}
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground gap-3">
    <FileQuestion className="size-12 opacity-30" />
    <p className="text-lg font-medium">No quizzes found for this course</p>
    <p className="text-sm">The instructor hasn't published any quizzes yet.</p>
  </div>
);

// QuizCard is imported from @/components/quiz/QuizCard

// ─── Main Page ────────────────────────────────────────────────────────────────

const StudentQuizzesPage = () => {
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // 1. enrolled courses
  const {
    data: enrollments,
    isLoading: coursesLoading,
    isError: coursesError,
  } = useQuery({
    queryKey: ["enrollments-my"],
    queryFn: fetchMyCourses,
  });

  const courses = enrollments?.data ?? enrollments ?? [];

  // 2. quizzes for selected course
  const {
    data: quizzesData,
    isLoading: quizzesLoading,
    isError: quizzesError,
  } = useQuery({
    queryKey: ["student-quizzes", selectedCourseId],
    queryFn: () => fetchCourseQuizzes(selectedCourseId),
    enabled: !!selectedCourseId,
  });

  const quizzes = quizzesData?.data ?? quizzesData ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-8">
      {/* ── Header ── */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-primary">
          <GraduationCap className="size-6" />
          <h1 className="text-2xl font-bold tracking-tight">My Quizzes</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Select a course to view and start its quizzes.
        </p>
      </div>

      {/* ── Course Selector ── */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Choose a course
        </h2>

        {coursesLoading && <CourseSkeleton />}

        {coursesError && (
          <p className="text-sm text-destructive">
            Failed to load your courses. Please try again.
          </p>
        )}

        {!coursesLoading && !coursesError && courses.length === 0 && (
          <p className="text-sm text-muted-foreground">
            You are not enrolled in any courses yet.
          </p>
        )}

        {!coursesLoading && !coursesError && courses.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {courses.map((enrollment) => {
              const course = enrollment.course ?? enrollment;
              const id = course._id ?? course.id;
              const isActive = selectedCourseId === id;

              return (
                <button
                  key={id}
                  id={`select-course-${id}`}
                  onClick={() => setSelectedCourseId(id)}
                  className={[
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-accent",
                  ].join(" ")}
                >
                  <BookOpen className="size-3.5" />
                  {course.title}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Quiz List ── */}
      {selectedCourseId && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Available quizzes
          </h2>

          {quizzesLoading && <QuizSkeleton />}

          {quizzesError && (
            <p className="text-sm text-destructive">
              Failed to load quizzes. Please try again.
            </p>
          )}

          {!quizzesLoading && !quizzesError && quizzes.length === 0 && (
            <EmptyState />
          )}

          {!quizzesLoading && !quizzesError && quizzes.length > 0 && (
            <div className="flex flex-col gap-3">
              {quizzes.map((quiz) => (
                <QuizCard key={quiz._id} quiz={quiz} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default StudentQuizzesPage;
