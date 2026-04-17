import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCourse } from "@/queries/useCourse";
import placeholderImg from "@/assets/placeholder.jpg";
import { useGetCategoryById } from "@/queries/categoryQueries";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteFavoriteMutation } from "@/mutations/useDeleteFavoriteMutation";

const CourseCard = ({ favorite }) => {
  const [isFavorite, setIsFavorite] = useState(true);
  const {
    data: courseData,
    isLoading,
    error,
  } = useCourse(favorite.courseId._id);
  const course = courseData?.data ?? {};

  const {
    mutateAsync: removeFromFavorites,
    isPending: isRemoving,
    error: removeFromFavoritesError,
  } = useDeleteFavoriteMutation();

  const { data: categoryData } = useGetCategoryById(course.categoryId);
  const category = categoryData?.data ?? {};

  return (
    <div className="course-card w-[200px] md:w-[300px] p-4 bg-white rounded-4xl flex flex-col gap-6 relative hover:scale-102 transition-transform duration-300 cursor-pointer">
      <Button
        variant="primary"
        size="icon"
        className="bg-white/70 hover:bg-white/80 absolute top-8 right-8 cursor-pointer"
        onClick={() => {
          removeFromFavorites(favorite._id);
        }}
      >
        {isRemoving ? (
          <Spinner className="text-black" />
        ) : (
          <Heart
            className="size-6"
            fill={isFavorite ? "#BA1A1A" : ""}
            color={isFavorite ? "#BA1A1A" : ""}
          />
        )}
      </Button>

      <img
        src={course?.thumbnail || placeholderImg}
        alt="Course Image"
        className="course-img rounded-4xl"
      />
      <div className="course-details px-4 pb-4 flex flex-col gap-2">
        <Badge
          variant="ghost"
          className="course-category uppercase text-[10px] leading-[15px]"
        >
          {category.name}
        </Badge>
        <p className="course-title truncate">{course.title}</p>
        <p className="course-description truncate">{course.description}</p>
        <div className="price-details pt-4 flex flex-col gap-3 md:flex-row md:justify-between md:items-end">
          <Link to={`/courses/${course._id}`}>
            <Button className="details-btn px-4 py-2">Details</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
