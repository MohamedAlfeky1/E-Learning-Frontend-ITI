import EditCategoryDialog from "./EditCategoryDialog";
import DeleteCategoryDialog from "./DeleteCategoryDialog";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/admin/categories/${category._id}`)}
      className="group flex flex-col w-full max-w-[400px] flex-shrink-0 p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-[#3525CD]/5 transition-all duration-300 transform hover:-translate-y-1 mx-auto cursor-pointer"
    >
      <div className="space-y-3 flex-1">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-[#141B2B] font-['Plus Jakarta Sans'] font-extrabold text-xl leading-snug truncate">
            {category.name}
          </h3>
          <div
            className="z-20 -mt-1 -mr-2"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-gray-100 text-gray-500"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-40 rounded-xl p-1 shadow-lg border-gray-100"
              >
                <EditCategoryDialog
                  category={category}
                  trigger={
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer font-medium text-sm"
                    >
                      <Pencil className="h-4 w-4 text-indigo-600" />
                      <span>Edit Category</span>
                    </DropdownMenuItem>
                  }
                />
                <DeleteCategoryDialog
                  category={category}
                  trigger={
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer font-medium text-sm text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  }
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className="text-[#464555] font-['Inter'] text-sm leading-relaxed opacity-70 truncate">
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
