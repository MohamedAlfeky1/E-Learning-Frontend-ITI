import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CourseImg from "../../../assets/homepage/courses/course-img.png";
import "./CourseCard.css";
import { Trash2 } from "lucide-react";

const CourseCard = () => {
  return (
    <div className="p-4 bg-white rounded-4xl flex flex-col sm:flex-row items-center gap-6 hover:scale-101 duration-150">
      <img
        src={CourseImg}
        alt="Course Image"
        className="h-[150px] rounded-xl"
      />
      <div className="grow flex flex-col justify-between">
        <div className="flex justify-between">
          <div>
            <Badge
              variant="ghost"
              className="course-category uppercase text-[10px] leading-[15px]"
            >
              fine arts
            </Badge>
            <p className="course-title">Modernism & The Digital Canvas</p>
          </div>
          <Button size="icon-sm" variant="destructive" className="rounded-full">
            <Trash2 color="red" />
          </Button>
        </div>
        <div className="price-details pt-4 flex justify-between items-end">
          <p className="price" style={{ color: "#3525CD" }}>
            $49.99
          </p>
          <Button className="details-btn px-4 py-2">Details</Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
