import { useNavigate } from "react-router-dom";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    const id = category._id || category.id;
    if (id) {
      navigate(`/courses?categoryId=${id}`);
    }
  };

  return (
    <div
      onClick={handleCategoryClick}
      className="group flex flex-col w-full max-w-[400px] flex-shrink-0 p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-[#3525CD]/5 transition-all duration-300 transform hover:-translate-y-1 mx-auto cursor-pointer"
    >
      <div className="space-y-2 flex-1">
        <h3 className="text-[#141B2B] font-['Plus Jakarta Sans'] font-extrabold text-xl leading-snug truncate group-hover:text-[#3525CD] transition-colors">
          {category.name}
        </h3>
        <p className="text-[#464555] font-['Inter'] text-sm leading-relaxed opacity-70 truncate">
          {category.description}
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-50">
        <div className="space-y-0.5">
          <p className="uppercase text-[#777587] text-[10px] font-black tracking-widest leading-none">
            Inventory
          </p>
          <div className="flex justify-between items-center">
            <span className="text-[#3525CD] text-lg font-black font-['Plus Jakarta Sans']">
              {category.courseCount || 0}{" "}
              <span className="text-xs font-bold opacity-60">Courses</span>
            </span>
            <div className="h-8 w-8 rounded-full bg-[#F1F3FF] flex items-center justify-center text-[#3525CD] opacity-0 group-hover:opacity-100 transition-opacity">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
