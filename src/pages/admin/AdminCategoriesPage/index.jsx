import { Button } from "@/components/ui/button";
import { CirclePlus, SquarePlus } from "lucide-react";
import "./style.css";
import CategoryCard from "./CategoryCard";
import { useCategories } from "@/queries/useCategories";

const AdminCategoriesPage = () => {
  const { data, isLoading, isError } = useCategories();
  const categories = data?.data ?? [];

  return (
    <div className="min-h-screen text-white p-6 md:p-12 font-sans categories-page-bg">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row gap-4 justify-between md:items-end">
        <div>
          <p className="tracking-widest uppercase mb-2 text-primary text-size-xs font-weight-700 font-inter">
            Platform Architecture
          </p>
          <h1 className="mb-2 text-dark text-size-3xl font-weight-800 font-plus-jakarta">
            Study Domains & Categories
          </h1>
          <p className="text-muted-foreground max-w-md text-secondary text-size-base font-weight-400 font-inter">
            Organize the high school curriculum into logical domains. Each
            category acts as a hub for specific course materials and teacher
            assignments.
          </p>
        </div>
        <Button className="continue-btn font-inter font-weight-700 hover:scale-101 duration-150">
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
