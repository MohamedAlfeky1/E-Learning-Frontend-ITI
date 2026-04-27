import React from "react";
import { FaStar } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import placeholderImg from "@/assets/placeholder.jpg";

const CourseCard = ({ course, categories }) => {
  const categoryObject = categories?.find(
    (cat) => cat._id === course.categoryId || cat.id === course.categoryId,
  );
  const categoryName = categoryObject?.name ?? "General";

  return (
    <Link to={`/courses/${course._id}`}>
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
          {/* Top Row: Language & Rating */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-[#3525CD] uppercase tracking-widest bg-[#3525CD]/5 px-2 py-0.5 rounded">
              {course.language && course.language !== "none"
                ? course.language
                : "English"}
            </span>
            <div className="flex items-center gap-1 text-sm font-bold text-[#141B2B]">
              <FaStar className="text-yellow-400 size-3.5" />
              <span>{course.totalReviews ?? "4.9"}</span>
              <span className="text-gray-400 font-medium text-[11px]">
                ({course.ratingCount ?? course.totalReviews ?? 0})
              </span>
            </div>
          </div>

          <h3 className="text-[#141B2B] font-['Plus Jakarta Sans'] font-extrabold text-xl leading-snug mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-[#3525CD] transition-colors">
            {course.title}
          </h3>

          {/* Instructor */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-gray-500">
              Instructor:{" "}
              <span className="font-semibold text-gray-700">
                {course.teacherId?.firstName} {course.teacherId?.lastName}
              </span>
            </span>
          </div>

          <p className="text-[#464555] font-['Inter'] text-sm leading-relaxed opacity-70 line-clamp-2 mb-6">
            {course.description}
          </p>

          {/* Footer Section */}
          <div className="pt-6 border-t border-gray-50 flex justify-between items-center mt-auto">
            <span className="text-2xl font-black text-[#141B2B] font-['Plus Jakarta Sans']">
              {course.type === "free" ? (
                <span className="text-[#3525CD]">FREE</span>
              ) : (
                `$${course.price}`
              )}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
