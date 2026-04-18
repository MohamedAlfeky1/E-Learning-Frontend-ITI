import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import placeholderImg from "@/assets/placeholder.jpg";

const CourseCard = ({ course, categories }) => {
  const categoryObject = categories.find(
    (cat) => cat._id === course.categoryId || cat.id === course.categoryId
  );
  const categoryName = categoryObject?.name ?? "General";

  return (
    <div className="group h-[480px] w-full bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-[#3525CD]/5 transition-all duration-500 flex flex-col overflow-hidden">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.thumbnail || placeholderImg}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 backdrop-blur-md text-[#3525CD] border-none shadow-sm font-bold uppercase tracking-wider text-[9px] px-2.5 py-1">
            {categoryName}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-[#141B2B] font-['Plus Jakarta Sans'] font-extrabold text-xl leading-snug mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-[#3525CD] transition-colors">
          {course.title}
        </h3>
        <p className="text-[#464555] font-['Inter'] text-sm leading-relaxed opacity-70 line-clamp-3 mb-6 flex-1">
          {course.description}
        </p>

        {/* Footer Section */}
        <div className="pt-6 border-t border-gray-50 flex justify-between items-center mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">
              Tuition
            </span>
            <span className="text-2xl font-black text-[#141B2B] font-['Plus Jakarta Sans']">
              {course.type === "free" ? (
                <span className="text-[#3525CD]">FREE</span>
              ) : (
                `$${course.price}`
              )}
            </span>
          </div>
          <Link to={`/courses/${course._id}`}>
            <Button className="rounded-xl bg-[#141B2B] px-6 h-11 text-white hover:bg-black font-bold text-sm shadow-md transition-all active:scale-95">
              Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
