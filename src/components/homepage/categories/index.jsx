import { ArrowRight } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import "./style.css";
import CategoryCard from "./CategoryCard";
import { useCategories } from "@/queries/useCategories";
import { Spinner } from "@/components/ui/spinner";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

const Categories = () => {
  const { data, isLoading, isError } = useCategories();
  const categories = data?.data ?? [];

  if (isLoading) {
    return (
      <section className="mx-6 flex flex-col gap-10">
        <div className="flex justify-center items-center">
          <Spinner className="size-8" />
          Loading categories...
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mx-6 flex flex-col gap-10">
        <Empty className="text-center text-sm text-destructive">
          <EmptyHeader>
            <EmptyTitle>Unable to load categories.</EmptyTitle>
            <EmptyDescription>
              An error happened while fetching categories from server.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </section>
    );
  }

  return (
    <>
      {categories.length > 0 && (
        <>
          <section className="mx-6 flex flex-col gap-10">
            <div className="heading flex justify-between">
              <div className="category-heading-title">
                <p className="text-[10px] sm:text-[12px]">
                  DISCOVER DISCIPLINES
                </p>
                <h2 className="text-[28px] sm:text-[36px]">
                  Curated Study Domains
                </h2>
              </div>
              <div className="view-all-categories self-end flex items-center text-[12px] sm:text-[16px]">
                View All Categories <ArrowRight size={16} />{" "}
              </div>
            </div>
            <ScrollArea className="whitespace-nowrap">
              <div className="pb-4 flex gap-4">
                {categories.map((category) => (
                  <CategoryCard
                    key={category._id ?? category.id ?? category.name}
                    category={category}
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </section>
        </>
      )}
    </>
  );
};

export default Categories;
