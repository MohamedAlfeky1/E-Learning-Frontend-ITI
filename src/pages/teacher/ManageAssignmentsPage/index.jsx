import React from "react";
import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";
import { ClipboardList, Sparkles } from "lucide-react";
import AssignmentStatsCard from "@/components/teacher/assignments/AssignmentStatsCard";
import QuickActionCard from "@/components/teacher/assignments/QuickActionCard";
import AssignmentList from "@/components/teacher/assignments/AssignmentList";
import FocusBanner from "@/components/teacher/assignments/FocusBanner";

const mockAssignments = [
  {
    id: 1,
    name: "Advanced Calculus Review",
    module: "Module 4: Integration",
    courseCode: "MAT-402",
    dueDate: "Oct 24, 2023",
    relativeDueDate: "IN 2 DAYS",
    statusColor: "red",
    pendingReview: 12,
    graded: 45,
    iconType: "document",
    iconColorType: "indigo",
  },
  {
    id: 2,
    name: "Quantum Mechanics Essay",
    module: "Final Term Paper",
    courseCode: "PHY-510",
    dueDate: "Nov 02, 2023",
    relativeDueDate: "IN 11 DAYS",
    statusColor: "gray",
    pendingReview: 5,
    graded: 22,
    iconType: "flask",
    iconColorType: "purple",
  },
  {
    id: 3,
    name: "Late Medieval History Quiz",
    module: "Module 2 Assessment",
    courseCode: "HIS-202",
    dueDate: "Oct 20, 2023",
    relativeDueDate: "COMPLETED",
    statusColor: "green",
    pendingReview: 0,
    graded: 68,
    iconType: "quiz",
    iconColorType: "green",
  },
  {
    id: 4,
    name: "Data Structures: Linked Lists",
    module: "Practical Lab 3",
    courseCode: "CS-301",
    dueDate: "Oct 28, 2023",
    relativeDueDate: "IN 6 DAYS",
    statusColor: "gray",
    pendingReview: 32,
    graded: 12,
    iconType: "code",
    iconColorType: "indigo",
  },
];

const ManageAssignmentsPage = () => {
  return (
    <div className="max-w-[1200px] mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 mt-4">
        <div className="max-w-xl">
          <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">
            Management Dashboard
          </p>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            Assignments
          </h1>
          <p className="text-gray-500 text-lg">
            Track, review, and grade student submissions across all active
            courses.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start">
          <Button
            variant="secondary"
            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-0 h-12 px-6 rounded-xl font-semibold"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filter View
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white border-0 h-12 px-6 rounded-xl font-semibold shadow-sm shadow-indigo-200">
            <Plus className="w-5 h-5 mr-2" />
            New Assignment
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <AssignmentStatsCard
          title="Pending Review"
          count="84"
          icon={ClipboardList}
          iconColor="text-indigo-600 bg-indigo-50"
          className="md:col-span-1 shadow-sm border-0"
        />
        <AssignmentStatsCard
          title="Due Today"
          count="12"
          icon={Sparkles}
          iconColor="text-purple-600 bg-purple-50"
          className="md:col-span-1 shadow-sm border-0"
        />
      </div>

      {/* Assignment List */}
      <AssignmentList assignments={mockAssignments} />
    </div>
  );
};

export default ManageAssignmentsPage;
