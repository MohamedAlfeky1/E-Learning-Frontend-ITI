import React from "react";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import AssignmentListItem from "./AssignmentListItem";

const AssignmentList = ({ assignments }) => {
  return (
    <Card className="p-0 overflow-hidden border-gray-100 shadow-sm mt-6">
      <div className="p-6 pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900">Active Assignments</h2>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span className="text-sm font-semibold text-gray-400">
              High Priority
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span className="text-sm font-semibold text-gray-400">
              Standard
            </span>
          </div>
        </div>
      </div>

      {/* Header Row */}
      <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50 hidden md:grid grid-cols-12 gap-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
        <div className="col-span-4">Assignment Name</div>
        <div className="col-span-2 text-center">Course</div>
        <div className="col-span-2">Due Date</div>
        <div className="col-span-2">Submission Status</div>
        <div className="col-span-2 text-right pr-4">Action</div>
      </div>

      {/* List */}
      <div className="p-6 pt-2">
        {assignments.map((assignment) => (
          <AssignmentListItem key={assignment.id} assignment={assignment} />
        ))}
      </div>

      {/* Pagination Container */}
      <div className="p-6 pt-4 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Showing 1-10 of 24 Assignments
        </span>

        <Pagination className="w-auto mx-0">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                className="w-9 h-9 p-0"
                aria-label="Previous page"
              >
                <span className="sr-only">Previous page</span>
              </PaginationPrevious>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                isActive
                className="w-9 h-9 bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white border-0"
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                className="w-9 h-9 border border-gray-200"
              >
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                className="w-9 h-9 border border-gray-200"
              >
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                className="w-9 h-9 p-0"
                aria-label="Next page"
              >
                <span className="sr-only">Next page</span>
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </Card>
  );
};

export default AssignmentList;
