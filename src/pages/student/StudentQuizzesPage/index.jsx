import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { quizApi } from "@/api/quizApi";
import { Skeleton } from "@/components/ui/skeleton";
import QuizCard from "@/components/quiz/QuizCard";
import {
  GraduationCap,
  FileQuestion,
} from "lucide-react";

import StudentCourseList from "@/components/student/StudentCourseList";

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

const fetchCourseQuizzes = (courseId) =>
  quizApi.getForStudent(courseId).then((r) => r.data);

const StudentQuizzesPage = () => {
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  console.log(selectedCourseId);
  

  const {
    data: quizzesData,
    isLoading: quizzesLoading,
    isError: quizzesError,
  } = useQuery({
    queryKey: ["student-quizzes", selectedCourseId],
    queryFn: () => fetchCourseQuizzes(selectedCourseId),
    enabled: !!selectedCourseId,
  });

  const quizzes = quizzesData?.data.quizzes??  [];
  console.log("quizzes",quizzes);
  console.log("quizzesData",quizzesData);

  
  

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-8">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-primary">
          <GraduationCap className="size-6" />
          <h1 className="text-2xl font-bold tracking-tight">My Quizzes</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Select a course to view and start its quizzes.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Choose a course
        </h2>
        
        <StudentCourseList onCourseChange={(id) => setSelectedCourseId(id)} />
      </section>

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