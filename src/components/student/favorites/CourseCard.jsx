import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCourse } from "@/queries/useCourse";
import placeholderImg from "@/assets/placeholder.jpg";
import { useGetCategoryById } from "@/queries/categoryQueries";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteFavoriteMutation } from "@/mutations/useDeleteFavoriteMutation";

const CourseCard = ({ favorite }) => {
  const {
    data: courseData,
    isLoading,
    error,
  } = useCourse(favorite?.courseId?._id);
  const course = courseData?.data ?? {};
  console.log("Course:", course);

  const { mutateAsync: removeFromFavorites, isPending: isRemoving } =
    useDeleteFavoriteMutation();

  const { data: categoryData } = useGetCategoryById(course.categoryId);
  const category = categoryData?.data ?? {};

  if (isLoading) {
    return (
      <div className="w-full max-w-[400px] h-[400px] bg-white rounded-3xl border border-gray-100 flex items-center justify-center mx-auto">
        <Spinner className="size-8 text-[#3525CD]" />
      </div>
    );
  }

  return (
    <div className="group w-full max-w-[400px] bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col overflow-hidden mx-auto">
      {/* Thumbnail Area */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={course?.thumbnail || placeholderImg}
          alt="Course Image"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 backdrop-blur-md text-[#141B2B] border-none shadow-sm font-bold uppercase tracking-wider text-[9px] px-2 py-1">
            {category.name || "General"}
          </Badge>
        </div>
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/90 backdrop-blur-md hover:bg-white absolute top-4 right-4 rounded-xl shadow-sm text-red-500 transition-all active:scale-90"
          onClick={() => removeFromFavorites(favorite._id)}
        >
          {isRemoving ? (
            <Spinner className="size-4" />
          ) : (
            <Heart className="size-5 fill-red-500" />
          )}
        </Button>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-extrabold text-[#141B2B] font-['Plus Jakarta Sans'] line-clamp-2 leading-tight mb-2 min-h-[3rem]">
          {course.title}
        </h3>
        <p className="text-[#464555] text-xs font-medium opacity-70 line-clamp-2 mb-4 flex-1">
          {course.description}
        </p>

        <div className="pt-4 border-t border-gray-50 flex justify-between items-center mt-auto">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-tighter text-gray-400">
              Price
            </span>
            <span className="text-xl font-black text-[#3525CD] font-['Plus Jakarta Sans']">
              {course.type === "free" ? "FREE" : `$${course?.price}`}
            </span>
          </div>
          <Link to={`/courses/${course._id}`}>
            <Button className="bg-[#141B2B] hover:bg-black text-white rounded-xl px-5 h-10 font-bold text-xs transition-all flex items-center gap-2">
              Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
