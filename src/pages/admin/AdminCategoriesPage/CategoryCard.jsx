import { Pencil, Trash2 } from "lucide-react";
import "./CategoryCard.css";
import AvatarGroupCountComponent from "./AvatarGroup";
import { Button } from "@/components/ui/button";

const CategoryCard = ({ category }) => {
  return (
    <div
      className="category-card grow p-8 rounded-2xl text-wrap flex flex-col gap-4 justify-between cursor-pointer hover:scale-101 duration-150"
      style={{ backgroundColor: "#F1F3FF" }}
    >
      <div className="flex justify-between">
        <div className="category-icon size-[56px] bg-white flex justify-center items-center rounded-lg">
          {category.icon}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="icon">
            <Pencil size={22} />
          </Button>
          <Button variant="destructive" size="icon">
            <Trash2 size={22} />
          </Button>
        </div>
      </div>
      <h3 className="category-title">{category.name}</h3>
      <p className="category-description">
        From Algebra to Advanced Calculus and beyond.
      </p>
      <div className="flex justify-between items-end">
        <p className="category-num-courses">{category.courseCount} COURSES</p>
        <AvatarGroupCountComponent />
      </div>
    </div>
  );
};

export default CategoryCard;
