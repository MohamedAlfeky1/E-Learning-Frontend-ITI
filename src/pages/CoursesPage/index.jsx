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
import { useCallback, useEffect, useState } from "react";
import { useCategories } from "@/queries/categoryQueries";
import { useSearchCourses } from "@/mutations/useSearchMutations";
import Loader from "@/components/ui/loader";
import NewCourseCard from "@/components/course/NewCourseCard";
import CourseCard from "@/components/course/CourseCard";
import FilterDropdown from "@/components/course/FilterDropdown";
import { LEVELS, SORT_OPTIONS, TYPES } from "@/data/courseFilters";






const CoursesPage = () => {

  const { data, isLoading, error } = useGetAllCourses()
  const { data: categoriesData, isLoading: loadingCategories, error: errorCategories } = useCategories()
  const { mutate: searchCourses, data: results, isPending } = useSearchCourses()
  console.log(categoriesData?.data);
  console.log(data);


  /*States */
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    keyword: "",
    categoryId: null,
    level: null,
    type: null,
    minPrice: null,
    maxPrice: null
  })

  {/**functions */ }
  const handleFilters = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value === "" ? null : value }));
    setPage(1);
  }, []);



  const categories = categoriesData?.data ?? [];
  const hasFilters = Object.values(filters).some(v => v !== null && v !== "" && v !== undefined);
  const coursesToShow = hasFilters ? results?.data?.courses : data?.data;
  const loading = hasFilters ? isPending : isLoading;

  useEffect(() => {
    if (!hasFilters) return;
    searchCourses({ filters, sort, page });
  }, [filters, sort, page])


  return (
    <div className="p-6">
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-xs text-[#3525CD]">Course Catalog</p>
        <h1 className="text-5xl font-extrabold">Master New <span className="text-[#3525CD]">Dimensions</span></h1>
        <p className="font-normal text-md text-[#464555]">Unlock your potential with our world-class curricula designed by industry
          experts and academic pioneers.</p>
      </div>

      {/*Search bar */}
      <div className="bg-[#F1F3FF] rounded-md py-2 px-4 w-full flex flex-col md:flex-row gap-3 items-center justify-between ">
        <div className="relative">
          <IoSearchSharp className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-300 pointer-events-none z-10" />

          <Input
            variant='white'
            type='search'
            className='pl-9 text-black flex-1 w-full'
            placeholder="Search for courses, subjects, or skills..."
            onChange={(e) => handleFilters("keyword", e.target.value)} />

        </div>
        <div className="flex flex-col md:flex-row gap-3 items-center">

          <div className="flex flex-col md:flex-row items-center w-full gap-2 text-[#3525CD] text-md font-semibold">

            <div className="flex flex-row items-center gap-2 w-full">

              {/**category */}
              <FilterDropdown
                label={
                  filters.categoryId
                    ? categories.find(cat => cat._id === filters.categoryId)?.name || "Category"
                    : "Category"
                }
              >              <DropdownMenuLabel>Price</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={filters.categoryId}
                  onValueChange={(val) => handleFilters("categoryId", val === "all" ? "" : val)} >
                  <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                  {categories.map((category) => (
                    <DropdownMenuRadioItem key={category._id} value={category._id}>
                      {category.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </FilterDropdown>

              {/**level */}
              <FilterDropdown label={filters.level || "Level"}>
                <DropdownMenuLabel>Level</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={filters.level}
                  onValueChange={(val) => handleFilters("level", val === "all" ? "" : val)} >
                  <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                  {LEVELS.map((lvl) => {
                    return (
                      <DropdownMenuRadioItem key={lvl} value={lvl}>{lvl.charAt(0).toUpperCase() + lvl.slice(1)}</DropdownMenuRadioItem>
                    )
                  })}
                </DropdownMenuRadioGroup>
              </FilterDropdown>
            </div>

            <div className="flex flex-row items-center gap-2 w-full">


              {/* ✅ Type (free / paid) */}
              <FilterDropdown label={filters.type || "Type"}>
                <DropdownMenuLabel>Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={filters.type}
                  onValueChange={(val) => handleFilters("type", val === "all" ? "" : val)} >
                  <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                  {TYPES.map((type) => {
                    return (
                      <DropdownMenuRadioItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</DropdownMenuRadioItem>
                    )
                  })}
                </DropdownMenuRadioGroup>
              </FilterDropdown>

              {/* ✅ Sort */}
              <FilterDropdown label={SORT_OPTIONS.find(opt => opt.value === sort)?.label || "Sort by"}>
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={setSort} >
                  {SORT_OPTIONS.map((option) => {
                    return (
                      <DropdownMenuRadioItem key={option.value} value={option.value}>{option.label}</DropdownMenuRadioItem>
                    )
                  })}
                </DropdownMenuRadioGroup>
              </FilterDropdown>
            </div>

            {/**Price range — two controlled inputs */}
            <FilterDropdown label={
              filters.minPrice || filters.maxPrice
                ? `$${filters.minPrice || 0} – $${filters.maxPrice || "∞"}`
                : "Price"
            }>
              <DropdownMenuLabel>Price range</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="flex justify-between gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilters("minPrice", e.target.value ? Number(e.target.value) : null)}
                  className="w-60 rounded-md px-2"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilters("maxPrice", e.target.value ? Number(e.target.value) : null)}
                  className="w-60 rounded-md px-2"
                />
              </div>
            </FilterDropdown>

            <div className="flex items-center gap-1.5 px-4 py-2  rounded-lg text-sm font-medium">
              <SlidersHorizontal color="#3525CD" />
              <p>All Filters</p>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {loading ? (
          <div className="col-span-4 flex justify-center items-center min-h-40">
            <Loader />
          </div>
        ) : coursesToShow?.length > 0 ? (
          <>
            {hasFilters ? (
              coursesToShow.map((course) => (
                <div key={course._id} className="col-span-1">
                  <CourseCard course={course} />
                </div>
              ))
            ) : (
              <>
                <div key={coursesToShow[0]._id} className="col-span-2">
                  <NewCourseCard course={coursesToShow[0]} />
                </div>
                {coursesToShow.slice(1).map((course) => (
                  <div key={course._id} className="col-span-2 sm:col-span-2 md:col-span-1">
                    <CourseCard course={course} />
                  </div>
                ))}
              </>
            )}
          </>
        ) : (
          <div className="col-span-4 text-center text-gray-400 py-10">
            No courses found.
          </div>
        )}
      </div>


      {hasFilters && results?.data?.totalPages > 1 && (
        <div className="flex gap-2 justify-center mt-4">
          {Array.from({ length: results.data.totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded border ${page === i + 1 ? "bg-[#3525CD] text-white" : "bg-white"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

    </div>
  );
};

export default CoursesPage;
