import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { quizApi } from "@/api/quizApi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Trophy,
  XCircle,
  CheckCircle2,
  RotateCcw,
  LayoutList,
} from "lucide-react";
import Loader from "@/components/ui/loader";

const QuizResultPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["quiz-result", quizId],
    queryFn: () => quizApi.getResult(quizId).then((r) => r.data),
  });

  const result = data?.data ?? data ?? {};

  const score = result.score ?? 0;
  const passingScore = result.passingScore ?? result.quiz?.passingScore ?? 50;
  const passed = score >= passingScore;
  const total = result.totalQuestions ?? result.total ?? 0;
  const correct = result.correctAnswers ?? result.correct ?? 0;
  const title = result.quiz?.title ?? result.title ?? "Quiz";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 flex flex-col items-center gap-4 text-center text-muted-foreground">
        <XCircle className="size-12 text-destructive opacity-70" />
        <p className="text-lg font-medium">Could not load your result.</p>
        <Button variant="outline" onClick={() => navigate("/quizzes")}>
          Back to Quizzes
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 flex flex-col items-center gap-6 text-center">
      {/* ── Pass / Fail icon ── */}
      <div
        className={[
          "flex size-24 items-center justify-center rounded-full",
          passed ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive",
        ].join(" ")}
      >
        {passed ? (
          <Trophy className="size-12" />
        ) : (
          <XCircle className="size-12" />
        )}
      </div>

      {/* ── Status label ── */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">
          {passed ? "Congratulations! 🎉" : "Better luck next time"}
        </h1>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>

      {/* ── Score card ── */}
      <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        {/* Big score */}
        <div>
          <p className="text-5xl font-extrabold text-foreground tabular-nums">
            {score}
            <span className="text-2xl text-muted-foreground font-semibold">%</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Passing score: {passingScore}%
          </p>
        </div>

        {/* Score bar */}
        <div className="relative h-3 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={[
              "h-full rounded-full transition-all duration-700",
              passed ? "bg-primary" : "bg-destructive",
            ].join(" ")}
            style={{ width: `${Math.min(score, 100)}%` }}
          />
          {/* Passing threshold marker */}
          <div
            className="absolute top-0 h-full w-0.5 bg-foreground/30"
            style={{ left: `${passingScore}%` }}
          />
        </div>

        {/* Stats row */}
        {total > 0 && (
          <div className="flex justify-around pt-1 text-sm">
            <div className="flex flex-col items-center gap-0.5">
              <CheckCircle2 className="size-4 text-primary" />
              <span className="font-semibold text-foreground">{correct}</span>
              <span className="text-muted-foreground">Correct</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <XCircle className="size-4 text-destructive" />
              <span className="font-semibold text-foreground">{total - correct}</span>
              <span className="text-muted-foreground">Wrong</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <LayoutList className="size-4 text-muted-foreground" />
              <span className="font-semibold text-foreground">{total}</span>
              <span className="text-muted-foreground">Total</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Actions ── */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Button
          id="back-to-quizzes-btn"
          className="flex-1 gap-2"
          onClick={() => navigate("/quizzes")}
        >
          <LayoutList className="size-4" />
          All Quizzes
        </Button>
      </div>
    </div>
  );
};

export default QuizResultPage;
