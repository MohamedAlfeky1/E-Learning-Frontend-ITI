import CategoryCard from "@/components/admin/categories/CategoryCard";
import { useCategories } from "@/queries/categoryQueries";
import AddCategoryDialog from "@/components/admin/categories/AddCategoryDialog";
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
    <div className="bg-[#F9F9FF] min-h-screen p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10 flex flex-col lg:flex-row gap-6 justify-between lg:items-end bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="space-y-1">
            <p className="uppercase text-[#3525CD] text-[10px] font-bold tracking-[2px] font-['Inter'] flex items-center gap-2">
              <span className="w-8 h-[2px] bg-[#3525CD]"></span>
              Platform Architecture
            </p>
            <h1 className="text-[#141B2B] text-[40px] font-extrabold leading-tight font-['Plus Jakarta Sans']">
              Study Domains
            </h1>
            <p className="text-[#464555] text-sm font-medium opacity-80 font-['Inter'] max-w-md">
              Organize the curriculum into logical domains. Each category acts
              as a hub for materials and assignments.
            </p>
          </div>
          <AddCategoryDialog />
        </header>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading ? (
            <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col justify-center items-center gap-4">
              <Spinner className="text-[#3525CD] size-10" />
              <p className="text-[#464555] font-bold animate-pulse">
                Fetching domains...
              </p>
            </div>
          ) : isError ? (
            <div className="col-span-full">
              <Empty className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
                <EmptyHeader>
                  <EmptyTitle className="text-3xl font-extrabold text-[#141B2B] font-['Plus Jakarta Sans']">
                    Unable to load categories.
                  </EmptyTitle>
                  <EmptyDescription className="text-base font-medium text-[#464555] opacity-70">
                    An error happened while fetching categories from server.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          ) : !categories.length ? (
            <div className="col-span-full">
              <Empty className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
                <EmptyHeader>
                  <EmptyTitle className="text-3xl font-extrabold text-[#141B2B] font-['Plus Jakarta Sans']">
                    No Domains Yet
                  </EmptyTitle>
                  <EmptyDescription className="text-base font-medium text-[#464555] opacity-70">
                    Your platform doesn't have any study domains. Create your
                    first one to get started!
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent className="mt-6 text-center">
                  <AddCategoryDialog />
                </EmptyContent>
              </Empty>
            </div>
          ) : (
            categories.map((category) => (
              <CategoryCard
                key={category.slug}
                category={category}
                isAdmin={true}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
