import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { useState, useEffect } from "react";
import Sigma from "../../../assets/homepage/categories/sigma.svg";
import "./style.css";

const Courses = () => {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section>
      <Carousel setApi={setApi} className="flex flex-col gap-10">
        <div className="courses-heading flex justify-between">
          <h2 className="courses-heading-title text-[28px] sm:text-[36px]">Top Rated Courses</h2>
          <div className="arrows-container flex gap-2">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </div>

        <CarouselContent>
          <CarouselItem>
            <div
              className="category-card p-8 rounded-2xl text-wrap flex flex-col gap-4"
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
          </CarouselItem>
          <CarouselItem>
            <div
              className="category-card p-8 rounded-2xl text-wrap flex flex-col gap-4"
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
          </CarouselItem>
          <CarouselItem>
            <div
              className="category-card p-8 rounded-2xl text-wrap flex flex-col gap-4"
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
          </CarouselItem>
          <CarouselItem>
            <div
              className="category-card p-8 rounded-2xl text-wrap flex flex-col gap-4"
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
          </CarouselItem>
        </CarouselContent>
        <Pagination>
          <PaginationContent className="flex gap-2">
            <PaginationItem>
              <PaginationLink
                href="#"
                className="pagination-link rounded-full"
                onClick={(event) => {
                  event.preventDefault();
                  api.scrollTo(0);
                  if (current === 0) {
                    event.target.classList.add("active");
                  } else {
                    event.target.classList.remove("active");
                  }
                }}
              ></PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                className="pagination-link rounded-full"
                onClick={(event) => {
                  event.preventDefault();
                  api.scrollTo(1);
                  if (current === 1) {
                    event.target.classList.add("active");
                    console.log(event.target.className);
                  } else {
                    event.target.classList.remove("active");
                    console.log(event.target.className);
                  }
                }}
              ></PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                className="pagination-link rounded-full"
                onClick={(event) => {
                  event.preventDefault();
                  api.scrollTo(2);
                  if (current === 3) {
                    event.target.classList.add("active");
                  } else {
                    event.target.classList.remove("active");
                  }
                }}
              ></PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                className="pagination-link rounded-full"
                onClick={(event) => {
                  event.preventDefault();
                  api.scrollTo(3);
                  if (current === 3) {
                    event.target.classList.add("active");
                  } else {
                    event.target.classList.remove("active");
                  }
                }}
              ></PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Carousel>
    </section>
  );
};

export default Courses;
