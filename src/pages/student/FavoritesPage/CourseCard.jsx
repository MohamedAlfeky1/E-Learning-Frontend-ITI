import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CourseImg from "../../../assets/favorites/favorite-card-thumb.jpg";
import { useState } from "react";
import { Heart } from "lucide-react";
import "./CourseCard.css";

const CourseCard = () => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="course-card w-full lg:w-[300px] p-4 bg-white rounded-4xl flex flex-col gap-6 relative hover:scale-102 transition-transform duration-300 cursor-pointer">
      <Button
        variant="primary"
        size="icon"
        className="bg-white/70 hover:bg-white/80 absolute top-8 right-8 cursor-pointer"
        onClick={() => {
          setIsFavorite(!isFavorite);
        }}
      >
        <Heart
          className="size-6"
          fill={isFavorite ? "#BA1A1A" : ""}
          color={isFavorite ? "#BA1A1A" : ""}
        />
      </Button>

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
        <p className="course-title truncate">Modernism & The Digital Canvas</p>
        <p className="course-description truncate">
          Exploring the intersection of traditional painting and digital media.
        </p>
        <div className="price-details pt-4 flex justify-between items-end">
          <p className="price">$49.99</p>
          <Button className="details-btn px-4 py-2">Details</Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
