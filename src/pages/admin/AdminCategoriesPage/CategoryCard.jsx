import AvatarGroupCountComponent from "./AvatarGroup";
import EditCategoryDialog from "./EditCategoryDialog";
import DeleteCategoryDialog from "./DeleteCategoryDialog";

const CategoryCard = ({ category }) => {
  return (
    <div className="flex-1 p-8 rounded-2xl bg-[#F1F3FF] flex flex-col gap-4 justify-between cursor-pointer hover:scale-[1.01] transition-transform duration-150">
      <div className="flex justify-between">
        <div className="w-[56px] h-[56px] bg-white flex justify-center items-center rounded-lg">
          {category.icon}
        </div>
        <div className="flex gap-2">
          <EditCategoryDialog category={category} />
          <DeleteCategoryDialog category={category} />
        </div>
      </div>
      <h3 className="text-[#141B2B] font-['Plus Jakarta Sans'] font-extrabold text-lg leading-7">
        {category.name}
      </h3>
      <p className="text-[#464555] font-['Inter'] text-sm leading-6">
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
