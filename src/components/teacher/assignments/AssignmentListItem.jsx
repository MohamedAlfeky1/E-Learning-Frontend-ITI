import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, FlaskConical, PenTool, LayoutTemplate } from "lucide-react";
import { cn } from "@/lib/utils";

const IconMap = {
  document: FileText,
  flask: FlaskConical,
  quiz: PenTool,
  code: LayoutTemplate,
};

const IconColors = {
  purple: "bg-purple-100 text-purple-600",
  indigo: "bg-indigo-100 text-indigo-600",
  green: "bg-emerald-100 text-emerald-600",
};

const AssignmentListItem = ({ assignment }) => {
  const {
    name,
    module,
    courseCode,
    dueDate,
    relativeDueDate,
    statusColor, // 'red' or 'green' or 'gray'
    pendingReview,
    graded,
    iconType,
    iconColorType,
  } = assignment;

  const Icon = IconMap[iconType] || FileText;
  const iconColorClass = IconColors[iconColorType] || IconColors.indigo;
  const total = pendingReview + graded;
  const gradedPercentage = total === 0 ? 0 : (graded / total) * 100;

  const isCompleted = pendingReview === 0 && graded > 0;

  return (
    <div className="grid grid-cols-12 gap-4 items-center py-5 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-2 rounded-lg -mx-2 group">
      {/* Icon & Name - Span 4 */}
      <div className="col-span-12 md:col-span-4 flex items-center gap-4">
        <div className={cn("size-12 rounded-xl flex items-center justify-center shrink-0", iconColorClass)}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{name}</h4>
          <p className="text-sm text-gray-500 line-clamp-1">{module}</p>
        </div>
      </div>

      {/* Course - Span 2 */}
      <div className="col-span-6 md:col-span-2 hidden md:flex items-center">
        <div className="size-12 rounded-full bg-gray-100 flex items-center justify-center text-center leading-tight">
          <span className="text-[10px] font-bold text-gray-600 max-w-full px-1 truncate break-words whitespace-pre-wrap">{courseCode.split('-').join('-\n')}</span>
        </div>
      </div>

      {/* Due Date - Span 2 */}
      <div className="col-span-6 md:col-span-2 hidden md:block">
        <p className="font-semibold text-gray-900">{dueDate}</p>
        <p className={cn(
          "text-[11px] font-bold uppercase tracking-wider mt-0.5",
          statusColor === "red" ? "text-red-600" : statusColor === "green" ? "text-emerald-600" : "text-gray-500"
        )}>
          {relativeDueDate}
        </p>
      </div>

      {/* Submission Status - Span 2 */}
      <div className="col-span-8 md:col-span-2">
        <div className="flex items-end justify-between mb-2">
          <div>
             <span className={cn(
               "text-xs font-bold block",
               pendingReview > 0 ? "text-indigo-600" : "text-emerald-600"
             )}>{pendingReview} Pending Review</span>
          </div>
          <div className="text-right">
             <span className="text-xs font-semibold text-gray-400 block">{graded}<br/>Graded</span>
          </div>
        </div>
        <Progress 
           value={gradedPercentage} 
           className={cn(
             "h-1.5", 
             pendingReview === 0 && graded > 0 ? "[&>div]:bg-emerald-600 bg-emerald-100" : "[&>div]:bg-indigo-600 bg-indigo-50"
           )} 
        />
      </div>

      {/* Action - Span 2 */}
      <div className="col-span-4 md:col-span-2 flex justify-end">
        {isCompleted ? (
          <Button variant="secondary" className="bg-gray-100 text-gray-500 hover:bg-gray-200 pointer-events-none rounded-lg h-9 text-sm font-medium px-4">
            All Graded
          </Button>
        ) : (
          <Button variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg h-9 text-sm font-medium px-4">
            Grade Submissions
          </Button>
        )}
      </div>
    </div>
  );
};

export default AssignmentListItem;
