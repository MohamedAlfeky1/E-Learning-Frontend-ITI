import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBook,
  FiDollarSign,
  FiGlobe,
  FiImage,
  FiPlus,
  FiTrash2,
  FiAlertCircle,
  FiChevronDown,
} from "react-icons/fi";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Spinner } from "../../../components/ui/spinner";
import { useCreateCourse } from "../../../mutations/useCreateCourse";
import { useCategories } from "../../../queries/categoryQueries";
import { useUserQuery } from "@/queries/authQueries";

const LEVELS = ["beginner", "intermediate", "advanced"];

const INITIAL_FORM = {
  title: "",
  description: "",
  category: "",
  price: "",
  level: "",
  language: "",
  requirements: [""],
  whatYouWillLearn: [""],
};

const INITIAL_ERRORS = {
  title: "",
  description: "",
  category: "",
  price: "",
  level: "",
  language: "",
  thumbnail: "",
  api: "",
};

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const { data: teacherData, isError: teacherError } = useUserQuery();
  const { mutate: createCourse, isPending } = useCreateCourse();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const categories = categoriesData?.data ?? [];

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", api: "" }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, thumbnail: "" }));
  };

  const handleListChange = (field, index, value) => {
    setFormData((prev) => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const addListItem = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeListItem = (field, index) => {
    setFormData((prev) => {
      const updated = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: updated.length ? updated : [""] };
    });
  };

  const validate = () => {
    const newErrors = { ...INITIAL_ERRORS };
    let valid = true;

    if (!formData.title.trim()) {
      newErrors.title = "Course title is required";
      valid = false;
    } else if (formData.title.trim().length < 10) {
      newErrors.title = "Course title must be at least 10 characters";
      valid = false;
    } else if (formData.title.trim().length > 150) {
      newErrors.title = "Course title must be at most 150 characters";
      valid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      valid = false;
    } else if (formData.description.trim().length < 50) {
      newErrors.description = "Description must be at least 50 characters";
      valid = false;
    }
    if (!formData.category) {
      newErrors.category = "Please select a category";
      valid = false;
    }
    if (!formData.price && formData.price !== 0) {
      newErrors.price = "Price is required";
      valid = false;
    } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = "Enter a valid price (0 for free)";
      valid = false;
    }
    if (!formData.level) {
      newErrors.level = "Please select a level";
      valid = false;
    }
    if (!formData.language.trim()) {
      newErrors.language = "Language is required";
      valid = false;
    }
    if (!thumbnail) {
      newErrors.thumbnail = "Please upload a course thumbnail";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = new FormData();
    payload.append("teacherId", teacherData?._id);
    payload.append("title", formData.title.trim());
    payload.append("description", formData.description.trim());
    payload.append("categoryId", formData.category);
    payload.append("price", Number(formData.price));
    payload.append("level", formData.level);
    payload.append("language", formData.language.trim());
    payload.append("thumbnail", thumbnail);

    const requirements = formData.requirements.filter((r) => r.trim());
    const whatYouWillLearn = formData.whatYouWillLearn.filter((w) => w.trim());
    requirements.forEach((r) => payload.append("requirements[]", r));
    whatYouWillLearn.forEach((w) => payload.append("whatYouWillLearn[]", w));

    createCourse(payload, {
      onSuccess: () => {
        navigate("/teacher/courses");
      },
      onError: (err) => {
        setErrors((prev) => ({
          ...prev,
          api: err.response?.data?.message || "Failed to create course. Please try again.",
        }));
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Create New Course</h1>
          <p className="text-gray-500 mt-1">Fill in the details below to publish your course.</p>
        </header>

        {errors.api && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm font-medium border-l-4 border-red-500 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <FiAlertCircle className="text-xl flex-shrink-0" />
            {errors.api}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* Basic Info Card */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h2 className="text-lg font-bold text-gray-800">Basic Information</h2>

            {/* Title */}
            <div className="flex flex-col gap-1.5 group">
              <label
                className={`text-sm font-600 transition-colors ${errors.title ? "text-red-600" : "text-gray-700 group-focus-within:text-purple-600"
                  }`}
              >
                Course Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiBook
                  className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg transition-colors ${errors.title ? "text-red-400" : "text-gray-400 group-focus-within:text-purple-500"
                    }`}
                />
                <Input
                  type="text"
                  name="title"
                  variant="iconFieldMd"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Complete Web Development Bootcamp"
                  className={
                    errors.title
                      ? "border-red-300 bg-red-50 focus:ring-red-100 focus:border-red-400"
                      : "border-gray-200 bg-gray-50/50 focus:ring-purple-50 focus:border-purple-500"
                  }
                />
              </div>
              {errors.title && (
                <p className="flex items-center gap-1.5 text-xs text-red-600 font-medium mt-1 ml-1">
                  <FiAlertCircle /> {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5 group">
              <label
                className={`text-sm font-600 transition-colors ${errors.description ? "text-red-600" : "text-gray-700 group-focus-within:text-purple-600"
                  }`}
              >
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what students will gain from this course..."
                rows={4}
                className={
                  errors.description
                    ? "border-red-300 bg-red-50 focus:ring-red-100 focus:border-red-400"
                    : "border-gray-200 bg-gray-50/50 focus:ring-purple-50 focus:border-purple-500"
                }
              />
              {errors.description && (
                <p className="flex items-center gap-1.5 text-xs text-red-600 font-medium mt-1 ml-1">
                  <FiAlertCircle /> {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Category */}
              <div className="flex flex-col gap-1.5 group">
                <label
                  className={`text-sm font-600 transition-colors ${errors.category ? "text-red-600" : "text-gray-700 group-focus-within:text-purple-600"
                    }`}
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={categoriesLoading}
                    className={`w-full appearance-none px-3.5 py-2.5 rounded-xl border text-sm bg-transparent outline-none cursor-pointer transition-all focus:ring-4 ${errors.category
                      ? "border-red-300 bg-red-50 focus:ring-red-100 focus:border-red-400"
                      : "border-gray-200 bg-gray-50/50 focus:ring-purple-50 focus:border-purple-500"
                      }`}
                  >
                    <option value="">{categoriesLoading ? "Loading..." : "Select a category"}</option>
                    {categories.map((cat) => (
                      <option key={cat._id || cat.id} value={cat._id || cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                {errors.category && (
                  <p className="flex items-center gap-1.5 text-xs text-red-600 font-medium mt-1 ml-1">
                    <FiAlertCircle /> {errors.category}
                  </p>
                )}
              </div>

              {/* Level */}
              <div className="flex flex-col gap-1.5 group">
                <label
                  className={`text-sm font-600 transition-colors ${errors.level ? "text-red-600" : "text-gray-700 group-focus-within:text-purple-600"
                    }`}
                >
                  Level <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className={`w-full appearance-none px-3.5 py-2.5 rounded-xl border text-sm bg-transparent outline-none cursor-pointer transition-all focus:ring-4 ${errors.level
                      ? "border-red-300 bg-red-50 focus:ring-red-100 focus:border-red-400"
                      : "border-gray-200 bg-gray-50/50 focus:ring-purple-50 focus:border-purple-500"
                      }`}
                  >
                    <option value="">Select level</option>
                    {LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                {errors.level && (
                  <p className="flex items-center gap-1.5 text-xs text-red-600 font-medium mt-1 ml-1">
                    <FiAlertCircle /> {errors.level}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Price */}
              <div className="flex flex-col gap-1.5 group">
                <label
                  className={`text-sm font-600 transition-colors ${errors.price ? "text-red-600" : "text-gray-700 group-focus-within:text-purple-600"
                    }`}
                >
                  Price (USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiDollarSign
                    className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg transition-colors ${errors.price ? "text-red-400" : "text-gray-400 group-focus-within:text-purple-500"
                      }`}
                  />
                  <Input
                    type="number"
                    name="price"
                    variant="iconFieldMd"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className={
                      errors.price
                        ? "border-red-300 bg-red-50 focus:ring-red-100 focus:border-red-400"
                        : "border-gray-200 bg-gray-50/50 focus:ring-purple-50 focus:border-purple-500"
                    }
                  />
                </div>
                {errors.price && (
                  <p className="flex items-center gap-1.5 text-xs text-red-600 font-medium mt-1 ml-1">
                    <FiAlertCircle /> {errors.price}
                  </p>
                )}
              </div>

              {/* Language */}
              <div className="flex flex-col gap-1.5 group">
                <label
                  className={`text-sm font-600 transition-colors ${errors.language ? "text-red-600" : "text-gray-700 group-focus-within:text-purple-600"
                    }`}
                >
                  Language <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiGlobe
                    className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg transition-colors ${errors.language ? "text-red-400" : "text-gray-400 group-focus-within:text-purple-500"
                      }`}
                  />
                  <Input
                    type="text"
                    name="language"
                    variant="iconFieldMd"
                    value={formData.language}
                    onChange={handleChange}
                    placeholder="e.g. English"
                    className={
                      errors.language
                        ? "border-red-300 bg-red-50 focus:ring-red-100 focus:border-red-400"
                        : "border-gray-200 bg-gray-50/50 focus:ring-purple-50 focus:border-purple-500"
                    }
                  />
                </div>
                {errors.language && (
                  <p className="flex items-center gap-1.5 text-xs text-red-600 font-medium mt-1 ml-1">
                    <FiAlertCircle /> {errors.language}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Thumbnail Card */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-800">Course Thumbnail</h2>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`w-full min-h-[180px] border-2 border-dashed rounded-2xl cursor-pointer transition-all overflow-hidden flex items-center justify-center ${errors.thumbnail
                ? "border-red-300 bg-red-50"
                : "border-gray-200 bg-gray-50/50 hover:border-purple-400 hover:bg-purple-50/30"
                }`}
            >
              {thumbnailPreview ? (
                <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-[220px] object-cover" />
              ) : (
                <div className="flex flex-col items-center p-8 text-center">
                  <FiImage className="text-4xl text-gray-300 mb-3" />
                  <p className="text-sm font-semibold text-gray-500">Click to upload thumbnail</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="hidden"
            />
            {errors.thumbnail && (
              <p className="flex items-center gap-1.5 text-xs text-red-600 font-medium mt-1 ml-1">
                <FiAlertCircle /> {errors.thumbnail}
              </p>
            )}
            {thumbnailPreview && (
              <button
                type="button"
                onClick={() => {
                  setThumbnail(null);
                  setThumbnailPreview(null);
                }}
                className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
              >
                Remove thumbnail
              </button>
            )}
          </section>

          {/* Requirements Card */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Requirements</h2>
                <p className="text-xs text-gray-400 mt-0.5">What should students know before enrolling?</p>
              </div>
              <button
                type="button"
                onClick={() => addListItem("requirements")}
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-purple-600 border-1.5 border-purple-100 bg-purple-50 px-3.5 py-1.5 rounded-full hover:bg-purple-100 hover:border-purple-300 transition-all"
              >
                <FiPlus /> Add
              </button>
            </div>
            <div className="space-y-3">
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={req}
                    onChange={(e) => handleListChange("requirements", index, e.target.value)}
                    placeholder={`Requirement ${index + 1}`}
                    className="border-gray-200 bg-gray-50/50 focus:ring-purple-50 focus:border-purple-500"
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeListItem("requirements", index)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Learning Outcomes Card */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800">What Students Will Learn</h2>
                <p className="text-xs text-gray-400 mt-0.5">Key outcomes students can expect.</p>
              </div>
              <button
                type="button"
                onClick={() => addListItem("whatYouWillLearn")}
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-purple-600 border-1.5 border-purple-100 bg-purple-50 px-3.5 py-1.5 rounded-full hover:bg-purple-100 hover:border-purple-300 transition-all"
              >
                <FiPlus /> Add
              </button>
            </div>
            <div className="space-y-3">
              {formData.whatYouWillLearn.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={item}
                    onChange={(e) => handleListChange("whatYouWillLearn", index, e.target.value)}
                    placeholder={`Learning outcome ${index + 1}`}
                    className="border-gray-200 bg-gray-50/50 focus:ring-purple-50 focus:border-purple-500"
                  />
                  {formData.whatYouWillLearn.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeListItem("whatYouWillLearn", index)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Footer Actions */}
          <div className="flex flex-col gap-4 pb-10">
            <Button
              type="submit"
              variant="purpleBtnXl"
              disabled={isPending}
              className="flex-1 sm:flex-none sm:min-w-[192px] mt-0"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Spinner className="w-5 h-5 border-white" /> Creating...
                </div>
              ) : (
                "Create Course"
              )}
            </Button>
            <button
              type="button"
              onClick={() => navigate("/teacher/courses")}
              className="px-6 py-3 text-[15px] font-semibold text-gray-500 bg-white border-1.5 border-gray-200 rounded-full hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCoursePage;