import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { quizApi } from "@/api/quizApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Users,
  Trophy,
  TrendingUp,
  TrendingDown,
  BarChart3,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
} from "lucide-react";

const StatCard = ({ title, value, icon, colorClass, subtext }) => (
  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-start gap-4">
    <div className={`p-3 rounded-xl ${colorClass}`}>{icon}</div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
      <p className="text-3xl font-black text-slate-800">{value}</p>
      {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
    </div>
  </div>
);

const ReviewStudentAnswersPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["teacher-quiz-results", quizId],
    queryFn: () => quizApi.getTeacherResults(quizId).then((r) => r.data),
  });

  const raw = data?.data ?? {};
  const quiz = raw.quiz ?? {};
  const stats = raw.stats ?? {};
  const results = raw.results ?? [];

  if (isLoading) {
    return (
      <div className="p-8 bg-slate-50 min-h-screen space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-700 mb-2">Failed to load results</h2>
          <p className="text-slate-400 mb-4">Something went wrong fetching quiz data.</p>
          <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const passRate = stats.totalSubmissions > 0
    ? Math.round((stats.passedCount / stats.totalSubmissions) * 100)
    : 0;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          className="mb-4 text-slate-500 hover:text-slate-800 -ml-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Quizzes
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
              Quiz Analytics
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-1">{quiz.title || "Quiz Results"}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <Badge className="bg-indigo-50 text-indigo-700 font-semibold">
                <FileText className="w-3 h-3 mr-1" />
                {quiz.totalQuestions ?? 0} Questions
              </Badge>
              <Badge className="bg-amber-50 text-amber-700 font-semibold">
                <Trophy className="w-3 h-3 mr-1" />
                Passing Score: {quiz.passingScore ?? 60}%
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        <StatCard
          title="Total Submissions"
          value={stats.totalSubmissions ?? 0}
          icon={<Users className="w-5 h-5 text-indigo-600" />}
          colorClass="bg-indigo-50"
          subtext="students attempted"
        />
        <StatCard
          title="Average Score"
          value={`${Math.round(stats.averageScore ?? 0)}%`}
          icon={<BarChart3 className="w-5 h-5 text-blue-600" />}
          colorClass="bg-blue-50"
          subtext={`Pass rate: ${passRate}%`}
        />
        <StatCard
          title="Passed"
          value={stats.passedCount ?? 0}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          colorClass="bg-emerald-50"
          subtext={`Highest: ${Math.round(stats.highestScore ?? 0)}%`}
        />
        <StatCard
          title="Failed"
          value={stats.failedCount ?? 0}
          icon={<XCircle className="w-5 h-5 text-red-500" />}
          colorClass="bg-red-50"
          subtext={`Lowest: ${Math.round(stats.lowestScore ?? 0)}%`}
        />
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-800">Student Submissions</h2>
          <span className="text-sm text-slate-400 font-medium">
            {results.length} {results.length === 1 ? "result" : "results"}
          </span>
        </div>

        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-600 mb-1">No submissions yet</h3>
            <p className="text-slate-400 max-w-sm">
              Once students complete this quiz, their results will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">
                    Student
                  </th>
                  <th className="text-left px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">
                    Score
                  </th>
                  <th className="text-left px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {results.map((result, idx) => {
                  const isPassed = result.isPassed ?? result.passed ?? result.score >= (quiz.passingScore ?? 60);
                  const studentName = result.student?.name ?? result.studentName ?? result.name ?? `Student ${idx + 1}`;
                  const studentEmail = result.student?.email ?? result.email ?? "";
                  const submittedAt = result.submittedAt ?? result.createdAt;

                  return (
                    <tr key={result._id ?? idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                            {studentName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{studentName}</p>
                            {studentEmail && (
                              <p className="text-xs text-slate-400">{studentEmail}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${isPassed ? "bg-emerald-500" : "bg-red-400"}`}
                              style={{ width: `${Math.min(result.score ?? 0, 100)}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-700">
                            {Math.round(result.score ?? 0)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isPassed ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Passed
                          </Badge>
                        ) : (
                          <Badge className="bg-red-50 text-red-600 border-red-100 gap-1">
                            <XCircle className="w-3 h-3" /> Failed
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {submittedAt
                          ? new Date(submittedAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewStudentAnswersPage;
