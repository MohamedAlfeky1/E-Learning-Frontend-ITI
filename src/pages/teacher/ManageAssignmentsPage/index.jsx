import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ClipboardList, Plus, BookOpen, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import AssignmentStatsCard from "@/components/teacher/assignments/AssignmentStatsCard";
import AssignmentList from "@/components/teacher/assignments/AssignmentList";
import { useTeacherCourses } from "@/queries/teacherCoursesQueries";
import { useAssignments } from "@/queries/assignmentQueries";
import {
  useCreateAssignment,
  useUpdateAssignment,
  useDeleteAssignment,
} from "@/mutations/assignmentMutations";
import { toast } from "sonner";

const ManageAssignmentsPage = () => {
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: null,
    maxScore: "100",
  });
  const [attachments, setAttachments] = useState(null);

  // Queries
  const { data: coursesData, isLoading: coursesLoading } = useTeacherCourses();
  const { data: assignmentsData, isLoading: assignmentsLoading } =
    useAssignments(selectedCourseId);

  // Mutations
  const createMutation = useCreateAssignment();
  const updateMutation = useUpdateAssignment();
  const deleteMutation = useDeleteAssignment();

  const courses = coursesData?.data || [];
  const assignments = assignmentsData?.data?.assignments || [];

  // Stats
  const totalAssignments = assignments.length;
  const dueSoon = assignments.filter((a) => {
    const diff = new Date(a.dueDate) - new Date();
    return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000;
  }).length;

  // Handlers
  const resetForm = () => {
    setFormData({ title: "", description: "", dueDate: null, maxScore: "100" });
    setAttachments(null);
    setEditingAssignment(null);
  };

  const handleOpenCreate = () => {
    if (!selectedCourseId) {
      toast.error("Please select a course first");
      return;
    }
    resetForm();
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate ? new Date(assignment.dueDate) : null,
      maxScore: String(assignment.maxScore || 100),
    });
    setIsCreateOpen(true);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const dueDateISO = formData.dueDate.toISOString();

    if (editingAssignment) {
      updateMutation.mutate(
        {
          id: editingAssignment._id,
          data: {
            title: formData.title,
            description: formData.description,
            dueDate: dueDateISO,
            maxScore: Number(formData.maxScore),
          },
        },
        {
          onSuccess: () => {
            setIsCreateOpen(false);
            resetForm();
          },
        }
      );
    } else {
      createMutation.mutate(
        {
          courseId: selectedCourseId,
          data: {
            title: formData.title,
            description: formData.description,
            dueDate: dueDateISO,
            maxScore: Number(formData.maxScore),
            attachments: attachments ? Array.from(attachments) : [],
          },
        },
        {
          onSuccess: () => {
            setIsCreateOpen(false);
            resetForm();
          },
        }
      );
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

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
            className="bg-indigo-600 hover:bg-indigo-700 text-white border-0 h-12 px-6 rounded-xl font-semibold shadow-sm shadow-indigo-200"
            onClick={handleOpenCreate}
          >
            <Plus className="w-5 h-5 mr-2" />
            New Assignment
          </Button>
        </div>
      </div>

      {/* Course Selector */}
      <div className="mb-8">
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">
          Select Course
        </Label>
        <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
          <SelectTrigger className="w-full md:w-80 h-12 rounded-xl border-gray-200 bg-white text-base">
            <SelectValue placeholder={coursesLoading ? "Loading courses..." : "Choose a course"} />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course._id} value={course._id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid - only show when a course is selected */}
      {selectedCourseId && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <AssignmentStatsCard
            title="Total Assignments"
            count={totalAssignments}
            icon={ClipboardList}
            iconColor="text-indigo-600 bg-indigo-50"
            className="md:col-span-1 shadow-sm border-0"
          />
          <AssignmentStatsCard
            title="Due Soon"
            count={dueSoon}
            icon={BookOpen}
            iconColor="text-purple-600 bg-purple-50"
            className="md:col-span-1 shadow-sm border-0"
          />
        </div>
      )}

      {/* Assignment List */}
      {selectedCourseId ? (
        <AssignmentList
          assignments={assignments}
          isLoading={assignmentsLoading}
          onDelete={handleDelete}
          onEdit={handleOpenEdit}
        />
      ) : (
        <div className="mt-12 flex flex-col items-center justify-center text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="size-20 rounded-2xl bg-indigo-50 flex items-center justify-center mb-5">
            <BookOpen className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Select a Course
          </h3>
          <p className="text-gray-500 max-w-sm">
            Choose a course from the dropdown above to view and manage its
            assignments.
          </p>
        </div>
      )}

      {/* Create / Edit Assignment Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingAssignment ? "Edit Assignment" : "Create Assignment"}
            </DialogTitle>
            <DialogDescription>
              {editingAssignment
                ? "Update the assignment details below."
                : "Fill in the details to create a new assignment."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-4 mt-2">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. Advanced Calculus Review"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe the assignment..."
                className="mt-1 min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Label>Due Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`mt-1 w-full justify-start text-left font-normal ${
                        !formData.dueDate ? "text-muted-foreground" : ""
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dueDate
                        ? format(formData.dueDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dueDate}
                      onSelect={(date) =>
                        setFormData({ ...formData, dueDate: date })
                      }
                      disabled={{ before: new Date() }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="maxScore">Max Score</Label>
                <Input
                  id="maxScore"
                  type="number"
                  min="0"
                  value={formData.maxScore}
                  onChange={(e) =>
                    setFormData({ ...formData, maxScore: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            </div>

            {!editingAssignment && (
              <div>
                <Label htmlFor="attachments">
                  Attachments (optional, max 5)
                </Label>
                <Input
                  id="attachments"
                  type="file"
                  multiple
                  onChange={(e) => setAttachments(e.target.files)}
                  className="mt-1"
                />
              </div>
            )}

            <DialogFooter>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : editingAssignment
                  ? "Update Assignment"
                  : "Create Assignment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Assignment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. If students have already submitted
              work, the assignment cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageAssignmentsPage;
