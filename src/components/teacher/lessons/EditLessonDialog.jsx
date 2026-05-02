import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { FiEdit3, FiType, FiFileText, FiHash } from "react-icons/fi";
import { useUpdateLessonMutation } from "@/mutations/useUpdateLessonMutation";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

const EditLessonDialog = ({ courseId, lesson }) => {
  const [open, setOpen] = useState(false);
  const { mutateAsync: updateLesson, isPending } =
    useUpdateLessonMutation(courseId);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: lesson?.title || "",
      description: lesson?.description || "",
    },
  });

  useEffect(() => {
    if (lesson) {
      reset({
        title: lesson.title,
        description: lesson.description,
      });
    }
  }, [lesson, reset]);

  const onSubmit = async (data) => {
    try {
      await updateLesson({
        courseId,
        lessonId: lesson._id,
        data: { ...data, orderIndex: lesson.orderIndex },
      });
      toast.success("Lesson updated successfully!");
      setOpen(false);
    } catch (err) {
      toast.error(err.message || "Failed to update lesson");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl border-indigo-100 text-indigo-600 hover:bg-indigo-50"
        >
          <FiEdit3 className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl rounded-3xl border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-gray-900 flex items-center gap-3 break-words">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
              <FiEdit3 className="text-indigo-600" />
            </div>
            Edit Lesson
          </DialogTitle>
          <DialogDescription className="text-gray-500 font-medium">
            Update the title or description.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 py-4 w-full"
        >
          <div className="space-y-4">
            {/* Title */}
            <div className="flex flex-col gap-2 w-full min-w-0 px-1">
              <Label className="text-sm font-bold text-gray-700 ml-1">
                Lesson Title
              </Label>
              <div className="relative group w-full">
                <FiType className="absolute left-4 top-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="e.g. Introduction to React"
                      className={`w-full pl-12 pt-4 min-h-[80px] rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-indigo-600/10 transition-all font-medium resize-none break-all ${
                        errors.title ? "ring-2 ring-red-500" : ""
                      }`}
                    />
                  )}
                />
              </div>
              {errors.title && (
                <p className="text-xs text-red-500 font-bold ml-2">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2 w-full min-w-0 px-1">
              <Label className="text-sm font-bold text-gray-700 ml-1">
                Description
              </Label>
              <div className="relative group w-full">
                <FiFileText className="absolute left-4 top-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="What will students learn in this lesson?"
                      className={`w-full pl-12 pt-4 min-h-[240px] rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-indigo-600/10 transition-all font-medium resize-none break-words ${
                        errors.description ? "ring-2 ring-red-500" : ""
                      }`}
                    />
                  )}
                />
              </div>
              {errors.description && (
                <p className="text-xs text-red-500 font-bold ml-2">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </form>

        <DialogFooter className="mt-4">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="rounded-xl text-gray-500 font-bold hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            className="rounded-2xl bg-indigo-600 px-8 h-12 text-white hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-100 disabled:opacity-70"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <Spinner className="size-4 border-white" /> Updating...
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditLessonDialog;
