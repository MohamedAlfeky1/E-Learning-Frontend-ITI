import { useLogout } from "../../../hooks/useLogout";
import { IoMdPeople } from "react-icons/io";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useGetAllCourses } from "@/queries/useCourses";
import AdminCharts from "@/components/admin/AdminCharts";
import { FaGraduationCap } from "react-icons/fa6";
import { useTeacherVerification } from "@/queries/adminVerificationQueries";
import Loader from "@/components/ui/loader";
import { MdOutlineVerified } from "react-icons/md";
import { useGetPlatformStatistics } from "@/queries/useAdminQueries";
import AdminMergedChart from "@/components/admin/AdminMergedChart";
import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { IoPersonAddSharp } from "react-icons/io5";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

const formatChartData = (chartArray) => {
  if (!Array.isArray(chartArray)) {
    console.log("❌ Not array:", chartArray);
    return [];
  }

  return chartArray
    .map((item) => {
      if (!item?._id) {
        console.log("❌ Bad item:", item);
        return null;
      }

      return {
        month: new Date(item._id.year, item._id.month - 1)
          .toLocaleString("default", { month: "short" }),
        value: item.count ?? 0,
        date: new Date(item._id.year, item._id.month - 1),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.date - b.date);
};

const calcGrowth = (chartData = []) => {
  const current = chartData.at(-1)?.value ?? 0;
  const previous = chartData.at(-2)?.value ?? 0;
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

/* ─── tiny UI helpers (pure presentational, no logic change) ─── */

const GrowthBadge = ({ value }) => {
  const isUp = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${isUp
        ? "bg-[#EAF3DE] text-[#3B6D11]"
        : "bg-[#FCEBEB] text-[#A32D2D]"
        }`}
    >
      {isUp ? "▲" : "▼"} {Math.abs(value)}%
    </span>
  );
};

const StatCard = ({ icon, title, number, chartData, growth, accentClass, iconBgClass, barClass }) => (
  <div className={`bg-white rounded-2xl border border-[var(--border)] overflow-hidden flex flex-col gap-3 p-4 relative`}>
    {/* top accent strip */}
    <div className={`absolute top-0 left-0 right-0 h-[3px] ${accentClass}`} />

    <div className="flex items-start justify-between pt-1">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBgClass}`}>
        {icon}
      </div>
      <GrowthBadge value={growth} />
    </div>

    <div>
      <p className="text-2xl font-semibold text-[var(--foreground)] font-mono leading-none">
        {number.toLocaleString()}
      </p>
      <p className="text-xs text-[var(--muted-foreground)] mt-1">{title}</p>
    </div>

    {/* progress bar using chart data fill ratio */}
    <div className="h-1 rounded-full bg-[var(--muted)] overflow-hidden">
      <div
        className={`h-full rounded-full ${barClass}`}
        style={{ width: `${Math.min(100, (number / 3000) * 100)}%` }}
      />
    </div>
  </div>
);

/* ─── main page ─── */

const AdminDashboardPage = () => {
  const logout = useLogout();
  const { data: verificationData } = useTeacherVerification();
  const { data: platformData, isLoading, error } = useGetPlatformStatistics();
  const [open, setOpen] = useState(false);

  const studentChartData = formatChartData(platformData?.data?.users?.studentsChart);
  const teacherChartData = formatChartData(platformData?.data?.users?.teachersChart);
  const coursesChartData = formatChartData(platformData?.data?.courses?.coursesChart);
  const approvalChartData = formatChartData(platformData?.data?.approvals?.chart);

  const pendingRequests = verificationData?.data?.requests?.filter((s) => s.status === "pending");
  const revenueData = platformData?.data?.revenue;

  const recentActivities = [
    ...((pendingRequests || []).map((item) => ({
      type: "teacher_request",
      id: item._id,
      teacherName: item.teacherId?.firstName || "Unknown",
      status: item.status,
      createdAt: item.createdAt,
    }))),
    ...(revenueData ? [{
      type: "revenue", id: "revenue-1",
      title: "Revenue Update",
      thisMonth: revenueData.thisMonth,
      total: revenueData.total,
      lastSixMonths: revenueData.lastSixMonths,
      createdAt: new Date(),
    }] : []),
  ];

  const sortedActivities = recentActivities.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const totalStudents = studentChartData.reduce((s, i) => s + i.value, 0);
  const totalTeachers = teacherChartData.reduce((s, i) => s + i.value, 0);
  const totalCourses = coursesChartData.reduce((s, i) => s + i.value, 0);
  const totalApprovals = approvalChartData.reduce((s, i) => s + i.value, 0);
  const mergedData = AdminMergedChart(studentChartData, coursesChartData);

  console.log("students", studentChartData);
  console.log("teachers", teacherChartData);
  console.log("courses", coursesChartData);
  console.log("approvals", approvalChartData);

  console.log("studentsChart", platformData?.data?.users?.studentsChart);
  console.log("formatted", studentChartData);
  if (isLoading)
    return (
      <div className="min-h-full min-w-full flex justify-center items-center">
        <Loader />
      </div>
    );

  return (
    <div className="grid grid-cols-4 gap-4 p-1">

      {/* ── PAGE HEADER ── */}
      <div className="col-span-4">
        <span className="text-[var(--primary)] text-[10px] font-bold tracking-widest uppercase">
          Institutional Overview
        </span>
        <h2 className="text-[26px] font-extrabold tracking-tight text-[var(--foreground)]">
          Academic Dashboard
        </h2>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <AdminCharts icon={<IoMdPeople size={20} />}
          title="Total Students" number={totalStudents}
          chartData={studentChartData} growth={calcGrowth(studentChartData)} />

        <AdminCharts icon={<FaChalkboardTeacher size={20} />}
          title="Total Teachers" number={totalTeachers}
          chartData={teacherChartData} growth={calcGrowth(teacherChartData)} />

        <AdminCharts icon={<FaGraduationCap size={20} />}
          title="Active Courses" number={totalCourses}
          chartData={coursesChartData} growth={calcGrowth(coursesChartData)} />

        <AdminCharts icon={<MdOutlineVerified size={20} />}
          title="Verification Requests" number={totalApprovals}
          chartData={approvalChartData} growth={calcGrowth(approvalChartData)} />

      </div>

      {/* ── BOTTOM ROW ── */}
      <div className="col-span-4 grid grid-cols-1 md:grid-cols-[2.5fr_1.5fr] gap-4">

        {/* Monthly Growth chart */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-5 flex flex-col gap-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-[15px] font-bold text-[var(--foreground)]">Monthly Growth</h2>
              <p className="text-[12px] text-[var(--muted-foreground)] mt-0.5">
                User registrations vs. course enrollments
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-[12.5px] font-medium text-[var(--muted-foreground)]">
                <span className="w-2 h-2 rounded-full bg-[var(--ring)]" />
                Students
              </div>
              <div className="flex items-center gap-2 text-[12.5px] font-medium text-[var(--muted-foreground)]">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)] opacity-40" />
                Courses
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mergedData} barSize={14} barGap={3}>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)", fontWeight: 500 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  boxShadow: "0 4px 16px rgba(74,31,217,.10)",
                  fontSize: "12px",
                }}
                cursor={{ fill: "rgba(74,31,217,.04)" }}
              />
              <Bar dataKey="students" fill="var(--ring)" radius={[5, 5, 0, 0]} name="Students" />
              <Bar dataKey="courses" fill="var(--primary)" opacity={0.35} radius={[5, 5, 0, 0]} name="Courses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activities */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-5 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-[var(--foreground)]">Recent Activities</h2>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="text-[12px] font-bold text-[var(--primary)] hover:underline">
                  View All
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>All Recent Activities</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-3 mt-4">
                  {sortedActivities.map((item, i) => (
                    <ActivityRow key={i} item={item} />
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col gap-2.5">
            {sortedActivities.slice(0, 5).map((item, i) => (
              <ActivityRow key={i} item={item} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

/* ── activity row sub-component (visual only, no logic) ── */
const ActivityRow = ({ item }) => (
  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                  bg-[var(--muted)] border border-[var(--border)]
                  hover:bg-[var(--secondary)] transition-colors">

    {item.type === "revenue" ? (
      <div className="w-9 h-9 rounded-full bg-[var(--primary)]/10
                      flex items-center justify-center shrink-0">
        <span className="text-[13px] font-bold text-[var(--primary)]">$</span>
      </div>
    ) : (
      <div className="w-9 h-9 rounded-full bg-[#dcfce7]
                      flex items-center justify-center shrink-0">
        <IoPersonAddSharp size={15} className="text-green-700" />
      </div>
    )}

    <div className="min-w-0 flex-1">
      {item.type === "revenue" ? (
        <>
          <p className="text-[13px] font-semibold truncate">Revenue Updated</p>
          <p className="text-[11.5px] text-[var(--muted-foreground)]">
            This Month: ${item.thisMonth} · Total: ${item.total}
          </p>
        </>
      ) : (
        <>
          <p className="text-[13px] font-semibold truncate">
            New Teacher: {item.teacherName}
          </p>
          <p className="text-[11.5px] text-[var(--muted-foreground)]">
            Verification request
          </p>
        </>
      )}
    </div>

    {item.type !== "revenue" && (
      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${item.status === "pending"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-green-100 text-green-700"
        }`}>
        {item.status}
      </span>
    )}
  </div>
);

export default AdminDashboardPage;