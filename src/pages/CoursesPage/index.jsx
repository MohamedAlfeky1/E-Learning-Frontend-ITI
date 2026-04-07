import { Input } from "@/components/ui/input";
import { useGetAllCourses } from "@/queries/useCourses";
import { IoSearchSharp } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { SlidersHorizontal, ChevronDown } from "lucide-react"
import { useState } from "react";
import { useGetGategories } from "@/queries/categoryQueries";
import { useSearchCourses } from "@/mutations/useSearchMutations";

const PRICE_RANGES = [
  { label: "All",       min: undefined, max: undefined },
  { label: "Free",      min: 0,         max: 0         },
  { label: "Under $50", min: 1,         max: 50        },
  { label: "$50–$100",  min: 50,        max: 100       },
  { label: "Over $100", min: 100,       max: undefined },
]

const FilterDropdown = ({ label, children }) => (
  <DropdownMenu>
    <DropdownMenuTrigger className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors outline-none">
      {label}
      <ChevronDown className="w-4 h-4 text-gray-400" />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" className="min-w-[160px]">
      {children}
    </DropdownMenuContent>
  </DropdownMenu>
)


const CoursesPage = () => {

  const { data, isLoading, error } = useGetAllCourses()
const { mutate: searchCourses, data: results, isPending } = useSearchCourses()
  const { data:resultsGategories, isLoading :loadingGategories, error:errorGategories } = useGetGategories()
  console.log(resultsCourses);
  

    const [filters, setFilters] = useState({
    categoryId: "",
    level: "",
    type: "",
    minPrice: undefined,
    maxPrice: undefined,
    keyword: "",
  })
  const [sort, setSort] = useState("")
  const [page, setPage] = useState(1)

  console.log(data);

    



  return (
    <div>
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-xs text-[#3525CD]">Course Catalog</p>
        <h1 className="text-6xl font-extrabold">Master New <span className="text-[#3525CD]">Dimensions</span></h1>
        <p className="font-normal text-md text-[#464555]">Unlock your potential with our world-class curricula designed by industry
          experts and academic pioneers.</p>
      </div>

      {/*Search bar */}

      <div className="bg-[#F1F3FF] rounded-md py-2 px-4 flex flex-col md:flex-row justify-between items-center">
        <div className='relative'>
          <IoSearchSharp className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-300 pointer-events-none z-10" />
          <Input
            variant='white'
            className='pl-9'
            placeholder='Search for courses, subjects, or skills...'
          />
        </div>
      <div className="bg-[#F1F3FF] rounded-md py-3 px-4 flex flex-col md:flex-row justify-between items-center gap-3">  

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">

          {/* Category */}
          <FilterDropdown label={filters.categoryId || "Category"}>
            <DropdownMenuLabel>Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={filters.categoryId}
              onValueChange={(val) => updateFilter("categoryId", val === "all" ? "" : val)}
            >
              <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="development">Development</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="design">Design</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="business">Business</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="marketing">Marketing</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </FilterDropdown>

          {/* Price Range */}
          <FilterDropdown label={priceLabel}>
            <DropdownMenuLabel>Price Range</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={`${filters.minPrice ?? ""}-${filters.maxPrice ?? ""}`}
              onValueChange={(val) => {
                const range = PRICE_RANGES.find(
                  (r) => `${r.min ?? ""}-${r.max ?? ""}` === val
                )
                if (range) {
                  setFilters((prev) => ({
                    ...prev,
                    minPrice: range.min,
                    maxPrice: range.max,
                  }))
                  setPage(1)
                }
              }}
            >
              {PRICE_RANGES.map((r) => (
                <DropdownMenuRadioItem
                  key={r.label}
                  value={`${r.min ?? ""}-${r.max ?? ""}`}
                >
                  {r.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </FilterDropdown>

          {/* Rating (maps to sort=rating) */}
          <FilterDropdown label="Rating">
            <DropdownMenuLabel>Sort by Rating</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={sort}
              onValueChange={(val) => { setSort(val); setPage(1) }}
            >
              <DropdownMenuRadioItem value="">Newest</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="rating">Highest Rated</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="popular">Most Popular</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </FilterDropdown>

          {/* All Filters */}
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#3525CD] hover:bg-[#3525CD]/10 rounded-lg transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            All Filters
          </button>
        </div>
      </div>


      </div>
    </div>
  );
};

export default CoursesPage;
