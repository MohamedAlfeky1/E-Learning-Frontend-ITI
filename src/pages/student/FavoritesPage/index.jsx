import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { useFavorites } from "@/queries/favoritesQueries";
import CourseCard from "@/components/student/favorites/CourseCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Loader from "@/components/ui/loader";

const FavoritesPage = () => {
  const { data, isLoading, isRefetching, isError, refetch } = useFavorites();
  const favorites = data?.data ?? [];

  return (
    <div className="min-h-screen bg-[#F9F9FF] p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10 flex flex-col lg:flex-row gap-6 justify-between lg:items-end bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="space-y-1">
          <p className="uppercase text-[#3525CD] text-[10px] font-bold tracking-[2px] font-['Inter'] flex items-center gap-2">
            <span className="w-8 h-[2px] bg-[#3525CD]"></span>
            Your Collection
          </p>
          <h1 className="text-[#141B2B] text-[40px] font-extrabold leading-tight font-['Plus Jakarta Sans']">
            Favorites
          </h1>
          <p className="text-[#464555] text-sm font-medium opacity-80 font-['Inter']">
            All the courses you've saved for later in one place.
          </p>
        </div>
        <div className="bg-[#F1F3FF] px-6 py-4 rounded-2xl border border-blue-50 flex items-center gap-4">
          <div className="text-right">
            <p className="uppercase text-[#777587] text-[10px] font-black tracking-widest leading-none mb-1">
              Total Items
            </p>
            <span className="text-[#3525CD] text-3xl font-black font-['Plus Jakarta Sans'] flex justify-end">
              {isLoading ? (
                <Spinner className="text-[#3525CD] size-6" />
              ) : (
                favorites.length
              )}
            </span>
          </div>
        </div>
      </header>

      {/* Favorites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8">
        {isLoading || isRefetching ? (
          <div className="col-span-full py-20 flex justify-center items-center h-[60vh]">
            <Loader />
          </div>
        ) : isError ? (
          <div className="col-span-full">
            <Empty className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
              <EmptyHeader>
                <EmptyTitle className="text-3xl font-extrabold text-[#141B2B] font-['Plus Jakarta Sans']">
                  Unable to load favorites.
                </EmptyTitle>
                <EmptyDescription className="text-base font-medium text-[#464555] opacity-70">
                  An error happened while fetching favorites from server.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="mt-6">
                <Button
                  className="px-8 h-12 bg-[#3525CD] text-white rounded-xl font-bold"
                  onClick={() => refetch()}
                >
                  Try Again
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        ) : !favorites.length ? (
          <div className="col-span-full">
            <Empty className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
              <EmptyHeader>
                <EmptyTitle className="text-3xl font-extrabold text-[#141B2B] font-['Plus Jakarta Sans']">
                  No Favorites Yet
                </EmptyTitle>
                <EmptyDescription className="text-base font-medium text-[#464555] opacity-70 max-w-md mx-auto">
                  You haven't saved any courses to your favorites. Start
                  browsing our catalog and save the courses you love!
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="mt-6">
                <Link to={"/courses"}>
                  <Button className="px-8 h-12 bg-[#3525CD] text-white rounded-xl font-bold">
                    Browse Courses
                  </Button>
                </Link>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          favorites.map((favorite) => (
            <CourseCard key={favorite._id} favorite={favorite} />
          ))
        )}
      </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
