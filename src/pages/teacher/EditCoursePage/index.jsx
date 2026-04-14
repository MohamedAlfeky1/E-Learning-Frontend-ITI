import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { useUpdateCourse } from "../../../mutations/useUpdateCourse";
import { useCourse } from "../../../queries/useCourse";
import { useCategories } from "../../../queries/categoryQueries";

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

const EditCoursePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { mutate: updateCourse, isPending } = useUpdateCourse();
  const { data: course, isLoading: courseLoading, error: courseError } = useCourse(id);
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Populate form when course data is loaded
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || "",
        description: course.description || "",
        category: course.category?._id || course.category || "",
        price: course.price || "",
        level: course.level || "",
        language: course.language || "",
        requirements: course.requirements?.length ? course.requirements : [""],
        whatYouWillLearn: course.whatYouWillLearn?.length ? course.whatYouWillLearn : [""],
      });
      if (course.thumbnail) {
        setThumbnailPreview(course.thumbnail);
      }
    }
  }, [course]);

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
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
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
    // Thumbnail is optional for edit, but if changed, validate
    if (!thumbnail && !thumbnailPreview) {
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
    payload.append("title", formData.title.trim());
    payload.append("description", formData.description.trim());
    payload.append("category", formData.category);
    payload.append("price", Number(formData.price));
    payload.append("level", formData.level);
    payload.append("language", formData.language.trim());
    if (thumbnail) {
      payload.append("thumbnail", thumbnail);
    }

    const requirements = formData.requirements.filter((r) => r.trim());
    const whatYouWillLearn = formData.whatYouWillLearn.filter((w) => w.trim());
    requirements.forEach((r) => payload.append("requirements[]", r));
    whatYouWillLearn.forEach((w) => payload.append("whatYouWillLearn[]", w));

    updateCourse(
      { id, courseData: payload },
      {
        onSuccess: () => {
          navigate("/teacher/courses");
        },
        onError: (err) => {
          setErrors((prev) => ({
            ...prev,
            api: err.response?.data?.message || "Failed to update course. Please try again.",
          }));
        },
      }
    );
  };

  if (courseLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center">
        <Spinner className="w-8 h-8" />
        <span className="ml-2 text-gray-600">Loading course...</span>
      </div>
    );
  }

  if (courseError) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="text-red-500 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Course</h2>
          <p className="text-gray-600">Unable to load course details. Please try again.</p>
          <Button onClick={() => navigate("/teacher/courses")} className="mt-4">
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Edit Course</h1>
          <p className="text-gray-500 mt-1">Update the details below to modify your course.</p>
        </div>

        {/* API Error Banner */}
        {errors.api && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm font-medium border-l-4 border-red-500 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <FiAlertCircle className="text-xl flex-shrink-0" />
            {errors.api}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* ── Basic Info Card ── */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h2 className="text-lg font-bold text-gray-800">Basic Information</h2>

            {/* Title */}
            <div className="form-field group">
              <label className={`field-label ${errors.title ? "text-red-600" : "text-gray-700 group-focus-within:text-purple-600"}`}>
                Course Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiBook className={`field-icon ${errors.title ? "text-red-400" : "text-gray-400 group-focus-within:text-purple-500"}`} />
                <Input
                  type="text"
                  name="title"
                  variant="iconFieldMd"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Complete Web Development Bootcamp"
                  className={errors.title ? "border-red-300 bg-red-50 focus:ring-red-100 focus:border-red-400" : "border-gray-200 bg-gray-50/50 focus:ring-purple-50 focus:border-purple-500"}
                />
              </div>
              {errors.title && <p className="field-error"><FiAlertCircle /> {errors.title}</p>}
            </div>

            {/* Description */}
            <div className="form-field group">
              <label className={`field-label ${errors.description ? "text-red-600" : "text-gray-700 group-focus-within:text-purple-600"}`}>
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what students will gain from this course..."
                rows={4}
                className={errors.description ? "border-red-300 bg-red-50 focus:ring-red-100 focus:border-red-400" : "border-gray-200 bg-gray-50/50 focus:ring-purple-50 focus:border-purple-500"}
              />
              {errors.description && <p className="field-error"><FiAlertCircle /> {errors.description}</p>}
            </div>

            {/* Category + Level row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Category */}
              <div className="form-field group">
                <label className={`field-label ${errors.category ? "text-red-600" : "text-gray-700 group-focus-within:text-purple-600"}`}>
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={categoriesLoading}
                    className={`native-select ${errors.category ? "border-red-300 bg-red-50 focus:ring-red-100 focus:border-red-400" : "border-gray-200 bg-gray-50/50 focus:ring-purple-50 focus:border-purple-500"}`}
                  >
                    <option value="">
                      {categoriesLoading ? "Loading..." : "Select a category"}
                    </option>
                    {categories.map((cat) => (
                      <option key={cat._id || cat.id} value={cat._id || cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                {errors.category && <p className="field-error"><FiAlertCircle /> {errors.category}</p>}
              </div>

              {/* Level */}
              <div className="form-field group">
                <label className={`field-label ${errors.level ? "text-red-600" : "text-gray-700 group-focus-within:text-purple-600"}`}>
                  Level <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className={`native-select ${errors.level ? "border-red-300 bg-red-50 focus:ring-red-100 focus:border-red-400" : "border-gray-200 bg-gray-50/50 focus:ring-purple-50 focus:border-purple-500"}`}
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
                {errors.level && <p className="field-error"><FiAlertCircle /> {errors.level}</p>}
              </div>
            </div>

            {/* Price + Language row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Price */}
              <div className="form-field group">
                <label className={`field-label ${errors.price ? "text-red-600" : "text-gray-700 group-focus-within:text-purple-600"}`}>
                  Price (USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiDollarSign className={`field-icon ${errors.price ? "text-red-400" : "text-gray-400 group-focus-within:text-purple-500"}`} />
                  <Input
                    type="number"
                    name="price"
                    variant="iconFieldMd"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className={errors.price ? "border-red-300 bg-red-50 focus:ring-red-100 focus:border-red-400" : "border-gray-200 bg-gray-50/50 focus:ring-purple-50 focus:border-purple-500"}
                  />
                </div>
                {errors.price && <p className="field-error"><FiAlertCircle /> {errors.price}</p>}
              </div>

              {/* Language */}
              <div className="form-field group">
                <label className={`field-label ${errors.language ? "text-red-600" : "text-gray-700 group-focus-within:text-purple-600"}`}>
                  Language <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiGlobe className={`field-icon ${errors.language ? "text-red-400" : "text-gray-400 group-focus-within:text-purple-500"}`} />
                  <Input
                    type="text"
                    name="language"
                    variant="iconFieldMd"
                    value={formData.language}
                    onChange={handleChange}
                    placeholder="e.g. English"
                    className={errors.language ? "border-red-300 bg-red-50 focus:ring-red-100 focus:border-red-400" : "border-gray-200 bg-gray-50/50 focus:ring-purple-50 focus:border-purple-500"}
                  />
                </div>
                {errors.language && <p className="field-error"><FiAlertCircle /> {errors.language}</p>}
              </div>
            </div>
          </section>

          {/* ── Thumbnail Card ── */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-800">Course Thumbnail</h2>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`thumbnail-dropzone ${errors.thumbnail ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50/50 hover:border-purple-400 hover:bg-purple-50/30"}`}
            >
              {thumbnailPreview ? (
                <img src={thumbnailPreview} alt="Thumbnail preview" className="thumbnail-preview" />
              ) : (
                <div className="thumbnail-placeholder">
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
            {errors.thumbnail && <p className="field-error"><FiAlertCircle /> {errors.thumbnail}</p>}
            {thumbnailPreview && (
              <button
                type="button"
                onClick={() => { setThumbnail(null); setThumbnailPreview(course?.thumbnail || null); }}
                className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
              >
                Remove thumbnail
              </button>
            )}
          </section>

          {/* ── Requirements Card ── */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Requirements</h2>
                <p className="text-xs text-gray-400 mt-0.5">What should students know before enrolling?</p>
              </div>
              <button
                type="button"
                onClick={() => addListItem("requirements")}
                className="list-add-btn"
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
                      className="list-remove-btn"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── What You'll Learn Card ── */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800">What Students Will Learn</h2>
                <p className="text-xs text-gray-400 mt-0.5">Key outcomes students can expect.</p>
              </div>
              <button
                type="button"
                onClick={() => addListItem("whatYouWillLearn")}
                className="list-add-btn"
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
                      className="list-remove-btn"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── Actions ── */}
          <div className="flex items-center gap-4 pb-10">
            <Button
              type="submit"
              variant="purpleBtnXl"
              disabled={isPending}
              className="flex-1 sm:flex-none sm:min-w-48 mt-0"
            >
              {isPending ? (
                <>
                  <Spinner className="w-5 h-5 border-white" /> Updating...
                </>
              ) : (
                "Update Course"
              )}
            </Button>
            <button
              type="button"
              onClick={() => navigate("/teacher/courses")}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .form-field { display: flex; flex-direction: column; gap: 0.375rem; }
        .field-label { font-size: 0.875rem; font-weight: 600; transition: color 0.15s; }
        .field-icon {
          position: absolute; left: 1rem; top: 50%; transform: translateY(-50%);
          font-size: 1.125rem; transition: color 0.15s;
        }
        .field-error {
          display: flex; align-items: center; gap: 0.375rem;
          font-size: 0.75rem; color: #dc2626; font-weight: 500;
          margin-top: 0.25rem; margin-left: 0.25rem;
        }
        .native-select {
          width: 100%; appearance: none; padding: 0.625rem 2.5rem 0.625rem 0.875rem;
          border-radius: 0.625rem; border: 1px solid; font-size: 0.875rem;
          background-color: transparent; outline: none; transition: border-color 0.15s, box-shadow 0.15s;
          cursor: pointer;
        }
        .native-select:focus { box-shadow: 0 0 0 3px rgba(147,51,234,0.1); border-color: #a855f7; }
        .thumbnail-dropzone {
          width: 100%; min-height: 180px; border: 2px dashed; border-radius: 1rem;
          cursor: pointer; transition: all 0.2s; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .thumbnail-preview { width: 100%; height: 220px; object-fit: cover; display: block; }
        .thumbnail-placeholder { display: flex; flex-direction: column; align-items: center; padding: 2rem; }
        .list-add-btn {
          display: inline-flex; align-items: center; gap: 0.375rem;
          font-size: 0.8125rem; font-weight: 600; color: #9333ea;
          border: 1.5px solid #e9d5ff; padding: 0.375rem 0.875rem;
          border-radius: 9999px; transition: all 0.15s; background: #faf5ff;
        }
        .list-add-btn:hover { background: #f3e8ff; border-color: #c084fc; }
        .list-remove-btn {
          flex-shrink: 0; padding: 0.5rem; color: #f87171;
          border-radius: 0.5rem; transition: all 0.15s;
          background: transparent; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }
        .list-remove-btn:hover { background: #fee2e2; color: #dc2626; }
        .cancel-btn {
          font-size: 0.9375rem; font-weight: 600; color: #6b7280;
          padding: 0.75rem 1.5rem; border-radius: 9999px;
          border: 1.5px solid #e5e7eb; background: white;
          transition: all 0.15s; cursor: pointer;
        }
        .cancel-btn:hover { background: #f9fafb; color: #374151; border-color: #d1d5db; }
      `}</style>
    </div>
  );
};

export default EditCoursePage;
