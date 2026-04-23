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

const formatChartData = (chartArray = []) => {
  return chartArray
    .map((item) => ({
      month: new Date(item._id.year, item._id.month - 1).toLocaleString("default", { month: "short" }),
      value: item.count,
      date: new Date(item._id.year, item._id.month - 1),
    }))
    .sort((a, b) => a.date - b.date);
};

const calcGrowth = (chartData = []) => {
  const current = chartData.at(-1)?.value ?? 0;
  const previous = chartData.at(-2)?.value ?? 0;
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};


const AdminDashboardPage = () => {
  const logout = useLogout();
  // const { data: totalCourses, isLoading, error } = useGetAllCourses()
  const { data: verificationData } = useTeacherVerification()
  const { data: platformData, isLoading, error } = useGetPlatformStatistics()
  const [open, setOpen] = useState(false);

  console.log("platformData", platformData);
  console.log("verificationData", verificationData);


  const studentChartData = formatChartData(platformData?.data?.users?.studentsChart);
  const teacherChartData = formatChartData(platformData?.data?.users?.teachersChart);
  const coursesChartData = formatChartData(platformData?.data?.courses?.coursesChart);
  const approvalChartData = formatChartData(platformData?.data?.approvals?.chart);

  const pendingRequests = verificationData?.data?.requests?.filter((stat) => stat.status == "pending")
  const revenueData = platformData?.data?.revenue;
  console.log("pendingRequests", pendingRequests);


  const recentActivities = [
    ...((pendingRequests || []).map((item) => ({
      type: "teacher_request",
      id: item._id,
      teacherName: item.teacherId?.firstName || "Unknown",
      status: item.status,
      createdAt: item.createdAt,
    }))),

    ...(revenueData
      ? [
        {
          type: "revenue",
          id: "revenue-1",
          title: "Revenue Update",
          thisMonth: revenueData.thisMonth,
          total: revenueData.total,
          lastSixMonths: revenueData.lastSixMonths,
          createdAt: new Date(), // fallback since no timestamp
        },
      ]
      : []),
  ];

  const sortedActivities = recentActivities.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );


  const totalStudents = studentChartData.reduce((sum, item) => sum + item.value, 0);
  const totalTeachers = teacherChartData.reduce((sum, item) => sum + item.value, 0);
  const totalCourses = coursesChartData.reduce((sum, item) => sum + item.value, 0);
  const totalApprovals = approvalChartData.reduce((sum, item) => sum + item.value, 0);
  const mergedData = AdminMergedChart(studentChartData, coursesChartData);





  if (isLoading) return <div className="min-h-full min-w-full flex justify-center items-center"><Loader /></div>

  return (
    <div className="grid grid-cols-4 gap-3">

      <div className="col-span-1 sm:col-span-2 md:col-span-4">
        <span className="text-[var(--primary)] text-sm font-semibold">INSTITUTIONAL OVERVIEW</span>
        <h2 className="text-2xl font-extrabold">Academic Dashboard</h2>
      </div>

      <div className="col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">


        <AdminCharts icon={<IoMdPeople size={23} />}
          title='Total Students'
          number={totalStudents}
          chartData={studentChartData}
          growth={calcGrowth(studentChartData)} />

        <AdminCharts icon={<FaChalkboardTeacher size={23} />}
          title='Total Teachers'
          number={totalTeachers}
          chartData={teacherChartData}
          growth={calcGrowth(teacherChartData)} />

        <AdminCharts icon={<FaGraduationCap size={23} />}
          title='Active Courses' number={totalCourses}
          chartData={coursesChartData}
          growth={calcGrowth(coursesChartData)} />

        <AdminCharts icon={<MdOutlineVerified size={23} />}
          title='Total Verifications Request'
          number={totalApprovals}
          chartData={approvalChartData}
          growth={calcGrowth(approvalChartData)} />

      </div>
      <div className="col-span-4 grid grid-cols-1 md:grid-cols-[2.5fr_1.5fr] gap-3">

        <div className=" bg-white rounded-xl p-4  flex flex-col gap-7">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-md font-bold">Monthly Growth</h2>
              <h3 className="text-[var(--chart-3)] text-sm">User registration vs. course enrollments</h3>

            </div>

            <div className="flex gap-3">
              <div className="flex items-center gap-2"><div className="bg-[var(--ring)] w-2 h-2 rounded-full"></div>
                Student
              </div>
              <div className="flex items-center gap-2"><div className="bg-[var(--primary)]/30 w-2 h-2 rounded-full"></div>
                Teacher
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mergedData} barSize={16} barGap={4}>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
              />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
              />
              <Bar dataKey="students" fill="var(--ring)" radius={[4, 4, 0, 0]} name="Students" />
              <Bar dataKey="courses" fill="var(--primary)" opacity={0.4} radius={[4, 4, 0, 0]} name="Courses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className=" bg-white rounded-xl p-4 flex flex-col gap-3">
          <div className="flex flex-col md:flex-row justify-between items-center ">
            <h2 className="text-md font-bold">Recently Activities</h2>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="text-xs text-[var(--primary)] font-bold">
                  View All
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>All Recent Activities</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-3 mt-4">
                  {sortedActivities.map((item, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      {item.type === "revenue" ? (
                        <div className="bg-[var(--primary)]/20 w-8 h-8 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold">$</span>
                        </div>
                      ) : (
                        <div className="bg-[#6BFF8F] w-8 h-8 rounded-full flex items-center justify-center">
                          <IoPersonAddSharp size={15} />
                        </div>
                      )}

                      <div>
                        {item.type === "revenue" ? (
                          <>
                            <h3>Revenue Updated</h3>
                            <p className="text-sm text-gray-500">
                              This Month: ${item.thisMonth} | Total: ${item.total}
                            </p>
                          </>
                        ) : (
                          <>
                            <h3>New Teacher {item.teacherName}</h3>
                            <p className="text-sm text-gray-500">
                              Status: {item.status}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-col gap-3">
            {sortedActivities.slice(0, 5).map((item, index) => {
              return (
                <div key={index} className="flex flex-col gap-10">
                  <div className="flex gap-3 items-center">


                    {item.type === "revenue" ? (
                      <div className="bg-[var(--primary)]/20 w-8 h-8 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold">$</span>
                      </div>
                    ) : (
                      <div className="bg-[#6BFF8F] w-8 h-8 rounded-full flex items-center justify-center">
                        <IoPersonAddSharp size={15} />
                      </div>
                    )}


                    <div>
                      {item.type === "revenue" ? (
                        <>
                          <h3>Revenue Updated</h3>
                          <p className="text-sm text-gray-500">
                            This Month: ${item.thisMonth} | Total: ${item.total}
                          </p>
                        </>
                      ) : (
                        <>
                          <h3>New Teacher {item.teacherName}</h3>
                          <p className="text-sm text-gray-500">
                            Status: {item.status}
                          </p>
                        </>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}

          </div>


        </div>
      </div>


    </div>
    // <div>
    //   <h1>AdminDashboardPage</h1>
    //   <button onClick={logout}>Logout</button>
    // </div>
  );
};

export default AdminDashboardPage;
