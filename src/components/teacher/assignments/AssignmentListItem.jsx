import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Calendar,
  Trash2,
  Edit,
  Eye,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const AssignmentListItem = ({
  assignment,
  onDelete,
  onEdit,
  submissionCounts,
}) => {
  const navigate = useNavigate();

  const { _id, title, description, dueDate, maxScore, courseId } = assignment;

  // Calculate due date status
  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  let relativeDueDate = "";
  let statusColor = "gray";

  if (diffMs < 0) {
    relativeDueDate = "PAST DUE";
    statusColor = "red";
  } else if (diffDays === 0) {
    relativeDueDate = "DUE TODAY";
    statusColor = "red";
  } else if (diffDays <= 3) {
    relativeDueDate = `IN ${diffDays} DAY${diffDays > 1 ? "S" : ""}`;
    statusColor = "red";
  } else {
    relativeDueDate = `IN ${diffDays} DAYS`;
    statusColor = "gray";
  }

  const pendingReview = submissionCounts?.pending || 0;
  const graded = submissionCounts?.graded || 0;
  const total = pendingReview + graded;
  const gradedPercentage = total === 0 ? 0 : (graded / total) * 100;
  const isCompleted = total > 0 && pendingReview === 0;

  const formattedDate = due.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="grid grid-cols-12 gap-4 items-center py-5 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-2 rounded-lg -mx-2 group">
      {/* Icon & Name - Span 4 */}
      <div className="col-span-12 md:col-span-4 flex items-center gap-4">
        <div className="size-12 rounded-xl flex items-center justify-center shrink-0 bg-indigo-100 text-indigo-600">
          <FileText className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {title}
          </h4>
          <p className="text-sm text-gray-500 line-clamp-1">
            {description || "No description"}
          </p>
        </div>
      </div>

      {/* Max Score - Span 1 */}
      <div className="col-span-6 md:col-span-1 hidden md:flex items-center">
        <Badge
          variant="secondary"
          className="bg-gray-100 text-gray-600 font-semibold"
        >
          {maxScore} pts
        </Badge>
      </div>

      {/* Due Date - Span 2 */}
      <div className="col-span-6 md:col-span-2 hidden md:block">
        <p className="font-semibold text-gray-900 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          {formattedDate}
        </p>
        <p
          className={cn(
            "text-[11px] font-bold uppercase tracking-wider mt-0.5",
            statusColor === "red"
              ? "text-red-600"
              : statusColor === "green"
                ? "text-emerald-600"
                : "text-gray-500",
          )}
        >
          {relativeDueDate}
        </p>
      </div>

      {/* Submission Status - Span 2 */}
      <div className="col-span-8 md:col-span-2">
        <div className="flex items-end justify-between mb-2">
          <div>
            <span
              className={cn(
                "text-xs font-bold block",
                pendingReview > 0 ? "text-indigo-600" : "text-emerald-600",
              )}
            >
              {pendingReview} Pending
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-gray-400 block">
              {graded} Graded
            </span>
          </div>
        </div>
        <Progress
          value={gradedPercentage}
          className={cn(
            "h-1.5",
            isCompleted
              ? "[&>div]:bg-emerald-600 bg-emerald-100"
              : "[&>div]:bg-indigo-600 bg-indigo-50",
          )}
        />
      </div>

      {/* Actions - Span 3 */}
      <div className="col-span-4 md:col-span-3 flex justify-end gap-2">
        {total > 0 ? (
          <Button
            variant="secondary"
            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg h-9 text-sm font-medium px-4"
            onClick={() => navigate(`/teacher/assignments/${_id}/grade`)}
          >
            <Eye className="w-4 h-4 mr-1.5" />
            {isCompleted ? "View" : "Grade"}
          </Button>
        ) : (
          <Button
            variant="secondary"
            className="bg-gray-100 text-gray-500 rounded-lg h-9 text-sm font-medium px-4"
            onClick={() => navigate(`/teacher/assignments/${_id}/grade`)}
          >
            View Submissions
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-gray-400 hover:text-indigo-600"
          onClick={() => onEdit?.(assignment)}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-gray-400 hover:text-red-600"
          onClick={() => onDelete?.(_id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default AssignmentListItem;
