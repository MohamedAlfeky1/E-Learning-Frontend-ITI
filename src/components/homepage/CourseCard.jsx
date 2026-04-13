import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import "../../pages/HomePage/courses.css";
import { useEffect, useState } from "react";

const CourseCard = ({ course, categories }) => {
  const [category, setCategory] = useState("");

  useEffect(() => {
    const categoryObject = categories.find(
      (category) => category._id === course.categoryId,
    );
    setCategory(categoryObject?.name ?? "Unknown");
  }, []);

  return (
    <div className="course-card h-[500px] md:w-[400px] p-4 bg-white rounded-4xl flex flex-col gap-6">
      <img
        src={course.thumbnail}
        alt="Course Image"
        className="h-1/2 rounded-4xl object-cover"
      />
      <div className="course-details h-full px-4 pb-4 flex flex-col justify-between gap-2">
        <div className="grow flex flex-col gap-2">
          <Badge
            variant="ghost"
            className="course-category uppercase text-[10px] leading-[15px]"
          >
            {category}
          </Badge>
          <p className="course-title truncate">{course.title}</p>
          <p className="course-description grow truncate">
            {course.description}
          </p>
        </div>
        <div className="price-details pt-4 flex justify-between items-end">
          <p className="price">{`$${course.price}.00`}</p>
          <Button className="details-btn px-4 py-2">Details</Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
