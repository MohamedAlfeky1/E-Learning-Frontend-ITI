import React, { useState, useRef } from "react";
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
import {
  FiPlus,
  FiType,
  FiFileText,
  FiLink,
  FiImage,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { useCreateSliderMutation } from "@/mutations/useCreateSliderMutation";
import { useSliders } from "@/queries/slidersQueries";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
  linkUrl: z
    .string()
    .url("Invalid URL")
    .optional()
    .or(z.literal(""))
    .or(z.string().regex(/^#/, "Must be a valid URL or #")),
  buttonText: z
    .string()
    .min(1, "Button text is required")
    .default("Learn More"),
  isActive: z.boolean().default(true),
});

const AddSliderDialog = () => {
  const [open, setOpen] = useState(false);
  const { mutateAsync: createSlider, isPending } = useCreateSliderMutation();
  const { data: slidersData } = useSliders();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef(null);

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
      linkUrl: "",
      buttonText: "Learn More",
      isActive: true,
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setImageError("");
  };

  const onSubmit = async (data) => {
    if (!image) {
      setImageError("Image is required");
      return;
    }

    const maxOrderIndex = slidersData?.data
      ? Math.max(...slidersData.data.map((s) => s.orderIndex || 0))
      : 0;

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description || "");
    formData.append("linkUrl", data.linkUrl || "");
    formData.append("buttonText", data.buttonText);
    formData.append("isActive", data.isActive ? "1" : "0");
    formData.append("orderIndex", maxOrderIndex + 1);
    formData.append("image", image);

    try {
      await createSlider(formData);
      toast.success("Slider created successfully!");
      setOpen(false);
      reset();
      setImage(null);
      setImagePreview(null);
    } catch (err) {
      toast.error(err.message || "Failed to create slider");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="inline-flex items-center gap-2 rounded-full bg-[#3525CD] px-6 py-4 text-white hover:bg-[#2a1da3] transition-all transform hover:scale-[1.02]">
          <FiPlus className="text-xl" />
          Create New Slider
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiPlus className="text-[#3525CD]" />
            Add New Slider
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Configure the content and appearance of your homepage slider.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Main Info */}
          <section className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Content Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-gray-600 ml-1">
                  Title *
                </Label>
                <div className="relative group">
                  <FiType className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3525CD] transition-colors" />
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Welcome to ITI"
                        className={`pl-10 rounded-xl bg-white border-gray-200 focus:ring-4 focus:ring-[#3525CD]/10 focus:border-[#3525CD] transition-all ${
                          errors.title ? "border-red-300 bg-red-50" : ""
                        }`}
                      />
                    )}
                  />
                </div>
                {errors.title && (
                  <p className="text-[10px] text-red-500 font-medium ml-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Button Text */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-gray-600 ml-1">
                  Button Text
                </Label>
                <div className="relative group">
                  <FiPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3525CD] transition-colors" />
                  <Controller
                    name="buttonText"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Learn More"
                        className="pl-10 rounded-xl bg-white border-gray-200 focus:ring-4 focus:ring-[#3525CD]/10 focus:border-[#3525CD] transition-all"
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-gray-600 ml-1">
                Description
              </Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="Enter slider description..."
                    rows={3}
                    className={`rounded-xl bg-white border-gray-200 focus:ring-4 focus:ring-[#3525CD]/10 focus:border-[#3525CD] transition-all ${
                      errors.description ? "border-red-300 bg-red-50" : ""
                    }`}
                  />
                )}
              />
              {errors.description && (
                <p className="text-[10px] text-red-500 font-medium ml-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </section>

          {/* Links & Visibility */}
          <section className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Navigation & Display
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {/* Link URL */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-gray-600 ml-1">
                  Link URL
                </Label>
                <div className="relative group">
                  <FiLink className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3525CD] transition-colors" />
                  <Controller
                    name="linkUrl"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="https://example.com"
                        className={`pl-10 rounded-xl bg-white border-gray-200 focus:ring-4 focus:ring-[#3525CD]/10 focus:border-[#3525CD] transition-all ${
                          errors.linkUrl ? "border-red-300 bg-red-50" : ""
                        }`}
                      />
                    )}
                  />
                </div>
                {errors.linkUrl && (
                  <p className="text-[10px] text-red-500 font-medium ml-1">
                    {errors.linkUrl.message}
                  </p>
                )}
              </div>
            </div>

            {/* Is Active */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 mt-2">
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="size-5 rounded border-gray-300 text-[#3525CD] focus:ring-[#3525CD] cursor-pointer"
                  />
                )}
              />
              <Label
                htmlFor="isActive"
                className="text-sm font-semibold text-gray-700 cursor-pointer select-none"
              >
                Make this slider active immediately
              </Label>
            </div>
          </section>

          {/* Image Upload */}
          <section className="space-y-2">
            <Label className="text-xs font-bold text-gray-600 ml-1 uppercase">
              Slider Image *
            </Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center overflow-hidden ${
                imageError
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 bg-gray-50/50 hover:border-[#3525CD]/50 hover:bg-[#3525CD]/5"
              }`}
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-xs font-bold">
                      Click to change image
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                  <FiImage className="mx-auto text-3xl text-gray-300 mb-2" />
                  <p className="text-xs font-bold text-gray-500">
                    Drop your image here or click to browse
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Recommended: 1920x1080px (MAX 5MB)
                  </p>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imageError && (
              <p className="flex items-center gap-1.5 text-[10px] text-red-500 font-medium mt-1 ml-1">
                <FiAlertCircle /> {imageError}
              </p>
            )}
          </section>
        </form>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="rounded-xl border-gray-200 text-gray-500 px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            className="rounded-xl bg-[#3525CD] px-8 text-white hover:bg-[#2a1da3] min-w-[140px]"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <Spinner className="size-4" /> Adding...
              </div>
            ) : (
              "Add Slider"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSliderDialog;
