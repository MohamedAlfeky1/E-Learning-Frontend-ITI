import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Trophy, FileQuestion, PlayCircle, ChevronRight } from "lucide-react";

/**
 * QuizCard – shows a single quiz's info and a "Start" button.
 * Props: quiz (object)
 */
const QuizCard = ({ quiz }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4 shadow-sm transition-shadow hover:shadow-md">
      {/* Left – info */}
      <div className="flex items-start gap-4 min-w-0">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <BookOpen className="size-5" />
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-foreground leading-tight truncate">
            {quiz.title}
          </p>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {quiz.duration && (
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                {quiz.duration} min
              </span>
            )}
            {quiz.passingScore !== undefined && (
              <span className="flex items-center gap-1">
                <Trophy className="size-3.5" />
                Pass: {quiz.passingScore}%
              </span>
            )}
            {quiz.questionsCount !== undefined && (
              <span className="flex items-center gap-1">
                <FileQuestion className="size-3.5" />
                {quiz.questionsCount} questions
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right – status badge + action */}
      <div className="flex shrink-0 items-center gap-3">
        {quiz.status && (
          <Badge
            variant={quiz.status === "passed" ? "default" : "secondary"}
            className="hidden sm:inline-flex"
          >
            {quiz.status}
          </Badge>
        )}
        <Button
          id={`start-quiz-${quiz._id}`}
          size="sm"
          className="gap-1.5"
          onClick={() => navigate(`/quizzes/${quiz._id}/take`)}
        >
          <PlayCircle className="size-4" />
          Start
          <ChevronRight className="size-3.5 opacity-70" />
        </Button>
      </div>
    </div>
  );
};

export default QuizCard;
