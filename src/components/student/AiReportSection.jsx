import React, { useState, useEffect } from "react";
import { useAiReportQuery, useGenerateAiReportMutation } from "@/queries/aiReportQueries";
import { Button } from "@/components/ui/button";
import { MdOutlineAutoGraph, MdWarningAmber, MdCheckCircleOutline } from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const AiReportSection = ({ enrollments }) => {
  const validEnrollments = enrollments?.filter((enr) => enr?.courseId) || [];

  const [selectedCourseId, setSelectedCourseId] = useState(
    validEnrollments.length > 0 ? validEnrollments[0].courseId._id : null
  );

  const [isPolling, setIsPolling] = useState(false);
  const [lastReportId, setLastReportId] = useState(null);

  const { data: reportResponse, isLoading, isError, refetch } = useAiReportQuery(selectedCourseId, {
    refetchInterval: isPolling ? 3000 : false,
  });
  const { mutate: generateReport, isPending: isGenerating } = useGenerateAiReportMutation();

  const reportData = reportResponse?.data?.reportData;

  useEffect(() => {
    if (isPolling && reportResponse?.data?._id && reportResponse?.data?._id !== lastReportId) {
      setIsPolling(false);
    }
  }, [reportResponse, isPolling, lastReportId]);

  useEffect(() => {
    setIsPolling(false);
  }, [selectedCourseId]);

  const handleGenerate = () => {
    if (selectedCourseId) {
      setLastReportId(reportResponse?.data?._id || null);
      generateReport(selectedCourseId, {
        onSuccess: () => {
          setIsPolling(true);
        }
      });
    }
  };

  if (validEnrollments.length === 0) return null;

  return (
    <div className="bg-[var(--secondary)] rounded-xl p-6 flex flex-col gap-5 border border-[var(--border)] shadow-sm relative overflow-hidden z-0">
      {/* Decorative gradient blur */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--primary)]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-10">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-[var(--foreground)]">
            <HiSparkles className="text-[var(--primary)]" size={24} />
            AI Performance Report
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Get personalized insights and recommendations based on your progress.
          </p>
        </div>

        <div className="w-full sm:w-auto">
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger className="w-full sm:w-[220px] bg-[var(--background)]">
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent>
              {validEnrollments.map((enr) => (
                <SelectItem key={enr.courseId._id} value={enr.courseId._id}>
                  {enr.courseId.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="z-10 mt-2">
        {isLoading || isGenerating || isPolling ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
            <p className="text-sm text-[var(--muted-foreground)] animate-pulse">
              {isGenerating || isPolling ? "Generating your new AI report..." : "Analyzing your performance..."}
            </p>
          </div>
        ) : isError || !reportData ? (
          <div className="bg-[var(--card)] rounded-xl p-8 border border-dashed border-[var(--border)] flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
              <MdOutlineAutoGraph size={32} />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--foreground)] mb-1">No AI Report Found</h3>
              <p className="text-sm text-[var(--muted-foreground)] max-w-sm mx-auto">
                Generate a comprehensive AI report to get insights on your strengths, weaknesses, and a personalized learning plan.
              </p>
            </div>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="mt-2 bg-gradient-to-r from-[var(--primary)] to-purple-600 hover:opacity-90 text-white border-0 shadow-md transition-all group"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Generating...
                </>
              ) : (
                <>
                  <HiSparkles className="mr-2 group-hover:animate-pulse" size={18} />
                  Generate AI Report
                </>
              )}
            </Button>
            <Button variant="link" size="sm" onClick={() => refetch()} className="text-[var(--muted-foreground)]">
              Refresh
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Overall Score */}
            <div className="col-span-1 md:col-span-3 lg:col-span-1 bg-[var(--card)] rounded-xl p-5 border border-[var(--border)] flex flex-col items-center justify-center gap-2 shadow-sm">
              <h3 className="text-sm font-medium text-[var(--muted-foreground)] uppercase tracking-wider">Overall Score</h3>
              <div className="relative flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-[var(--muted)]"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={351.858}
                    strokeDashoffset={351.858 - (351.858 * reportData.overallPerformance) / 100}
                    className="text-[var(--primary)] transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-[var(--foreground)]">{reportData.overallPerformance}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-xs font-medium text-[var(--muted-foreground)]">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                  Performance
                </span>
              </div>
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="mt-4 w-full text-xs"
              >
                {isGenerating ? <Loader2 className="animate-spin mr-2" size={14} /> : <HiSparkles className="mr-2" size={14} />}
                Regenerate Report
              </Button>
            </div>

            {/* Details */}
            <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Strengths */}
              <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)] shadow-sm">
                <h3 className="text-sm font-bold flex items-center gap-2 text-[var(--foreground)] mb-4">
                  <MdCheckCircleOutline className="text-green-500" size={18} />
                  Your Strengths
                </h3>
                <ul className="flex flex-col gap-2">
                  {reportData.strengths?.length > 0 ? (
                    reportData.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-[var(--muted-foreground)] flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        <span>{s}</span>
                      </li>
                    ))
                  ) : (
                    <p className="text-sm text-[var(--muted-foreground)] italic">Not enough data to determine strengths.</p>
                  )}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)] shadow-sm">
                <h3 className="text-sm font-bold flex items-center gap-2 text-[var(--foreground)] mb-4">
                  <MdWarningAmber className="text-orange-500" size={18} />
                  Areas for Improvement
                </h3>
                <ul className="flex flex-col gap-2">
                  {reportData.weaknesses?.length > 0 ? (
                    reportData.weaknesses.map((w, i) => (
                      <li key={i} className="text-sm text-[var(--muted-foreground)] flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">•</span>
                        <span>{w}</span>
                      </li>
                    ))
                  ) : (
                    <p className="text-sm text-[var(--muted-foreground)] italic">Not enough data to determine areas for improvement.</p>
                  )}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="sm:col-span-2 bg-[var(--primary)]/5 rounded-xl p-5 border border-[var(--primary)]/20 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/10 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-sm font-bold flex items-center gap-2 text-[var(--foreground)] mb-3 relative z-10">
                  <HiSparkles className="text-[var(--primary)]" size={18} />
                  AI Recommendations
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
                  {reportData.recommendations?.length > 0 ? (
                    reportData.recommendations.map((r, i) => (
                      <div key={i} className="bg-[var(--background)] p-3 rounded-lg border border-[var(--border)] flex items-start gap-3">
                        <div className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-sm text-[var(--muted-foreground)]">{r}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[var(--muted-foreground)] italic">Not enough data for recommendations.</p>
                  )}
                </div>
              </div>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiReportSection;
