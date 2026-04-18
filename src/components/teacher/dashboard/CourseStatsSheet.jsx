import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useGetCourseReview } from "@/queries/useReviewQueries";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";
import {
  Loader2,
  Star,
  Users,
  BookOpen,
  ClipboardList,
  TrendingUp,
} from "lucide-react";
import RatingBar from "./RatingBar";
import MiniStat from "./MiniStat";

const CourseStatsSheet = ({ course, open, onClose }) => {
  const courseId = course?.id;

  // Reviews → rating distribution
  const { data: reviewsResponse, isLoading: reviewsLoading } =
    useGetCourseReview(open ? courseId : null);

  // Assignment count via the existing assignment endpoint
  const { data: assignmentsResponse, isLoading: assignmentsLoading } = useQuery(
    {
      queryKey: ["assignments", courseId],
      queryFn: async () => {
        try {
          const res = await axiosInstance.get(
            ENDPOINTS.ASSIGNMENTS_LIST(courseId),
          );
          return res.data;
        } catch (err) {
          if (err?.response?.status === 404) return { data: [] };
          throw err;
        }
      },
      enabled: open && !!courseId,
      staleTime: 1000 * 60 * 5,
    },
  );

  const reviews = reviewsResponse?.data ?? [];
  // Backend returns { data: { results: N, assignments: [...] } }
  const assignmentsData = assignmentsResponse?.data ?? {};
  const assignments = Array.isArray(assignmentsData.assignments)
    ? assignmentsData.assignments
    : [];
  const assignmentCount =
    typeof assignmentsData.results === "number"
      ? assignmentsData.results
      : assignments.length;
  const totalReviews = reviews.length;

  // Build rating distribution 5→1
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));

  const isLoading = reviewsLoading || assignmentsLoading;

  if (!course) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="!max-w-[480px] overflow-y-auto p-0 flex flex-col"
      >
        {/* ── Thumbnail header ───────────────────────────────────────────── */}
        <div className="relative h-44 flex-shrink-0">
          {course.image ? (
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-950 via-indigo-900 to-slate-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <Badge className="mb-2 text-[10px] uppercase font-bold bg-white/20 border-white/20 text-white backdrop-blur">
              {course.status}
            </Badge>
            <h2 className="text-white text-lg font-bold leading-snug line-clamp-2">
              {course.title}
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-6 p-6 flex-1">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
            </div>
          ) : (
            <>
              {/* ── Mini stats grid ──────────────────────────────────────── */}
              <div className="grid grid-cols-2 gap-3">
                <MiniStat
                  icon={Users}
                  label="Students"
                  value={(course.enrollments ?? 0).toLocaleString()}
                  color="text-indigo-600"
                />
                <MiniStat
                  icon={BookOpen}
                  label="Lessons"
                  value={
                    Array.isArray(course.lessons)
                      ? course.lessons.length
                      : (course.lessonsCount ?? "—")
                  }
                  color="text-violet-600"
                />
                <MiniStat
                  icon={ClipboardList}
                  label="Assignments"
                  value={assignmentCount}
                  color="text-fuchsia-600"
                />
                <MiniStat
                  icon={TrendingUp}
                  label="Reviews"
                  value={totalReviews}
                  color="text-rose-500"
                />
              </div>

              {/* ── Average rating ───────────────────────────────────────── */}
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-[0.8px] mb-3">
                  Rating Breakdown
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <div>
                    <p className="text-4xl font-extrabold text-slate-900 leading-none">
                      {course.averageRating
                        ? Number(course.averageRating).toFixed(1)
                        : "—"}
                    </p>
                    <div className="flex gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-3.5 w-3.5 ${
                            s <= Math.round(course.averageRating || 0)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-slate-200 text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-slate-400 text-xs mt-1">
                      {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                    </p>
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5">
                    {ratingCounts.map(({ star, count }) => (
                      <RatingBar
                        key={star}
                        star={star}
                        count={count}
                        total={totalReviews}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Recent reviews ───────────────────────────────────────── */}
              {reviews.length > 0 && (
                <div>
                  <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-[0.8px] mb-3">
                    Recent Reviews
                  </p>
                  <div className="flex flex-col gap-3">
                    {reviews.slice(0, 3).map((review) => {
                      const name =
                        [
                          review.studentId?.firstName,
                          review.studentId?.lastName,
                        ]
                          .filter(Boolean)
                          .join(" ") ||
                        review.studentId?.email ||
                        "Student";
                      const initials = name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2);
                      return (
                        <div
                          key={review._id}
                          className="bg-slate-50 rounded-2xl p-4 flex gap-3"
                        >
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            {review.studentId?.avatar && (
                              <img src={review.studentId.avatar} alt={name} />
                            )}
                            <AvatarFallback className="text-xs font-bold">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-slate-800 text-sm font-semibold truncate">
                                {name}
                              </p>
                              <div className="flex gap-0.5 flex-shrink-0">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`h-3 w-3 ${
                                      s <= review.rating
                                        ? "fill-amber-400 text-amber-400"
                                        : "fill-slate-200 text-slate-200"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            {review.comment && (
                              <p className="text-slate-500 text-xs mt-0.5 line-clamp-2">
                                {review.comment}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {reviews.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-slate-400 text-sm">
                    No reviews yet for this course.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CourseStatsSheet;
