import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import "./CourseCard.css";
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
    <div className="p-4 bg-white rounded-4xl flex flex-col lg:flex-row gap-6 hover:scale-101 duration-150">
      <img
        src={course.thumbnail || placeholderImg}
        alt="Course Image"
        className="size-[150px] self-center lg:self-start rounded-xl"
      />
      <div className="grow flex flex-col justify-between">
        <div className="flex justify-between">
          <div>
            <Badge
              variant="ghost"
              className="course-category uppercase text-[10px] leading-[15px]"
            >
              {category.name}
            </Badge>
            <p className="course-title">{course.title}</p>
          </div>
          <Button
            onClick={() => removeFromCart(course._id)}
            size="icon-sm"
            variant="destructive"
            className="rounded-full"
          >
            {removePending ? <Spinner /> : <Trash2 color="red" />}
          </Button>
        </div>
        <div className="price-details pt-4 flex justify-between items-end">
          <p className="price" style={{ color: "#3525CD" }}>
            ${course.price}
          </p>
          <Link to={`/courses/${course._id}`}>
            <Button className="details-btn px-4 py-2">Details</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
