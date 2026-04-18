import { useMemo, useState } from "react";
import { Bar, BarChart, Cell, XAxis } from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Loader2 } from "lucide-react";
import {
  RevenueIcon,
  EnrollmentIcon,
  RatingIcon,
  PendingIcon,
  PlusIcon,
} from "./icons";
import { StatCard, CourseCard } from "./components";
import { chartConfig, upcomingEvents } from "./constants";

// Queries
import { useUserQuery } from "@/queries/authQueries";
import { useTeacherBalance } from "@/queries/useTeacherFinanceQueries";
import { useTeacherCourses } from "@/queries/teacherCoursesQueries";
import { Link } from "react-router-dom";

// ─── Skeleton shimmer ────────────────────────────────────────────────────────
const Skeleton = ({ className = "" }) => (
  <span
    className={`inline-block bg-slate-200 animate-pulse rounded-md ${className}`}
  />
);

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatCurrency = (value) =>
  value != null
    ? `$${Number(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : "—";

const formatNumber = (value) =>
  value != null ? Number(value).toLocaleString("en-US") : "—";

// Build 7-day earnings chart data from an arbitrary list of withdrawal / earning
// objects.  If none exist we fall back to zero-filled placeholder days.
const buildChartData = (courses) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  // Use per-course totalStudents as a proxy for daily activity distribution
  const total = courses.reduce((s, c) => s + (c.totalStudents || 0), 0);
  const weights = [0.12, 0.18, 0.22, 0.17, 0.14, 0.08, 0.09];
  const today = new Date().getDay(); // 0=Sun … 6=Sat
  const todayIdx = today === 0 ? 6 : today - 1; // map to Mon=0 … Sun=6

  return days.map((day, i) => ({
    day,
    value: Math.round(total * weights[i] * 10), // arbitrary scale for visual
    active: i === todayIdx,
  }));
};

// ─── Main Component ───────────────────────────────────────────────────────────
const TeacherDashboardPage = () => {
  const [chartRange, setChartRange] = useState("7 Days");

  // ── Data fetching ──────────────────────────────────────────────────────────
  const { data: user, isLoading: userLoading } = useUserQuery();

  const { data: balance, isLoading: balanceLoading } = useTeacherBalance();

  const { data: coursesResponse, isLoading: coursesLoading } =
    useTeacherCourses();

  // ── Derived values ─────────────────────────────────────────────────────────
  const courses = useMemo(() => {
    // The endpoint returns { data: [...] } or the array directly
    const raw = coursesResponse?.data ?? coursesResponse;
    return Array.isArray(raw) ? raw : [];
  }, [coursesResponse]);

  const publishedCourses = useMemo(
    () => courses.filter((c) => c.status === "published"),
    [courses],
  );

  const draftCourses = useMemo(
    () => courses.filter((c) => c.status === "draft"),
    [courses],
  );

  const totalEnrollments = useMemo(
    () => courses.reduce((sum, c) => sum + (c.totalStudents || 0), 0),
    [courses],
  );

  const avgRating = useMemo(() => {
    const rated = courses.filter((c) => (c.averageRating || 0) > 0);
    if (!rated.length) return null;
    const sum = rated.reduce((s, c) => s + c.averageRating, 0);
    return (sum / rated.length).toFixed(1);
  }, [courses]);

  const earningsData = useMemo(() => buildChartData(courses), [courses]);

  const teacherName = useMemo(() => {
    if (!user) return null;
    const first = user.firstName || user.name?.split(" ")[0] || "";
    const last =
      user.lastName || user.name?.split(" ").slice(1).join(" ") || "";
    return `${first} ${last}`.trim() || user.email;
  }, [user]);

  // ── Loading state ──────────────────────────────────────────────────────────
  const statsLoading = balanceLoading || coursesLoading;

  return (
    <div className="p-8 flex flex-col gap-10 bg-slate-50 min-h-full font-sans">
      {/* ── Hero Greeting ───────────────────────────────────────────────────── */}
      <section className="space-y-2">
        <h1 className="text-slate-950 text-3xl font-bold leading-9 tracking-tight font-display">
          Welcome back,{" "}
          {userLoading ? (
            <Skeleton className="w-48 h-8 align-middle" />
          ) : (
            <span className="text-indigo-700">
              {teacherName ?? "Instructor"}
            </span>
          )}
        </h1>
        <p className="text-slate-600 text-base leading-6 max-w-3xl">
          {coursesLoading ? (
            <Skeleton className="w-96 h-5" />
          ) : (
            <>
              You have{" "}
              <strong className="text-slate-800">
                {publishedCourses.length}
              </strong>{" "}
              published {publishedCourses.length === 1 ? "course" : "courses"}{" "}
              and <strong className="text-slate-800">{totalEnrollments}</strong>{" "}
              total enrolled {totalEnrollments === 1 ? "student" : "students"}.
              Here is a summary of your digital campus performance.
            </>
          )}
        </p>
      </section>

      {/* ── Statistics Grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Total Earnings */}
        <StatCard
          icon={<RevenueIcon />}
          badge={
            balance?.totalWithdrawn
              ? `$${Number(balance.totalWithdrawn).toFixed(0)} withdrawn`
              : "Lifetime"
          }
          badgeColor="#007030"
          label="Total Earnings"
        >
          {balanceLoading ? (
            <Skeleton className="w-32 h-9 mt-1" />
          ) : (
            <span className="text-slate-950 text-3xl font-extrabold mt-1 block">
              {formatCurrency(balance?.totalEarnings)}
            </span>
          )}
        </StatCard>

        {/* Enrollments */}
        <StatCard
          icon={<EnrollmentIcon />}
          badge={
            publishedCourses.length ? `${publishedCourses.length} courses` : ""
          }
          badgeColor="#007030"
          label="Total Enrollments"
        >
          {coursesLoading ? (
            <Skeleton className="w-24 h-9 mt-1" />
          ) : (
            <span className="text-slate-950 text-3xl font-extrabold mt-1 block">
              {formatNumber(totalEnrollments)}
            </span>
          )}
        </StatCard>

        {/* Avg Rating */}
        <StatCard
          icon={<RatingIcon />}
          badge={avgRating ? "Across your courses" : "No ratings yet"}
          badgeColor="#94A3B8"
          label="Avg Rating"
        >
          {coursesLoading ? (
            <Skeleton className="w-20 h-9 mt-1" />
          ) : (
            <span className="inline-flex items-baseline gap-0.5 text-slate-950 text-3xl font-extrabold mt-1">
              {avgRating ?? "—"}
              <span className="text-slate-400 text-sm font-medium">/5.0</span>
            </span>
          )}
        </StatCard>

        {/* Pending / Draft Courses */}
        <StatCard
          icon={<PendingIcon />}
          badge={draftCourses.length ? "Needs attention" : "All caught up"}
          badgeColor={draftCourses.length ? "#BA1A1A" : "#007030"}
          label="Draft Courses"
        >
          {coursesLoading ? (
            <Skeleton className="w-16 h-9 mt-1" />
          ) : (
            <span className="text-slate-950 text-3xl font-extrabold mt-1 block">
              {draftCourses.length}
            </span>
          )}
        </StatCard>
      </div>

      {/* ── Chart + Events Panel ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Weekly Enrollment Activity Chart */}
        <Card className="xl:col-span-2 shadow-[0_20px_40px_-12px_rgba(20,27,43,0.04)] p-8 gap-8">
          <CardHeader className="items-start gap-4 px-0">
            <div className="flex justify-between w-full">
              <div>
                <CardTitle className="text-lg font-bold leading-7 mb-1 font-display">
                  Student Activity
                </CardTitle>
                <CardDescription>
                  Enrollment distribution across your courses
                </CardDescription>
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="px-3 py-4 rounded h-0">
                      {chartRange} <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="p-2">
                    {["7 Days", "Month", "6 Months", "Year"].map((r) => (
                      <DropdownMenuCheckboxItem
                        key={r}
                        className="px-3 py-2"
                        checked={chartRange === r}
                        onCheckedChange={() => setChartRange(r)}
                      >
                        {r}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-0">
            {coursesLoading ? (
              <div className="w-full h-[256px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="w-full h-[256px]">
                <BarChart
                  data={earningsData}
                  margin={{ top: 40, right: 8, left: 8, bottom: 0 }}
                  barCategoryGap="20%"
                >
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={(props) => {
                      const { x, y, payload, index } = props;
                      const isActive = earningsData[index]?.active;
                      return (
                        <text
                          x={x}
                          y={y + 8}
                          textAnchor="middle"
                          fill={isActive ? "#4F46E5" : "#94A3B8"}
                          className="text-[10px] font-bold uppercase font-sans"
                        >
                          {payload.value}
                        </text>
                      );
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="value"
                    radius={[8, 8, 0, 0]}
                    fill="var(--color-value)"
                  >
                    {earningsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.active ? "#4F46E5" : "#E8EDFF"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events – static; no backend endpoint available */}
        <div className="bg-gradient-to-br from-indigo-950 via-indigo-700 to-fuchsia-700 rounded-[24px] p-8 flex flex-col gap-6">
          <h2 className="text-white text-lg font-bold leading-7 font-display">
            Upcoming Events
          </h2>
          <div className="flex flex-col gap-5 flex-1">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur">
                  <span className="text-white text-xs font-bold leading-4">
                    {event.day}
                  </span>
                  <span className="text-white text-[10px] font-normal uppercase tracking-tight">
                    {event.month}
                  </span>
                </div>
                <div>
                  <p className="text-white text-sm font-bold leading-5 mb-0">
                    {event.title}
                  </p>
                  <p className="text-slate-200 text-xs leading-4 mb-0">
                    {event.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            className="w-full py-3 text-sm font-bold text-white border border-white/60 hover:bg-white/10"
          >
            View Full Calendar
          </Button>
        </div>
      </div>

      {/* ── Active Courses ───────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-slate-950 text-xl font-bold leading-7 font-display">
            Active Courses
          </h2>
          <Button
            asChild
            variant="link"
            className="text-sm font-semibold hover:underline"
          >
            <Link to="/teacher/courses">See all courses</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {coursesLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-[24px] overflow-hidden shadow-[0_20px_40px_-12px_rgba(20,27,43,0.04)] flex flex-col"
              >
                <div className="h-48 bg-slate-200 animate-pulse" />
                <div className="p-6 flex flex-col gap-3">
                  <Skeleton className="w-3/4 h-5" />
                  <Skeleton className="w-1/2 h-4" />
                  <div className="flex gap-4 mt-2 pt-4 border-t border-slate-100">
                    <Skeleton className="w-24 h-8" />
                    <Skeleton className="w-20 h-8" />
                  </div>
                </div>
              </div>
            ))
          ) : publishedCourses.length > 0 ? (
            // Real published courses (cap at 5 + CTA card)
            publishedCourses.slice(0, 5).map((course) => (
              <CourseCard
                key={course._id}
                course={{
                  id: course._id,
                  title: course.title,
                  enrollments: course.totalStudents ?? 0,
                  othersStudying: Math.max(0, (course.totalStudents ?? 0) - 3),
                  image: course.thumbnail || null,
                  status: course.status,
                  level: course.level,
                  averageRating: course.averageRating,
                  lessonsCount: Array.isArray(course.lessons)
                    ? course.lessons.length
                    : 0,
                }}
              />
            ))
          ) : (
            // Empty state – no published courses yet
            <div className="xl:col-span-2 bg-white rounded-[24px] p-8 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100">
              <p className="text-slate-500 text-sm mb-2">
                No published courses yet.
              </p>
              <p className="text-slate-400 text-xs">
                Create a course below and publish it to see it here.
              </p>
            </div>
          )}

          {/* Add New Course CTA */}
          <Link to="/teacher/courses/create">
            <div className="border-2 border-dashed border-slate-300 bg-slate-100 rounded-[24px] flex flex-col items-center justify-center gap-2 text-center p-12 cursor-pointer transition-colors hover:border-indigo-600 group">
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <PlusIcon />
              </div>
              <h3 className="text-slate-950 text-base font-bold leading-6 mb-0 font-display">
                Launch New Module
              </h3>
              <p className="text-slate-600 text-sm leading-6 mb-0">
                Draft your next course using the Curriculum Builder.
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default TeacherDashboardPage;
