import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";

const FilterDropdown = ({ label, children }) => (
  <DropdownMenu>
    <DropdownMenuTrigger
      className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-lg text-sm font-medium 
  text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors outline-none">
      {label}
      <ChevronDown className="w-4 h-4 text-gray-400" />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" className="min-w-[160px]">
      {children}
    </DropdownMenuContent>
  </DropdownMenu>

)
export default FilterDropdown;