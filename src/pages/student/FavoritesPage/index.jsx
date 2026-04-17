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
import CourseCard from "./CourseCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FavoritesPage = () => {
  const { data, isLoading, isRefetching, isError, refetch } = useFavorites();
  const favorites = data?.data ?? [];

  return (
    <div className="min-h-screen text-white p-6 md:p-12 font-sans favorites-page-bg">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-end">
        <div>
          <p className="tracking-widest uppercase mb-2 text-primary text-size-xs font-weight-700 font-inter">
            Saved Content
          </p>
          <h1 className="mb-2 text-dark text-size-3xl font-weight-800 font-plus-jakarta">
            Favorites
          </h1>
          <p className="text-muted-foreground max-w-md text-secondary text-size-base font-weight-400 font-inter">
            Your curated collection of premium courses and study guides.
          </p>
        </div>
        <div className="text-right">
          <span className="text-primary text-size-xl font-weight-700 font-inter flex justify-end">
            {isLoading ? <Spinner className="text-black" /> : favorites.length}
          </span>
          <p className="uppercase text-secondary text-size-xs font-weight-700 font-inter">
            Total Items
          </p>
        </div>
      </header>

      {/* Favorites */}
      <ScrollArea className="whitespace-nowrap mb-8">
        <div className="flex flex-wrap gap-4 py-4">
          {isLoading || isRefetching ? (
            <div className="w-full text-black flex justify-center items-center gap-3">
              <Spinner className="text-black" className="size-8" />
              Loading favorites...
            </div>
          ) : isError ? (
            <Empty className="text-center text-sm text-destructive">
              <EmptyHeader>
                <EmptyTitle className="text-4xl font-bold">
                  Unable to load favorites.
                </EmptyTitle>
                <EmptyDescription className="text-xl font-semibold">
                  An error happened while fetching favorites from server.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button className="text-lg" onClick={() => refetch()}>
                  Try Again
                </Button>
              </EmptyContent>
            </Empty>
          ) : !favorites.length ? (
            <Empty className="text-center text-sm text-destructive">
              <EmptyHeader>
                <EmptyTitle className="text-4xl font-bold">
                  No favorites found.
                </EmptyTitle>
                <EmptyDescription className="text-xl font-semibold">
                  No courses were added to your favorites. Add more courses to
                  your favorites.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Link to={"/courses"}>
                  <Button className="text-lg">Explore course catalog</Button>
                </Link>
              </EmptyContent>
            </Empty>
          ) : (
            favorites.map((favorite) => (
              <CourseCard key={favorite._id} favorite={favorite} />
            ))
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default FavoritesPage;
