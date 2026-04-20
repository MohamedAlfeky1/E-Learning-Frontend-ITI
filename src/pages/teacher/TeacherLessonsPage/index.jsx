import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLessonsByCourse } from "@/queries/lessonsQueries";
import { useDeleteLessonMutation } from "@/mutations/useDeleteLessonMutation";
import AddLessonDialog from "@/components/teacher/lessons/AddLessonDialog";
import EditLessonDialog from "@/components/teacher/lessons/EditLessonDialog";
import { Spinner } from "@/components/ui/spinner";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Trash2,
  BookOpen,
  Video,
  FileText,
  ChevronLeft,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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

const TeacherLessonsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useLessonsByCourse(courseId);
  const lessons = data?.data || [];

  const { mutateAsync: deleteLesson, isPending: isDeleting } =
    useDeleteLessonMutation(courseId);
  const [lessonToDelete, setLessonToDelete] = React.useState(null);

  const handleDelete = async () => {
    if (lessonToDelete) {
      try {
        await deleteLesson({ courseId, lessonId: lessonToDelete._id });
        setLessonToDelete(null);
      } catch (err) {
        // Error handled by mutation
      }
    }
  };

  return (
    <div className="bg-[#F8F9FD] min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row gap-6 justify-between md:items-center">
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/teacher/courses")}
            className="text-gray-500 hover:text-purple-600 font-bold p-0 flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" /> Back to My Courses
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Course Content
            </h1>
            <p className="text-gray-500 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              Manage your lessons, videos and materials
            </p>
          </div>
        </div>
        <AddLessonDialog courseId={courseId} />
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto">
        {isLoading ? (
          <div className="w-full py-24 flex flex-col justify-center items-center gap-5 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
            <Spinner className="w-12 h-12 border-purple-600" />
            <p className="text-gray-400 font-black animate-pulse uppercase tracking-widest text-xs">
              Loading lessons...
            </p>
          </div>
        ) : isError ? (
          <div className="py-20 text-center bg-white rounded-[2.5rem] border-2 border-red-50 p-10">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-10 h-10 text-red-300" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              Failed to load lessons
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-8 font-medium">
              We encountered an issue while retrieving the course content.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gray-900 hover:bg-black text-white px-8 h-12 rounded-xl"
            >
              Try Again
            </Button>
          </div>
        ) : lessons.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 gap-8 shadow-sm">
            <div className="w-24 h-24 bg-purple-50 rounded-[2rem] flex items-center justify-center transform rotate-6 border border-purple-100">
              <BookOpen className="w-12 h-12 text-purple-300 transform -rotate-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-gray-900">
                Your Course is Empty
              </h3>
              <p className="text-gray-500 font-medium max-w-xs mx-auto leading-relaxed">
                Start building your curriculum by adding your first lesson.
              </p>
            </div>
            <AddLessonDialog courseId={courseId} />
          </div>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <LessonItem
                key={lesson._id}
                lesson={lesson}
                courseId={courseId}
                onDelete={() => setLessonToDelete(lesson)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!lessonToDelete}
        onOpenChange={() => setLessonToDelete(null)}
      >
        <AlertDialogContent className="rounded-[2.5rem] p-10 max-w-md border-none shadow-2xl">
          <AlertDialogHeader>
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6">
              <Trash2 className="w-10 h-10 text-red-500" />
            </div>
            <AlertDialogTitle className="text-3xl font-black text-gray-900">
              Remove Lesson?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 text-lg leading-relaxed font-medium">
              Are you sure you want to delete{" "}
              <span className="text-gray-900 font-extrabold italic">
                "{lessonToDelete?.title}"
              </span>
              ? All attached videos and materials will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-10 gap-4">
            <AlertDialogCancel className="h-14 rounded-2xl border-gray-100 text-gray-500 font-black px-8">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="h-14 bg-red-500 hover:bg-red-600 text-white rounded-2xl px-10 font-black shadow-lg shadow-red-100 border-none"
            >
              {isDeleting ? (
                <Spinner className="mr-2 h-5 w-5 border-white" />
              ) : (
                "Delete Lesson"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const LessonItem = ({ lesson, courseId, onDelete }) => {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex flex-col md:flex-row items-center gap-8 hover:shadow-2xl hover:shadow-purple-500/5 transition-all duration-300 group">
      {/* Index Badge */}
      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex flex-col items-center justify-center border border-gray-100 group-hover:bg-purple-600 group-hover:border-purple-600 transition-colors duration-300">
        <span className="text-[10px] font-black text-gray-400 group-hover:text-purple-200">
          ORDER
        </span>
        <span className="text-xl font-black text-gray-900 group-hover:text-white">
          #{lesson.orderIndex}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-xl font-extrabold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
          {lesson.title}
        </h3>
        <p className="text-gray-500 line-clamp-1 mb-4 font-medium max-w-lg">
          {lesson.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center md:justify-start gap-6">
          <div className="flex items-center gap-2 text-gray-400">
            <Video className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">
              {lesson.videos?.length || 0} Videos
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <FileText className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">
              {lesson.materials?.length || 0} Materials
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">
              {new Date(lesson.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <EditLessonDialog lesson={lesson} courseId={courseId} />
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl border-red-50 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
          onClick={onDelete}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default TeacherLessonsPage;
