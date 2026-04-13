import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CourseImg from "../../../assets/homepage/courses/course-img.png";
import "./style.css";

const CourseCard = ({ course }) => {
  return (
    <div className="course-card md:w-[400px] p-4 bg-white rounded-4xl flex flex-col gap-6 ">
      <img
        src={CourseImg}
        alt="Course Image"
        className="course-img rounded-4xl"
      />
      <div className="course-details px-4 pb-4 flex flex-col gap-2">
        <Badge
          variant="ghost"
          className="course-category uppercase text-[10px] leading-[15px]"
        >
          fine arts
        </Badge>
        <p className="course-title truncate">{course.title}</p>
        <p className="course-description truncate">
          {course.description}
        </p>
        <div className="price-details pt-4 flex justify-between items-end">
          <p className="price">{`$${course.price}.00`}</p>
          <Button className="details-btn px-4 py-2">Details</Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
