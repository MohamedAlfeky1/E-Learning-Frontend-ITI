import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import placeholderImg from "@/assets/placeholder.jpg";
import { useGetCategoryById } from "@/queries/categoryQueries";
import { useDeleteCartMutation } from "@/mutations/useDeleteCartMutation";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  const { mutateAsync: removeFromCart, isPending: removePending } =
    useDeleteCartMutation();
  const { data: categoryData } = useGetCategoryById(course.categoryId);
  const category = categoryData?.data ?? {};

  return (
    <div className="p-5 bg-white rounded-3xl flex flex-col lg:flex-row gap-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 group">
      <div className="size-[140px] self-center lg:self-start rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
        <img
          src={course.thumbnail || placeholderImg}
          alt="Course Image"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="grow flex flex-col justify-between py-1">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <Badge
              variant="secondary"
              className="uppercase text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#F1F3FF] text-[#3525CD] border-none"
            >
              {category.name || "General"}
            </Badge>
            <h3 className="text-lg font-extrabold text-[#141B2B] font-['Plus Jakarta Sans'] line-clamp-1 leading-tight">
              {course.title}
            </h3>
            <p className="text-[#464555] text-xs font-medium opacity-70">
              Instructor: {course.teacherId?.firstName}{" "}
              {course.teacherId?.lastName}
            </p>
          </div>
          <Button
            onClick={() => removeFromCart(course._id)}
            size="icon"
            variant="ghost"
            className="rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            {removePending ? (
              <Spinner className="size-4" />
            ) : (
              <Trash2 className="size-5" />
            )}
          </Button>
        </div>
        <div className="pt-4 flex justify-between items-center border-t border-gray-50 mt-4">
          <p className="text-xl font-black text-[#3525CD] font-['Plus Jakarta Sans']">
            ${course.price}
          </p>
          <Link to={`/courses/${course._id}`}>
            <Button
              variant="outline"
              className="rounded-xl px-5 py-2 text-xs font-bold border-gray-200 hover:bg-gray-50 hover:text-[#3525CD] transition-all"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
