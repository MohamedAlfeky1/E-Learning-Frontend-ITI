import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Calendar,
  FileText,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Star,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllCoursesOfUser } from "@/services/enrollmentService";
import { useAssignments } from "@/queries/assignmentQueries";
import { useMyCourseGrades } from "@/queries/assignmentQueries";
import { useSubmitAssignment } from "@/mutations/assignmentMutations";
import { toast } from "sonner";

const statusConfig = {
  pending: {
    label: "Pending Review",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Clock,
  },
  late: {
    label: "Late Submission",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: AlertCircle,
  },
  graded: {
    label: "Graded",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
};

const StudentAssignmentsPage = () => {
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [submitDialog, setSubmitDialog] = useState(null);
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [submissionText, setSubmissionText] = useState("");

  // Fetch enrolled courses
  const { data: enrolledData, isLoading: enrolledLoading } = useQuery({
    queryKey: ["myEnrolledCourses"],
    queryFn: getAllCoursesOfUser,
  });

  // Fetch assignments for selected course
  const { data: assignmentsData, isLoading: assignmentsLoading } =
    useAssignments(selectedCourseId);

  // Fetch grades for selected course
  const { data: gradesData } = useMyCourseGrades(selectedCourseId);

  const submitMutation = useSubmitAssignment();

  const courses = enrolledData?.data || [];
  const assignments = assignmentsData?.data?.assignments || [];
  const grades = gradesData?.data?.grades || [];

  // Build a lookup: assignmentId -> grade info
  const gradeMap = {};
  grades.forEach((g) => {
    if (g.assignmentId) {
      gradeMap[g.assignmentId._id || g.assignmentId] = g;
    }
  });

  const handleOpenSubmit = (assignment) => {
    if (gradeMap[assignment._id]) {
      toast.info("You have already submitted this assignment");
      return;
    }
    setSubmitDialog(assignment);
    setSubmissionUrl("");
    setSubmissionText("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!submissionUrl && !submissionText) {
      toast.error("Please provide a URL or text for your submission");
      return;
    }

    submitMutation.mutate(
      {
        assignmentId: submitDialog._id,
        data: {
          submissionUrl: submissionUrl || undefined,
          submissionText: submissionText || undefined,
        },
      },
      {
        onSuccess: () => {
          setSubmitDialog(null);
        },
      }
    );
  };

  return (
    <div className="max-w-[1000px] mx-auto w-full">
      {/* Header */}
      <div className="mb-8 mt-4">
        <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">
          My Learning
        </p>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
          Assignments
        </h1>
        <p className="text-gray-500 text-lg">
          View assignments, submit your work, and track your grades.
        </p>
      </div>

      {/* Course Selector */}
      <div className="mb-8">
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">
          Select Course
        </Label>
        <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
          <SelectTrigger className="w-full md:w-80 h-12 rounded-xl border-gray-200 bg-white text-base">
            <SelectValue
              placeholder={
                enrolledLoading
                  ? "Loading courses..."
                  : "Choose an enrolled course"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {courses.map((enrollment) => (
              <SelectItem
                key={enrollment.courseId?._id || enrollment._id}
                value={enrollment.courseId?._id || enrollment._id}
              >
                {enrollment.courseId?.title || enrollment.title || "Course"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {!selectedCourseId ? (
        <div className="flex flex-col items-center justify-center text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="size-20 rounded-2xl bg-indigo-50 flex items-center justify-center mb-5">
            <GraduationCap className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Select a Course
          </h3>
          <p className="text-gray-500 max-w-sm">
            Choose one of your enrolled courses to view its assignments.
          </p>
        </div>
      ) : assignmentsLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : assignments.length === 0 ? (
        <Card className="p-12 text-center border-0 shadow-sm">
          <div className="size-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No Assignments
          </h3>
          <p className="text-gray-500 text-sm">
            There are no assignments for this course yet.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => {
            const myGrade = gradeMap[assignment._id];
            const now = new Date();
            const due = new Date(assignment.dueDate);
            const isPastDue = due < now;
            const hasSubmitted = !!myGrade;
            const config = myGrade
              ? statusConfig[myGrade.status] || statusConfig.pending
              : null;

            return (
              <Card
                key={assignment._id}
                className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Assignment Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="size-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">
                        {assignment.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                        {assignment.description}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                          <Calendar className="w-3.5 h-3.5" />
                          Due:{" "}
                          {due.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-600 text-xs"
                        >
                          Max: {assignment.maxScore} pts
                        </Badge>
                        {isPastDue && !hasSubmitted && (
                          <Badge className="bg-red-100 text-red-700 border border-red-200 text-xs">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Past Due
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status / Action */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {hasSubmitted ? (
                      <>
                        <Badge className={`${config.color} border`}>
                          {React.createElement(config.icon, {
                            className: "w-3 h-3 mr-1",
                          })}
                          {config.label}
                        </Badge>
                        {myGrade.status === "graded" && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="text-lg font-bold text-gray-900">
                              {myGrade.score}
                            </span>
                            <span className="text-sm text-gray-400">
                              / {assignment.maxScore}
                            </span>
                          </div>
                        )}
                        {myGrade.feedback && (
                          <p className="text-xs text-gray-500 mt-1 max-w-[200px] text-right">
                            "{myGrade.feedback}"
                          </p>
                        )}
                      </>
                    ) : (
                      <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-10 px-5 font-semibold"
                        onClick={() => handleOpenSubmit(assignment)}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Submit
                      </Button>
                    )}
                  </div>
                </div>

                {/* Submission details if submitted */}
                {myGrade && (myGrade.submissionUrl || myGrade.submissionText) && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Your Submission
                    </p>
                    {myGrade.submissionUrl && (
                      <a
                        href={myGrade.submissionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {myGrade.submissionUrl}
                      </a>
                    )}
                    {myGrade.submissionText && (
                      <p className="text-sm text-gray-700 mt-1 line-clamp-3">
                        {myGrade.submissionText}
                      </p>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Submit Dialog */}
      <Dialog open={!!submitDialog} onOpenChange={() => setSubmitDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
            <DialogDescription>
              Submit your work for{" "}
              <span className="font-medium text-gray-900">
                {submitDialog?.title}
              </span>
              . You can provide a URL, text, or both.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <Label htmlFor="submissionUrl">Submission URL</Label>
              <Input
                id="submissionUrl"
                type="url"
                value={submissionUrl}
                onChange={(e) => setSubmissionUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="submissionText">Submission Text</Label>
              <Textarea
                id="submissionText"
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Type your answer or additional notes..."
                className="mt-1 min-h-[100px]"
              />
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentAssignmentsPage;
