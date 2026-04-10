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
import { ChevronDown } from "lucide-react";
import {
  RevenueIcon,
  EnrollmentIcon,
  RatingIcon,
  PendingIcon,
  PlusIcon,
} from "./icons";
import { StatCard, CourseCard } from "./components";
import {
  earningsData,
  chartConfig,
  upcomingEvents,
  activeCourses,
} from "./constants";

const TeacherDashboardPage = () => {
  return (
    <div
      className="p-8 flex flex-col gap-10 bg-slate-50 min-h-full"
      style={{
        fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
      }}
    >
      {/* Hero Greeting */}
      <section className="space-y-2">
        <h1
          className="text-slate-950 text-3xl font-bold leading-[36px] tracking-[-0.75px]"
          style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}
        >
          Welcome back, Academic Prism Instructor
        </h1>
        <p className="text-slate-600 text-base leading-6 max-w-3xl">
          Your students have shown a 12% increase in engagement this week. Here
          is a summary of your digital campus performance.
        </p>
      </section>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          icon={<RevenueIcon />}
          badge="+14.2%"
          badgeColor="#007030"
          label="Total Revenue"
        >
          <span className="text-slate-950 text-3xl font-extrabold mt-1 block">
            $24,850.00
          </span>
        </StatCard>

        <StatCard
          icon={<EnrollmentIcon />}
          badge="+8%"
          badgeColor="#007030"
          label="Enrollments"
        >
          <span className="text-slate-950 text-3xl font-extrabold mt-1 block">
            1,284
          </span>
        </StatCard>

        <StatCard
          icon={<RatingIcon />}
          badge="Steady"
          badgeColor="#94A3B8"
          label="Avg Rating"
        >
          <span className="inline-flex items-baseline gap-0.5 text-slate-950 text-3xl font-extrabold mt-1">
            4.9
            <span className="text-slate-400 text-sm font-medium">/5.0</span>
          </span>
        </StatCard>

        <StatCard
          icon={<PendingIcon />}
          badge="Due soon"
          badgeColor="#BA1A1A"
          label="Pending Review"
        >
          <span className="text-slate-950 text-3xl font-extrabold mt-1 block">
            42
          </span>
        </StatCard>
      </div>

      {/* Chart + Events Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Weekly Earnings Chart */}
        <Card className="xl:col-span-2 shadow-[0_20px_40px_-12px_rgba(20,27,43,0.04)] p-8 gap-8">
          <CardHeader className="items-start gap-4 px-0">
            <div className="flex justify-between">
              <div>
                <CardTitle
                  className="text-lg font-bold leading-7 mb-1"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
                  }}
                >
                  Weekly Earnings
                </CardTitle>
                <CardDescription>
                  Revenue flow from 7 Mar - 14 Mar
                </CardDescription>
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="p">
                      Period <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="p-2">
                    <DropdownMenuCheckboxItem
                      className="px-3 py-2"
                      checked={true}
                    >
                      7 Days
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem className="px-3 py-2">
                      Month
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem className="px-3 py-2">
                      3 Months
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem className="px-3 py-2">
                      6 Months
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem className="px-3 py-2">
                      Year
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem className="px-3 py-2">
                      5 Years
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-0">
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
                        fontSize={10}
                        fontWeight={700}
                        fontFamily="Inter, sans-serif"
                        textTransform="uppercase"
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
                  // label={<ActiveBarLabel />}
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
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <div className="bg-gradient-to-br from-indigo-950 via-indigo-700 to-fuchsia-700 rounded-[24px] p-8 flex flex-col gap-6">
          <h2
            className="text-white text-lg font-bold leading-7"
            style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}
          >
            Upcoming Events
          </h2>
          <div className="flex flex-col gap-5 flex-1">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur">
                  <span className="text-white text-xs font-bold leading-4">
                    {event.day}
                  </span>
                  <span className="text-white text-[10px] font-normal uppercase tracking-[-0.4px]">
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

      {/* Active Courses */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-slate-950 text-xl font-bold leading-7"
            style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}
          >
            Active Courses
          </h2>
          <Button
            asChild
            variant="link"
            className="text-sm font-semibold hover:underline"
          >
            <a href="#">See all courses</a>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}

          {/* Add New Course CTA */}
          <div className="border-2 border-dashed border-slate-300 bg-slate-100 rounded-[24px] flex flex-col items-center justify-center gap-2 text-center p-12 cursor-pointer transition-colors hover:border-indigo-600">
            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
              <PlusIcon />
            </div>
            <h3
              className="text-slate-950 text-base font-bold leading-6 mb-0"
              style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}
            >
              Launch New Module
            </h3>
            <p className="text-slate-600 text-sm leading-6 mb-0">
              Draft your next course using the Curriculum Builder.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeacherDashboardPage;
