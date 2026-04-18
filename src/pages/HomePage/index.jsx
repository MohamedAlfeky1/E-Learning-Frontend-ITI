// Hero section imports
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PlayIcon from "../../assets/homepage/hero/play-icon.svg";
import HeroImage from "../../assets/homepage/hero/hero-image.png";
import { Link } from "react-router-dom";

// Categories section imports
import { ArrowRight } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import CategoryCard from "@/components/admin/categories/CategoryCard";
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
import { usePublicSliders } from "@/queries/slidersQueries";
import { useUserQuery } from "@/queries/authQueries";

const HomePage = () => {
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useUserQuery();
  const isAdmin = userData?.role === "admin";
  console.log(userData);

  const {
    data: publicSlidersData,
    isLoading: publicSlidersLoading,
    isError: publicSlidersError,
  } = usePublicSliders();
  const sliders = publicSlidersData?.data ?? [];

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();
  const categories = categoriesData?.data ?? [];

  const [heroApi, setHeroApi] = useState();
  const [heroCurrent, setHeroCurrent] = useState(0);
  const [coursesApi, setCoursesApi] = useState();
  const [coursesCurrent, setCoursesCurrent] = useState(0);
  const [coursesSlides, setCoursesSlides] = useState(0);

  const {
    data: coursesData,
    isLoading: coursesLoading,
    isError: coursesError,
  } = useGetAllCourses();
  const courses = coursesData?.data ?? [];

  // Hero carousel listener
  useEffect(() => {
    if (!heroApi) return;

    const onSelect = () => {
      setHeroCurrent(heroApi.selectedScrollSnap());
    };

    heroApi.on("select", onSelect);

    return () => {
      heroApi.off("select", onSelect);
    };
  }, [heroApi]);

  // Courses carousel listener
  useEffect(() => {
    if (!coursesApi) return;

    setCoursesSlides(coursesApi.scrollSnapList().length);

    const onSelect = () => {
      setCoursesCurrent(coursesApi.selectedScrollSnap());
    };

    coursesApi.on("select", onSelect);
    coursesApi.on("reInit", () => {
      setCoursesSlides(coursesApi.scrollSnapList().length);
    });

    return () => {
      coursesApi.off("select", onSelect);
    };
  }, [coursesApi]);

  return (
    <main className="flex flex-col gap-20 bg-[#F9F9FF]">
      {/* Dynamic Hero Section */}
      <section className="mt-6 mx-6 rounded-[40px] overflow-hidden relative group shadow-2xl">
        {publicSlidersLoading ? (
          <div className="w-full h-[600px] flex flex-col justify-center items-center gap-4 bg-[#F1F3FF]">
            <Spinner className="size-12 border-[#3525CD]" />
            <p className="text-gray-400 font-bold animate-pulse uppercase tracking-[2px]">
              Initializing Experience...
            </p>
          </div>
        ) : sliders.length > 0 ? (
          <Carousel
            plugins={[Autoplay({ delay: 6000 })]}
            className="w-full"
            setApi={setHeroApi}
          >
            <CarouselContent>
              {sliders.map((slider) => (
                <CarouselItem
                  key={slider._id}
                  className="relative h-[550px] sm:h-[650px] lg:h-[750px]"
                >
                  {/* Slider Background with Parallax-like effect */}
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[2000ms] group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${slider.imageUrl.startsWith("http") ? slider.imageUrl : `http://localhost:5000${slider.imageUrl}`})`,
                    }}
                  />
                  {/* Premium Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#141B2B]/95 via-[#141B2B]/60 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141B2B]/40 via-transparent to-transparent" />

                  {/* Content Container */}
                  <div className="relative h-full container mx-auto px-10 sm:px-20 flex flex-col justify-center gap-8 max-w-5xl">
                    <Badge className="w-fit rounded-full bg-[#E2DFFF]/20 backdrop-blur-xl px-4 py-2 text-white text-[11px] font-bold tracking-[2px] uppercase border border-white/20 animate-in fade-in slide-in-from-left-4 duration-700">
                      Welcome to ITI Digital Campus
                    </Badge>

                    <div className="space-y-4 animate-in fade-in slide-in-from-left-8 duration-1000 delay-100">
                      <h2 className="text-4xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.1] max-w-3xl">
                        {slider.title}
                      </h2>
                      <p className="text-lg sm:text-2xl text-white/70 leading-relaxed font-medium max-w-2xl">
                        {slider.description}
                      </p>
                    </div>

                    <div className="flex flex-col gap-5 sm:flex-row animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                      {slider.linkUrl && (
                        <Link to={slider.linkUrl} className="w-full sm:w-auto">
                          <Button className="w-full sm:w-auto rounded-full px-10 py-7 text-lg font-bold text-white bg-gradient-to-r from-[#3525CD] to-[#712AE2] border-0 shadow-[0_15px_30px_-10px_rgba(53,37,205,0.5)] hover:shadow-[#3525CD]/60 hover:-translate-y-1 transition-all">
                            {slider.buttonText || "Explore Now"}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Controls */}
            <div className="absolute bottom-12 right-12 flex gap-4 scale-90 sm:scale-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <CarouselPrevious className="static translate-y-0 h-14 w-14 rounded-full bg-white/10 border-white/20 text-white hover:bg-[#3525CD] hover:border-[#3525CD] transition-all" />
              <CarouselNext className="static translate-y-0 h-14 w-14 rounded-full bg-white/10 border-white/20 text-white hover:bg-[#3525CD] hover:border-[#3525CD] transition-all" />
            </div>

            {/* Custom Dot Indicators */}
            <div className="absolute bottom-12 left-10 sm:left-20 flex gap-3">
              {sliders.map((_, i) => (
                <button
                  key={i}
                  onClick={() => heroApi?.scrollTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    heroCurrent === i
                      ? "w-12 bg-white"
                      : "w-4 bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </Carousel>
        ) : (
          /* Empty State Fallback */
          <div className="w-full h-[600px] bg-[#F1F3FF] flex items-center justify-center">
            <p className="text-gray-400 font-medium italic">
              Preparing your digital campus journey...
            </p>
          </div>
        )}
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
                {isAdmin && (
                  <Link
                    to="/admin/categories"
                    className="flex items-center gap-2 text-[12px] sm:text-[16px] text-[#3525CD] font-semibold cursor-pointer hover:underline"
                  >
                    View All Categories <ArrowRight size={16} />
                  </Link>
                )}
              </div>
              <ScrollArea className="whitespace-nowrap">
                <div className="pb-4 flex gap-4">
                  {categories.map((category) => (
                    <div
                      key={category._id ?? category.id ?? category.name}
                      className="w-[320px] flex-shrink-0"
                    >
                      <CategoryCard category={category} isAdmin={isAdmin} />
                    </div>
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
              setApi={setCoursesApi}
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
                  {Array.from({ length: coursesSlides }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href="#"
                        className={`inline-block h-2 rounded-full transition-all duration-300 ${
                          coursesCurrent === index
                            ? "w-8 bg-[#3525CD]"
                            : "w-2 bg-[#c7c4d8] hover:bg-[#3525CD]"
                        }`}
                        onClick={(event) => {
                          event.preventDefault();
                          coursesApi?.scrollTo(index);
                        }}
                      ></PaginationLink>
                    </PaginationItem>
                  ))}
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
