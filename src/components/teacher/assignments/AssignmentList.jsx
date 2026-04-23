import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AssignmentListItem from "./AssignmentListItem";
import { FileX } from "lucide-react";

const AssignmentList = ({
  assignments,
  isLoading,
  onDelete,
  onEdit,
}) => {
  if (isLoading) {
    return (
      <Card className="p-0 overflow-hidden border-gray-100 shadow-sm mt-6">
        <div className="p-6 pb-4 border-b border-gray-100">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="p-6 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-9 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!assignments || assignments.length === 0) {
    return (
      <Card className="p-0 overflow-hidden border-gray-100 shadow-sm mt-6">
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="size-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <FileX className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No Assignments Yet
          </h3>
          <p className="text-gray-500 text-sm max-w-sm">
            Create your first assignment using the button above to get started.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0 overflow-hidden border-gray-100 shadow-sm mt-6">
      <div className="p-6 pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900">
          Active Assignments{" "}
          <span className="text-gray-400 font-normal text-base">
            ({assignments.length})
          </span>
        </h2>
      </div>

      {/* Header Row */}
      <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50 hidden md:grid grid-cols-12 gap-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
        <div className="col-span-4">Assignment Name</div>
        <div className="col-span-1 text-center">Points</div>
        <div className="col-span-2">Due Date</div>
        <div className="col-span-2">Submissions</div>
        <div className="col-span-3 text-right pr-4">Actions</div>
      </div>

      {/* List */}
      <div className="p-6 pt-2">
        {assignments.map((assignment) => (
          <AssignmentListItem
            key={assignment._id}
            assignment={assignment}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </Card>
  );
};

export default AssignmentList;
