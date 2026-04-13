// Hero section imports
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PlayIcon from "../../assets/homepage/hero/play-icon.svg";
import HeroImage from "../../assets/homepage/hero/hero-image.png";
import { Link } from "react-router-dom";
import "./hero.css";

// Categories section imports
import { ArrowRight } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import CategoryCard from "../../components/homepage/CategoryCard";
import { useCategories } from "@/queries/useCategories";
import { Spinner } from "@/components/ui/spinner";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import "./categories.css";

// Courses section imports
import { useState, useEffect } from "react";
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
import CourseCard from "../../components/homepage/CourseCard.jsx";
import { useGetAllCourses } from "@/queries/useCourses";
import "./courses.css";

const HomePage = () => {
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();
  const categories = categoriesData?.data ?? [];

  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const {
    data: coursesData,
    isLoading: coursesLoading,
    isError: coursesError,
  } = useGetAllCourses();
  const courses = coursesData?.data ?? [];

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
    <main
      className="flex flex-col gap-20"
      style={{ backgroundColor: "#F9F9FF" }}
    >
      {/* Hero section */}
      <section
        className="mt-6 mx-6 p-8 flex flex-col rounded-[40px] gap-12 sm:p-[64px] xl:flex-row"
        style={{ backgroundColor: "#F1F3FF" }}
      >
        <div className="flex flex-col gap-8 xl:justify-between">
          <Badge className="hero-welcome-badge">
            WELCOME TO THE DIGITAL CAMPUS
          </Badge>
          <h2 className="hero-heading text-4xl sm:text-7xl">
            Elevate Your{" "}
            <span style={{ color: "#3525CD", fontStyle: "italic" }}>
              Potential.
            </span>
          </h2>
          <p className="hero-description">
            A modern digital environment designed for high school excellence.
            Experience prestigious curricula with cutting-edge visual clarity.
          </p>
          <div className="btns flex flex-col gap-[16px] sm:flex-row">
            <Link to="/courses">
              <Button className="w-full hero-btn explore-btn text-[14px] sm:text-[18px] hover:scale-101 duration-150">
                Explore Catalog
              </Button>
            </Link>
            <Button className="hero-btn demo-btn text-[14px] sm:text-[18px] hover:scale-101 duration-150">
              Watch Demo
              <img src={PlayIcon} style={{ width: "20px", height: "20px" }} />
            </Button>
          </div>
        </div>
        <img src={HeroImage} className="rounded-xl flex-1" />
      </section>

      {/* Categories section */}
      <section className="mx-6 flex flex-col gap-10">
        {categoriesLoading ? (
          <div className="flex justify-center items-center">
            <Spinner className="size-8" />
            Loading categories...
          </div>
        ) : categoriesError ? (
          <Empty className="text-center text-sm text-destructive">
            <EmptyHeader>
              <EmptyTitle>Unable to load categories.</EmptyTitle>
              <EmptyDescription>
                An error happened while fetching categories from server.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          categories.length && (
            <>
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
            </>
          )
        )}
      </section>

      {/* Courses section */}
      <section className="courses-section px-6 py-16 rounded-t-4xl">
        {coursesLoading ? (
          <div className="flex justify-center items-center">
            <Spinner className="size-8" />
            Loading courses...
          </div>
        ) : coursesError ? (
          <Empty className="text-center text-sm text-destructive">
            <EmptyHeader>
              <EmptyTitle>Unable to load courses.</EmptyTitle>
              <EmptyDescription>
                An error happened while fetching courses from server.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
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
                  {/* TODO: fix pagination  */}
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
          </>
        )}
      </section>
    </main>
  );
};

export default HomePage;
