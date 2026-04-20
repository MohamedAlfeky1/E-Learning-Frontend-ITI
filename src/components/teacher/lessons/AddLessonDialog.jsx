import React, { useState } from "react";
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
import { FiPlus, FiType, FiFileText, FiHash } from "react-icons/fi";
import { useCreateLessonMutation } from "@/mutations/useCreateLessonMutation";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  orderIndex: z.coerce.number().min(0).default(0),
});

const AddLessonDialog = ({ courseId }) => {
  const [open, setOpen] = useState(false);
  const { mutateAsync: createLesson, isPending } = useCreateLessonMutation(courseId);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      orderIndex: 0,
    },
  });

  const onSubmit = async (data) => {
    try {
      await createLesson({ courseId, data });
      toast.success("Lesson created successfully!");
      setOpen(false);
      reset();
    } catch (err) {
      toast.error(err.message || "Failed to create lesson");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-6 py-6 text-white hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 transform hover:scale-[1.02]">
          <FiPlus className="text-xl" />
          <span className="font-bold">Add New Lesson</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl rounded-3xl border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <FiPlus className="text-purple-600" />
            </div>
            Add New Lesson
          </DialogTitle>
          <DialogDescription className="text-gray-500 font-medium">
            Create a new lesson for this course. You can add videos and materials later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-4">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-bold text-gray-700 ml-1">
                Lesson Title
              </Label>
              <div className="relative group">
                <FiType className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="e.g. Introduction to React"
                      className={`pl-12 h-14 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-purple-600/10 transition-all font-medium ${
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

            {/* Order Index */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-bold text-gray-700 ml-1">
                Order Index
              </Label>
              <div className="relative group">
                <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                <Controller
                  name="orderIndex"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="0"
                      className={`pl-12 h-14 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-purple-600/10 transition-all font-medium ${
                        errors.orderIndex ? "ring-2 ring-red-500" : ""
                      }`}
                    />
                  )}
                />
              </div>
              <p className="text-[10px] text-gray-400 font-bold ml-2">
                Lessons will be sorted by this index.
              </p>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-bold text-gray-700 ml-1">
                Description
              </Label>
              <div className="relative group">
                <FiFileText className="absolute left-4 top-4 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="What will students learn in this lesson?"
                      className={`pl-12 pt-4 min-h-[120px] rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-purple-600/10 transition-all font-medium resize-none ${
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
            className="rounded-2xl bg-purple-600 px-8 h-12 text-white hover:bg-purple-700 font-bold shadow-lg shadow-purple-100 disabled:opacity-70"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <Spinner className="size-4 border-white" /> Creating...
              </div>
            ) : (
              "Create Lesson"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddLessonDialog;
