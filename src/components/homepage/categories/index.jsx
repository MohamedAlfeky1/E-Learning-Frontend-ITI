import { ArrowRight } from "lucide-react";
import Sigma from "../../../assets/homepage/categories/sigma.svg";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import "./style.css";

const Categories = () => {
  return (
    <section className="flex flex-col gap-10">
      <div className="heading flex justify-between">
        <div className="category-heading-title">
          <p>DISCOVER DISCIPLINES</p>
          <h2>Curated Study Domains</h2>
        </div>
        <div className="view-all-categories self-end flex items-center">
          View All Categories <ArrowRight size={16} />{" "}
        </div>
      </div>
      <ScrollArea className="whitespace-nowrap">
        <div className="flex gap-4">
          <div
            className="category-card w-75 p-8 rounded-2xl text-wrap flex flex-col gap-4"
            style={{ backgroundColor: "#F1F3FF" }}
          >
            <div className="category-icon w-[56px] h-[56px] bg-white flex justify-center items-center rounded-lg">
              <img src={Sigma} />
            </div>
            <h3 className="category-title">Mathematics</h3>
            <p className="category-description">
              From Algebra to Advanced Calculus and beyond.
            </p>
            <p className="category-num-courses">42 COURSES</p>
          </div>
          <div
            className="category-card w-75 p-8 rounded-2xl text-wrap flex flex-col gap-4"
            style={{ backgroundColor: "#F1F3FF" }}
          >
            <div className="category-icon w-[56px] h-[56px] bg-white flex justify-center items-center rounded-lg">
              <img src={Sigma} />
            </div>
            <h3 className="category-title">Mathematics</h3>
            <p className="category-description">
              From Algebra to Advanced Calculus and beyond.
            </p>
            <p className="category-num-courses">42 COURSES</p>
          </div>
          <div
            className="category-card w-75 p-8 rounded-2xl text-wrap flex flex-col gap-4"
            style={{ backgroundColor: "#F1F3FF" }}
          >
            <div className="category-icon w-[56px] h-[56px] bg-white flex justify-center items-center rounded-lg">
              <img src={Sigma} />
            </div>
            <h3 className="category-title">Mathematics</h3>
            <p className="category-description">
              From Algebra to Advanced Calculus and beyond.
            </p>
            <p className="category-num-courses">42 COURSES</p>
          </div>
          <div
            className="category-card w-75 p-8 rounded-2xl text-wrap flex flex-col gap-4"
            style={{ backgroundColor: "#F1F3FF" }}
          >
            <div className="category-icon w-[56px] h-[56px] bg-white flex justify-center items-center rounded-lg">
              <img src={Sigma} />
            </div>
            <h3 className="category-title">Mathematics</h3>
            <p className="category-description">
              From Algebra to Advanced Calculus and beyond.
            </p>
            <p className="category-num-courses">42 COURSES</p>
          </div>
          <div
            className="category-card w-75 p-8 rounded-2xl text-wrap flex flex-col gap-4"
            style={{ backgroundColor: "#F1F3FF" }}
          >
            <div className="category-icon w-[56px] h-[56px] bg-white flex justify-center items-center rounded-lg">
              <img src={Sigma} />
            </div>
            <h3 className="category-title">Mathematics</h3>
            <p className="category-description">
              From Algebra to Advanced Calculus and beyond.
            </p>
            <p className="category-num-courses">42 COURSES</p>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
};

export default Categories;
