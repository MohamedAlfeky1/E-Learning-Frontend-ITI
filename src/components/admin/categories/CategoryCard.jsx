import EditCategoryDialog from "./EditCategoryDialog";
import DeleteCategoryDialog from "./DeleteCategoryDialog";

const CategoryCard = ({ category, isAdmin }) => {
  return (
    <div className="group flex flex-col w-full max-w-[400px] flex-shrink-0 p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-[#3525CD]/5 transition-all duration-300 transform hover:-translate-y-1 mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 bg-[#F1F3FF] flex justify-center items-center rounded-2xl text-[#3525CD] transition-colors group-hover:bg-[#3525CD] group-hover:text-white">
          <span className="text-2xl">{category.icon || "📚"}</span>
        </div>
        {isAdmin && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <EditCategoryDialog category={category} />
            <DeleteCategoryDialog category={category} />
          </div>
        )}
      </div>

      <div className="space-y-2 flex-1">
        <h3 className="text-[#141B2B] font-['Plus Jakarta Sans'] font-extrabold text-xl leading-snug">
          {category.name}
        </h3>
        <p className="text-[#464555] font-['Inter'] text-sm leading-relaxed opacity-70 line-clamp-3">
          {category.description}
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-50">
        <div className="space-y-0.5">
          <p className="uppercase text-[#777587] text-[10px] font-black tracking-widest leading-none">
            Inventory
          </p>
          <span className="text-[#3525CD] text-lg font-black font-['Plus Jakarta Sans']">
            {category.courseCount || 0}{" "}
            <span className="text-xs font-bold opacity-60">Courses</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
