import { Pencil, Trash2 } from "lucide-react";
import AvatarGroupCountComponent from "./AvatarGroup";
import { Button } from "@/components/ui/button";

const CategoryCard = ({ category }) => {
  return (
    <div className="flex-1 p-8 rounded-2xl bg-[#F1F3FF] flex flex-col gap-4 justify-between cursor-pointer hover:scale-[1.01] transition-transform duration-150">
      <div className="flex justify-between">
        <div className="w-[56px] h-[56px] bg-white flex justify-center items-center rounded-lg">
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
      <h3 className="text-[#141B2B] font-['Plus Jakarta Sans'] font-extrabold text-lg leading-7 truncate">
        {category.name}
      </h3>
      <p className="text-[#464555] font-['Inter'] text-sm leading-6 truncate">
        {category.description}
      </p>
      <div className="flex justify-between items-end">
        <p className="text-[#3525CD] font-['Inter'] font-bold text-[10px] leading-[15px] uppercase">
          {category.courseCount} COURSES
        </p>
        <AvatarGroupCountComponent />
      </div>
    </div>
  );
};

export default CategoryCard;
