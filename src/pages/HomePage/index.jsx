// Hero section imports
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PlayIcon from "../../assets/homepage/hero/play-icon.svg";
import HeroImage from "../../assets/homepage/hero/hero-image.png";
import { Link } from "react-router-dom";

// Categories section imports
import { ArrowRight } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import CategoryCard from "../../components/homepage/CategoryCard";
import { useCategories } from "@/queries/categoryQueries";
import { Spinner } from "@/components/ui/spinner";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

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
import axiosInstance from "@/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { ENDPOINTS } from "@/api/endpoints";

const getSliders = async () => {
  const response = await axiosInstance.get("/admin" + ENDPOINTS.SLIDERS_LIST);
  return response.data;
};

const HomePage = () => {
  const {
    data: slidersData,
    isLoading: slidersLoading,
    isError: slidersError,
  } = useQuery({
    queryKey: ["sliders"],
    queryFn: getSliders,
  });

  if (!slidersLoading) console.log(slidersData);
  else console.log("Loading...");

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
    <main className="flex flex-col gap-20 bg-[#F9F9FF]">
      {/* Hero section */}
      <section className="mt-6 mx-6 p-8 flex flex-col rounded-[40px] gap-12 sm:p-[64px] xl:flex-row bg-[#F1F3FF]">
        <div className="flex flex-col gap-8 xl:justify-between">
          <Badge className="inline-flex items-center rounded-full bg-[#E2DFFF] px-4 py-1.5 text-[#3323CC] text-[11px] font-bold tracking-[1.1px] uppercase">
            WELCOME TO THE DIGITAL CAMPUS
          </Badge>
          <h2 className="text-4xl sm:text-7xl font-extrabold tracking-tight leading-tight">
            Elevate Your{" "}
            <span className="text-[#3525CD] italic">Potential.</span>
          </h2>
          <p className="text-base sm:text-xl text-[#464555] leading-8 max-w-2xl">
            A modern digital environment designed for high school excellence.
            Experience prestigious curricula with cutting-edge visual clarity.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link to="/courses" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto rounded-[20px] px-8 py-4 text-[14px] sm:text-[18px] font-bold text-white bg-gradient-to-r from-[#3525CD] to-[#712AE2] shadow-[0_8px_10px_-6_rgba(53,37,205,0.2),0_20px_25px_-5_rgba(53,37,205,0.2)] transition-transform duration-150 hover:scale-[1.01]">
                Explore Catalog
              </Button>
            </Link>
            <Button className="w-full sm:w-auto rounded-[20px] px-8 py-4 text-[14px] sm:text-[18px] font-bold text-[#3525CD] bg-white border border-[#3525CD] transition-transform duration-150 hover:scale-[1.01] inline-flex items-center justify-center gap-2">
              Watch Demo
              <img src={PlayIcon} className="w-5 h-5" alt="Play demo" />
            </Button>
          </div>
        </div>
        <img
          src={HeroImage}
          className="rounded-xl flex-1 object-cover"
          alt="Hero"
        />
      </section>

      {/* Categories section */}
      <section className="mx-6 flex flex-col gap-10">
        {categoriesLoading ? (
          <div className="flex justify-center items-center gap-3">
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
              <div className="flex justify-between items-end">
                <div className="max-w-xl">
                  <p className="text-[10px] sm:text-[12px] text-[#712AE2] font-semibold tracking-[1.2px] uppercase mb-2">
                    DISCOVER DISCIPLINES
                  </p>
                  <h2 className="text-[28px] sm:text-[36px] text-[#141B2B] font-extrabold leading-tight">
                    Curated Study Domains
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-[12px] sm:text-[16px] text-[#3525CD] font-semibold">
                  View All Categories <ArrowRight size={16} />
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
      <section className="px-6 py-16 rounded-t-[2rem] bg-[#F1F3FF]">
        {coursesLoading ? (
          <div className="flex justify-center items-center gap-3">
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
              <div className="flex justify-between items-center">
                <h2 className="text-[28px] sm:text-[36px] text-[#141B2B] font-extrabold leading-tight">
                  Top Rated Courses
                </h2>
                <div className="flex gap-2">
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
                    <CourseCard course={course} categories={categories} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <Pagination>
                <PaginationContent className="flex gap-2">
                  {courses.map((course, index) => {
                    if (index >= courses.length - 1) return null;
                    return (
                      <PaginationItem key={course._id ?? course.id ?? index}>
                        <PaginationLink
                          href="#"
                          className={`inline-block h-2 rounded-full transition-all duration-200 ${
                            current === index
                              ? "w-8 bg-[#3525CD]"
                              : "w-2 bg-[#c7c4d8] hover:bg-[#3525CD]"
                          }`}
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
