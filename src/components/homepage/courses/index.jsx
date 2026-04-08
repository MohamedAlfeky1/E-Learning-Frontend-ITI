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
import "./style.css";
import CourseCard from "./CourseCard";

const Courses = () => {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section>
      <Carousel setApi={setApi} className="flex flex-col gap-10">
        <div className="courses-heading flex justify-between">
          <h2 className="courses-heading-title text-[28px] sm:text-[36px]">
            Top Rated Courses
          </h2>
          <div className="arrows-container flex gap-2">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </div>

        <CarouselContent>
          <CarouselItem className="lg:basis-2/5 xl:basis-1/3">
            <CourseCard />
          </CarouselItem>
          <CarouselItem className="lg:basis-2/5 xl:basis-1/3">
            <CourseCard />
          </CarouselItem>
          <CarouselItem className="lg:basis-2/5 xl:basis-1/3">
            <CourseCard />
          </CarouselItem>
          <CarouselItem className="lg:basis-2/5 xl:basis-1/3">
            <CourseCard />
          </CarouselItem>
          <CarouselItem className="lg:basis-2/5 xl:basis-1/3">
            <CourseCard />
          </CarouselItem>
          <CarouselItem className="lg:basis-2/5 xl:basis-1/3">
            <CourseCard />
          </CarouselItem>
          <CarouselItem className="lg:basis-2/5 xl:basis-1/3">
            <CourseCard />
          </CarouselItem>
        </CarouselContent>
        <Pagination>
          <PaginationContent className="flex gap-2">
            <PaginationItem>
              <PaginationLink
                href="#"
                className={`pagination-link rounded-full ${current === 0 ? "active" : ""}`}
                onClick={(event) => {
                  event.preventDefault();
                  api.scrollTo(0);
                }}
              ></PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                className={`pagination-link rounded-full ${current === 1 ? "active" : ""}`}
                onClick={(event) => {
                  event.preventDefault();
                  api.scrollTo(1);
                }}
              ></PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                className={`pagination-link rounded-full ${current === 2 ? "active" : ""}`}
                onClick={(event) => {
                  event.preventDefault();
                  api.scrollTo(2);
                }}
              ></PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                className={`pagination-link rounded-full ${current === 3 ? "active" : ""}`}
                onClick={(event) => {
                  event.preventDefault();
                  api.scrollTo(3);
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
