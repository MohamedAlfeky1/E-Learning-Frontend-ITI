import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { quizApi } from "@/api/quizApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Send,
} from "lucide-react";
import Loader from "@/components/ui/loader";

// ─── Timer hook ───────────────────────────────────────────────────────────────
const useCountdown = (seconds, onExpire) => {
  const [remaining, setRemaining] = useState(seconds);
  const ref = useRef(null);

  useEffect(() => {
    if (!seconds) return;
    setRemaining(seconds);
    ref.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(ref.current);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [seconds]); // eslint-disable-line

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  return { remaining, label: `${mm}:${ss}` };
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const OptionButton = ({ text, selected, onSelect }) => (
  <button
    onClick={onSelect}
    className={[
      "w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all",
      selected
        ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
        : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent",
    ].join(" ")}
  >
    {text}
  </button>
);

const ProgressDots = ({ total, current, answers }) => (
  <div className="flex flex-wrap gap-1.5">
    {Array.from({ length: total }).map((_, i) => (
      <button
        key={i}
        className={[
          "size-7 rounded-full text-xs font-semibold transition-all",
          i === current
            ? "bg-primary text-primary-foreground scale-110 shadow"
            : answers[i] !== undefined
            ? "bg-primary/20 text-primary border border-primary"
            : "bg-muted text-muted-foreground",
        ].join(" ")}
      >
        {i + 1}
      </button>
    ))}
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const QuizTakePage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionIndex]: optionIndex }
  const [submitted, setSubmitted] = useState(false);

  // 1. Load quiz questions
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ["quiz-start", quizId],
    queryFn: () => quizApi.start(quizId).then((r) => r.data),
  });
  console.log(isError);
  

  const quiz = data?.data ?? data ?? {};
  console.log(quiz);
  
  const questions = quiz.questions ?? [];
  const totalSeconds = quiz.duration ? quiz.duration * 60 : null;

  // 2. Auto-submit when timer expires
  const handleAutoSubmit = () => {
    toast.warning("Time's up! Submitting your answers…");
    submitMutation.mutate();
  };

  const { remaining, label: timerLabel } = useCountdown(
    totalSeconds,
    handleAutoSubmit
  );

  // 3. Submit mutation
  const submitMutation = useMutation({
    mutationFn: () => {
      const formatted = questions.map((_, idx) => ({
        questionId: questions[idx]._id,
        selectedOption: answers[idx] ?? null,
      }));
      return quizApi.submit(quizId, formatted);
    },
    onSuccess: () => {
      setSubmitted(true);
      navigate(`/quizzes/${quizId}/result`);
    },
    onError: () => {
      toast.error("Failed to submit quiz. Please try again.");
    },
  });

  const handleSelect = (optionIndex) => {
    setAnswers((prev) => ({ ...prev, [current]: optionIndex }));
  };

  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = current === questions.length - 1;

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader />
      </div>
    );
  }

  // ── Error ──
  if (isError || !questions.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 flex flex-col items-center gap-4 text-center text-muted-foreground">
        <AlertCircle className="size-12 text-destructive opacity-70" />
        <p className="text-lg font-medium">Could not load this quiz.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-foreground">{quiz.title}</h1>
          <p className="text-sm text-muted-foreground">
            Question {current + 1} of {questions.length}
          </p>
        </div>

        {totalSeconds && (
          <div
            className={[
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold tabular-nums",
              remaining <= 60
                ? "border-destructive/50 text-destructive bg-destructive/10"
                : "border-border text-foreground bg-card",
            ].join(" ")}
          >
            <Clock className="size-4" />
            {timerLabel}
          </div>
        )}
      </div>

      {/* ── Progress bar ── */}
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* ── Question card ── */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
        <p className="text-base font-semibold leading-relaxed text-foreground">
          {q.question ?? q.text ?? q.content}
        </p>

        <div className="flex flex-col gap-2.5">
          {(q.options ?? []).map((opt, i) => (
            <OptionButton
              key={i}
              text={typeof opt === "string" ? opt : opt.text ?? opt.label}
              selected={answers[current] === i}
              onSelect={() => handleSelect(i)}
            />
          ))}
        </div>
      </div>

      {/* ── Question navigator dots ── */}
      <ProgressDots
        total={questions.length}
        current={current}
        answers={answers}
      />

      {/* ── Navigation + Submit ── */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          disabled={current === 0}
          onClick={() => setCurrent((p) => p - 1)}
          className="gap-1"
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>

        <Badge variant="secondary" className="hidden sm:inline-flex">
          {answeredCount}/{questions.length} answered
        </Badge>

        {isLastQuestion ? (
          <Button
            id="submit-quiz-btn"
            onClick={() => submitMutation.mutate()}
            disabled={submitMutation.isPending || submitted}
            className="gap-1.5"
          >
            <Send className="size-4" />
            {submitMutation.isPending ? "Submitting…" : "Submit Quiz"}
          </Button>
        ) : (
          <Button
            onClick={() => setCurrent((p) => p + 1)}
            className="gap-1"
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizTakePage;
