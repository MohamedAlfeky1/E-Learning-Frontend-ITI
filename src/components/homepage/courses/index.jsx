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
import Autoplay from "embla-carousel-autoplay";
import { useState, useEffect } from "react";
import "./style.css";
import CourseCard from "./CourseCard";
import { useGetAllCourses } from "@/queries/useCourses";
import { Spinner } from "@/components/ui/spinner";

const Courses = () => {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const { data, isLoading, isError } = useGetAllCourses();
  const courses = data?.data ?? [];

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

  if (isLoading) {
    return (
      <section className="courses-section px-6 py-16 rounded-t-4xl">
        <div className="flex justify-center items-center">
          <Spinner className="size-8" />
          Loading courses...
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="courses-section px-6 py-16 rounded-t-4xl">
        <Empty className="text-center text-sm text-destructive">
          <EmptyHeader>
            <EmptyTitle>Unable to load courses.</EmptyTitle>
            <EmptyDescription>
              An error happened while fetching courses from server.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </section>
    );
  }

  return (
    <section className="courses-section px-6 py-16 rounded-t-4xl">
      <Carousel
        setApi={setApi}
        className="flex flex-col gap-10"
        plugins={[Autoplay({ delay: 3000 })]}
      >
        <div className="courses-heading flex justify-between">
          <h2 className="courses-heading-title text-[28px] sm:text-[36px]">
            Top Rated Courses
          </h2>
          <div className="arrows-container flex gap-2">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </div>

        <CarouselContent className="gap-8">
          {courses.map((course, index) => (
            <CarouselItem
              key={course._id ?? course.id ?? course.name ?? index}
              className="sm:basis-1/2 lg:basis-2/5 xl:basis-1/3"
            >
              <CourseCard course={course} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <Pagination>
          <PaginationContent className="flex gap-2">
            {/* TODO: fix pagination */}
            {courses.map((course, index) => {
              if (index >= courses.length - 1) return null;
              return (
                <PaginationItem key={course._id ?? course.id ?? index}>
                  <PaginationLink
                    href="#"
                    className={`pagination-link rounded-full ${current === index ? "active" : ""}`}
                    onClick={(event) => {
                      event.preventDefault();
                      api?.scrollTo(index);
                    }}
                  ></PaginationLink>
                </PaginationItem>
              );
            })}
          </PaginationContent>
        </Pagination>
      </Carousel>
    </section>
  );
};

export default Courses;
