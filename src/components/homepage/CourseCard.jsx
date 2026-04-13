import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
            className="uppercase text-[10px] leading-[15px] text-[#712AE2] font-semibold"
          >
            {category}
          </Badge>
          <p className="truncate text-[#141B2B] font-extrabold text-xl leading-7">{course.title}</p>
          <p className="grow truncate text-[#464555] text-sm leading-6">
            {course.description}
          </p>
        </div>
        <div className="pt-4 flex justify-between items-end">
          <p className="text-[#141B2B] font-extrabold text-lg leading-7">{`$${course.price}.00`}</p>
          <Button className="px-4 py-2 rounded-full bg-[#E1E8FD] text-[#3525CD] font-bold hover:bg-[#d3d5f2]">
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
