import { Sigma } from "lucide-react";
import "./CategoryCard.css";
import AvatarGroupCountComponent from "./AvatarGroup";

const CategoryCard = () => {
  return (
    <div
      className="category-card flex-1 p-8 rounded-2xl text-wrap flex flex-col gap-4"
      style={{ backgroundColor: "#F1F3FF" }}
    >
      <div className="category-icon size-[56px] bg-white flex justify-center items-center rounded-lg">
        <Sigma color="#3525CD" />
      </div>
      <h3 className="category-title">Mathematics</h3>
      <p className="category-description">
        From Algebra to Advanced Calculus and beyond.
      </p>
      <div className="flex justify-between items-end">
        <p className="category-num-courses">42 COURSES</p>
        <AvatarGroupCountComponent />
      </div>
    </div>
  );
};

export default CategoryCard;
