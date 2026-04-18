import { useState } from "react";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { DotsMenuIcon, EditIcon, StatsIcon } from "./icons";
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
import { Link } from "react-router-dom";

// ─── StatCard ────────────────────────────────────────────────────────────────
export const StatCard = ({ icon, badge, badgeColor, label, children }) => (
  <div className="bg-white rounded-[24px] p-6 flex flex-col gap-1 shadow-[0_20px_40px_-12px_rgba(20,27,43,0.04)]">
    <div className="flex items-center justify-between mb-3">
      {icon}
      <span
        className="text-xs font-semibold leading-4 px-2 py-1 rounded-full"
        style={{ color: badgeColor }}
      >
        {badge}
      </span>
    </div>
    <p className="text-slate-600 text-[11px] font-semibold uppercase tracking-[1.2px] mb-0">
      {label}
    </p>
    <div className="text-slate-950 text-3xl font-extrabold mt-1">
      {children}
    </div>
  </div>
);

// ─── Rating bar row ───────────────────────────────────────────────────────────
const RatingBar = ({ star, count, total }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-4 text-right text-slate-500 font-medium">{star}</span>
      <Star className="h-3 w-3 fill-amber-400 text-amber-400 flex-shrink-0" />
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-right text-slate-400">{count}</span>
    </div>
  );
};

// ─── Mini stat tile ───────────────────────────────────────────────────────────
const MiniStat = ({ icon: Icon, label, value, color = "text-indigo-600" }) => (
  <div className="bg-slate-50 rounded-2xl p-4 flex flex-col gap-2">
    <div
      className={`w-8 h-8 rounded-xl flex items-center justify-center bg-white shadow-sm ${color}`}
    >
      <Icon className="h-4 w-4" />
    </div>
    <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-[0.8px]">
      {label}
    </p>
    <p className="text-slate-900 text-xl font-extrabold leading-none">
      {value}
    </p>
  </div>
);

// ─── CourseStatsSheet ─────────────────────────────────────────────────────────
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

// ─── CourseCard ───────────────────────────────────────────────────────────────
export const CourseCard = ({ course }) => {
  const [statsOpen, setStatsOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_20px_40px_-12px_rgba(20,27,43,0.04)] flex flex-col">
        <div className="relative h-48 overflow-hidden">
          {course.image ? (
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-800 to-slate-950" />
          )}
          <Badge className="absolute top-4 right-4 rounded-full bg-white/70 border border-white/20 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px] text-indigo-700">
            {course.enrollments} Enrollments
          </Badge>
        </div>
        <div className="p-6 flex flex-col gap-2 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className="text-slate-950 text-base font-bold leading-5 flex-1"
              style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}
            >
              {course.title}
            </h3>
          </div>
          <div className="flex items-center gap-3 pb-2">
            <AvatarGroup>
              <Avatar>
                <AvatarFallback>AL</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>EM</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
            </AvatarGroup>
            <span className="text-slate-600 text-xs font-medium">
              +{course.othersStudying} others studying
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4 mt-2">
            <Link to={`/teacher/courses/${course.id}/edit`}>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 uppercase tracking-[0.6px] text-indigo-700"
              >
                <EditIcon />
                Edit Course
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 uppercase tracking-[0.6px] text-slate-600 hover:text-indigo-700"
              onClick={() => setStatsOpen(true)}
            >
              <StatsIcon />
              Stats
            </Button>
          </div>
        </div>
      </div>

      <CourseStatsSheet
        course={course}
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
      />
    </>
  );
};
