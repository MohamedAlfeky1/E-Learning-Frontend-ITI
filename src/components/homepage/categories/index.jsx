import { ArrowRight } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import "./style.css";
import CategoryCard from "./CategoryCard";

const Categories = () => {
  return (
    <section className="mx-6 flex flex-col gap-10">
      <div className="heading flex justify-between">
        <div className="category-heading-title">
          <p className="text-[10px] sm:text-[12px]">DISCOVER DISCIPLINES</p>
          <h2 className="text-[28px] sm:text-[36px]">Curated Study Domains</h2>
        </div>
        <div className="view-all-categories self-end flex items-center text-[12px] sm:text-[16px]">
          View All Categories <ArrowRight size={16} />{" "}
        </div>
      </div>
      <ScrollArea className="whitespace-nowrap">
        <div className="flex gap-4">
          <CategoryCard />
          <CategoryCard />
          <CategoryCard />
          <CategoryCard />
          <CategoryCard />
          <CategoryCard />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
};

export default Categories;
