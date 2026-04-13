import { Button } from "@/components/ui/button";
import { CirclePlus, SquarePlus } from "lucide-react";
import CategoryCard from "./CategoryCard";
import { useCategories } from "@/queries/useCategories";

const AdminCategoriesPage = () => {
  const { data, isLoading, isError } = useCategories();
  const categories = data?.data ?? [];

  return (
    <div className="min-h-screen bg-[#F9F9FF] p-6 md:p-12">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row gap-4 justify-between md:items-end">
        <div>
          <p className="uppercase mb-2 text-[#3525CD] text-[10px] font-bold tracking-[1.2px] font-['Inter']">
            Platform Architecture
          </p>
          <h1 className="mb-2 text-[#141B2B] text-[48px] font-extrabold leading-tight font-['Plus Jakarta Sans']">
            Study Domains & Categories
          </h1>
          <p className="max-w-md text-[#464555] text-base font-normal leading-7 font-['Inter']">
            Organize the high school curriculum into logical domains. Each
            category acts as a hub for specific course materials and teacher
            assignments.
          </p>
        </div>
        <Button className="inline-flex items-center gap-2 rounded-[20px] bg-[#3525CD] px-6 py-4 text-white text-base font-bold transition-transform duration-150 hover:scale-[1.01]">
          <CirclePlus />
          Create New Category
        </Button>
      </header>
      <div className="flex flex-wrap gap-8">
        {categories &&
          categories.map((category) => <CategoryCard category={category} />)}
        {/* TODO: add new hub button */}
        {/* <div className="new-hub grow sm:grow-0 px-8 py-20 flex flex-col gap-2 justify-center items-center">
          <div className="p-4 flex flex-col justify-center items-center rounded-full new-hub-icon-bg">
            <SquarePlus size={20} />
          </div>
          <h3 className="font-plus-jakarta font-weight-700">New Hub</h3>
          <p className="w-3/4 text-center font-inter font-weight-400 text-size-sm">
            Define a new study domain
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
