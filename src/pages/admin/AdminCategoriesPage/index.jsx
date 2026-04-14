import CategoryCard from "./CategoryCard";
import { useCategories } from "@/queries/categoryQueries";
import AddCategoryDialog from "./AddCategoryDialog";
import { Spinner } from "@/components/ui/spinner";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

const AdminCategoriesPage = () => {
  const { data, isLoading, isError } = useCategories();
  const categories = data?.data ?? [];

  return (
    <div className="bg-[#F9F9FF] p-6 md:p-12">
      {/* Header */}
      <header className="mb-8 flex flex-col lg:flex-row gap-4 justify-between lg:items-end">
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
        <AddCategoryDialog />
      </header>
      <div className="flex flex-wrap gap-8">
        {isLoading ? (
          <div className="w-full flex justify-center items-center gap-3">
            <Spinner className="size-8" />
            Loading categories...
          </div>
        ) : isError ? (
          <Empty className="text-center text-sm text-destructive">
            <EmptyHeader>
              <EmptyTitle>Unable to load categories.</EmptyTitle>
              <EmptyDescription>
                An error happened while fetching categories from server.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          categories &&
          categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))
        )}
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
