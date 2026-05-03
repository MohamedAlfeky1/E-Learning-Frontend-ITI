import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ExternalLink,
  Star,
  Download,
} from "lucide-react";

const getFileUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  let normalizedPath = path.replace(/\\/g, "/");
  return `https://e-learning-platform-api-production.up.railway.app/${normalizedPath}`;
};
import { useSubmissions } from "@/queries/assignmentQueries";
import { useGradeSubmission } from "@/mutations/assignmentMutations";
import { toast } from "sonner";

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Clock,
  },
  late: {
    label: "Late",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: AlertCircle,
  },
  graded: {
    label: "Graded",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
};

const GradeAssignmentPage = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useSubmissions(assignmentId);
  const gradeMutation = useGradeSubmission();

  const [gradeDialog, setGradeDialog] = useState(null);
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");

  const submissions = data?.data?.submissions || [];

  const handleOpenGrade = (submission) => {
    setGradeDialog(submission);
    setScore(submission.score != null ? String(submission.score) : "");
    setFeedback(submission.feedback || "");
  };

  const handleSubmitGrade = (e) => {
    e.preventDefault();
    if (!score || isNaN(Number(score))) {
      toast.error("Please enter a valid score");
      return;
    }

    gradeMutation.mutate(
      {
        assignmentId,
        sid: gradeDialog._id,
        data: {
          score: Number(score),
          feedback: feedback || undefined,
        },
      },
      {
        onSuccess: () => {
          setGradeDialog(null);
          setScore("");
          setFeedback("");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-[1000px] mx-auto w-full mt-4">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 mt-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl h-10 w-10"
          onClick={() => navigate("/teacher/assignments")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-1">
            Assignment Grading
          </p>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Student Submissions
          </h1>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="p-4 border-0 shadow-sm text-center">
          <p className="text-3xl font-bold text-gray-900">
            {submissions.length}
          </p>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
            Total
          </p>
        </Card>
        <Card className="p-4 border-0 shadow-sm text-center">
          <p className="text-3xl font-bold text-amber-600">
            {submissions.filter((s) => s.status === "pending" || s.status === "late").length}
          </p>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
            Pending
          </p>
        </Card>
        <Card className="p-4 border-0 shadow-sm text-center">
          <p className="text-3xl font-bold text-emerald-600">
            {submissions.filter((s) => s.status === "graded").length}
          </p>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
            Graded
          </p>
        </Card>
      </div>

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <Card className="p-12 text-center border-0 shadow-sm">
          <div className="size-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No Submissions Yet
          </h3>
          <p className="text-gray-500 text-sm">
            Students haven't submitted their work for this assignment yet.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {submissions.map((submission) => {
            const config = statusConfig[submission.status] || statusConfig.pending;
            const StatusIcon = config.icon;

            return (
              <Card
                key={submission._id}
                className="p-5 border-0 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Student Info */}
                  <div className="flex items-center gap-4">
                    <div className="size-11 rounded-full bg-indigo-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {submission.studentId?.name ||
                          submission.studentId?.email ||
                          "Unknown Student"}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {submission.studentId?.email || ""}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Submission Content */}
                    <div className="flex gap-2">
                      {submission.submissionUrl && (
                        <a
                          href={submission.submissionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Link
                        </a>
                      )}
                      {submission.submissionText && (
                        <Badge variant="secondary" className="text-xs">
                          <FileText className="w-3 h-3 mr-1" />
                          Text
                        </Badge>
                      )}
                      {submission.attachments && submission.attachments.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          <Download className="w-3 h-3 mr-1" />
                          {submission.attachments.length} {submission.attachments.length === 1 ? 'File' : 'Files'}
                        </Badge>
                      )}
                    </div>

                    {/* Status */}
                    <Badge className={`${config.color} border`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {config.label}
                    </Badge>

                    {/* Score */}
                    {submission.status === "graded" && (
                      <Badge className="bg-indigo-100 text-indigo-700 border border-indigo-200">
                        <Star className="w-3 h-3 mr-1" />
                        {submission.score} pts
                      </Badge>
                    )}

                    {/* Date */}
                    <span className="text-xs text-gray-400">
                      {new Date(submission.submittedAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>

                  {/* Grade Button */}
                  <Button
                    variant="secondary"
                    className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg h-9 text-sm font-medium px-5 shrink-0"
                    onClick={() => handleOpenGrade(submission)}
                  >
                    {submission.status === "graded" ? "Update Grade" : "Grade"}
                  </Button>
                </div>

                {/* Submission Text & Attachments Preview */}
                {(submission.submissionText || (submission.attachments && submission.attachments.length > 0)) && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-2">
                    {submission.attachments && submission.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {submission.attachments.map((attachment, idx) => {
                          const url = getFileUrl(attachment);
                          const filename = attachment.split(/[\/\\]/).pop();
                          return (
                            <a
                              key={idx}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-md border border-gray-200 transition-colors"
                              download
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span className="max-w-[150px] truncate">{filename}</span>
                            </a>
                          );
                        })}
                      </div>
                    )}
                    {submission.submissionText && (
                      <div className="text-sm text-gray-700 max-h-24 overflow-y-auto">
                        {submission.submissionText}
                      </div>
                    )}
                  </div>
                )}

                {/* Existing Feedback */}
                {submission.feedback && (
                  <div className="mt-2 p-3 bg-emerald-50 rounded-lg text-sm text-emerald-800">
                    <span className="font-semibold">Your Feedback: </span>
                    {submission.feedback}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Grade Dialog */}
      <Dialog open={!!gradeDialog} onOpenChange={() => setGradeDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Grade Submission</DialogTitle>
            <DialogDescription>
              Assign a score and optional feedback for{" "}
              <span className="font-medium text-gray-900">
                {gradeDialog?.studentId?.name || "this student"}
              </span>.
            </DialogDescription>
          </DialogHeader>

          {/* Submission Preview in Dialog */}
          {gradeDialog && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Student's Submission
              </h4>
              
              {gradeDialog.submissionUrl && (
                <div>
                  <a
                    href={gradeDialog.submissionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {gradeDialog.submissionUrl}
                  </a>
                </div>
              )}

              {gradeDialog.attachments && gradeDialog.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {gradeDialog.attachments.map((attachment, idx) => {
                    const url = getFileUrl(attachment);
                    const filename = attachment.split(/[\/\\]/).pop();
                    return (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-md border border-gray-200 transition-colors"
                        download
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="max-w-[150px] truncate">{filename}</span>
                      </a>
                    );
                  })}
                </div>
              )}

              {gradeDialog.submissionText && (
                <div className="text-sm text-gray-700 bg-white p-3 rounded-md border border-gray-200 max-h-32 overflow-y-auto">
                  {gradeDialog.submissionText}
                </div>
              )}

              {!gradeDialog.submissionUrl && !gradeDialog.submissionText && (!gradeDialog.attachments || gradeDialog.attachments.length === 0) && (
                <p className="text-sm text-gray-500 italic">No submission content provided.</p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmitGrade} className="space-y-4 mt-2">
            <div>
              <Label htmlFor="score">Score *</Label>
              <Input
                id="score"
                type="number"
                min="0"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="Enter score"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="feedback">Feedback (optional)</Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide feedback to the student..."
                className="mt-1 min-h-[80px]"
              />
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={gradeMutation.isPending}
              >
                {gradeMutation.isPending ? "Saving..." : "Save Grade"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GradeAssignmentPage;
