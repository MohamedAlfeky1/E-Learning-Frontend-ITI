import { useLogout } from "../../../hooks/useLogout";
import { useGetAllTeacherCourses } from "@/queries/useCourses";
import { FaArrowTrendUp, FaGraduationCap } from "react-icons/fa6";
import { useTeacherVerification } from "@/queries/adminVerificationQueries";
import Loader from "@/components/ui/loader";
import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip, YAxis, Cell } from "recharts";
import { FaMoneyBills, FaChalkboardUser } from "react-icons/fa6";
import { FaClipboardCheck } from "react-icons/fa";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMemo, useState } from "react";
import { useUserQuery } from "@/queries/authQueries";
import { useTeacherBalance } from "@/queries/useTeacherFinanceQueries";
import { useEnrollmentDetailsQuery, useTeacherCoursesQuery } from "@/queries/enrollmentQueries";
import generateWeeklyData from "@/components/teacher/generateWeeklyData";
import TeacherActiveCoureCard from "@/components/teacher/TeacherActiveCoureCard";
import { IoMdAdd } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";


const getStatBadge = (value) => {
  if (!value || value === 0) return { label: "No data", color: "text-gray-400 bg-gray-100" };
  return { label: "Active", color: "text-green-600 bg-green-100" };
};

const TeacherDashboardPage = () => {
  const navigate = useNavigate()
  const logout = useLogout();
  const { data: userData, isLoading, error } = useUserQuery()
  const { data: teacherBalance } = useTeacherBalance()
  const { data: teacherErollemnts } = useTeacherCoursesQuery()
  const { data: teacherCourses } = useGetAllTeacherCourses()
  const { data: verificationData } = useTeacherVerification()
  const { data: enrollmentDetails } = useEnrollmentDetailsQuery()

  const [period, setPeriod] = useState(7);
  const [open, setOpen] = useState(false);



  const weeklyData = useMemo(() => {
    return generateWeeklyData(teacherBalance?.totalEarnings ?? 0, period);
  }, [teacherBalance?.totalEarnings, period]);

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - period + 1);
  const formatDate = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const dateRange = `Revenue flow from ${formatDate(startDate)} - ${formatDate(today)}`;

  console.log("userData", userData);

  console.log("teacherCourses", teacherCourses);

  console.log("teacherErollemnts", teacherErollemnts);
  console.log("teacherBalance", teacherBalance);
  console.log("verificationData", verificationData);


  const coursesStatus = teacherCourses?.data.map((st) => st.status === "published");
  const publishedCourses = teacherCourses?.data.filter((st) => st.status === "published");
  const publishedCoursesCount = publishedCourses?.length;
  console.log("coursesStatus", coursesStatus);

  console.log("publishedCourses", publishedCourses);




  if (isLoading) return <div className="min-h-full min-w-full flex justify-center items-center"><Loader /></div>

  return (
    <div className="grid grid-cols-4 gap-3">

      <div className="col-span-1 sm:col-span-2 md:col-span-4">
        <h2 className="text-2xl font-extrabold">Welcome back ,{userData.firstName} </h2>
      </div>

      <div className="col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">


        <div className="bg-white rounded-xl p-4 flex flex-col justify-center gap-3">

          <div className="flex justify-between items-start">
            <div className="w-10 flex justify-center bg-[var(--ring)]/20 p-2 rounded-md text-[var(--primary)]">
              <FaMoneyBills />
            </div>
            {teacherBalance?.totalEarnings > 0 ? (
              <span className="text-xs font-semibold px-2 py-1 rounded-full text-green-600 bg-green-100">
                Active
              </span>
            ) : (
              <span className="text-xs font-semibold px-2 py-1 rounded-full text-gray-400 bg-gray-100">
                No data
              </span>
            )}
          </div>
          <h3 className="text-[var(--chart-3)] text-sm">Total Earnings</h3>
          <h3 className="text-2xl font-extrabold">{teacherBalance?.totalEarnings}</h3>
        </div>

        <div className="bg-white rounded-xl p-4 flex flex-col justify-center gap-3">

          <div className="flex justify-between items-start">
            <div className="w-10 flex justify-center bg-[var(--ring)]/20 p-2 rounded-md text-[var(--primary)]">
              <FaArrowTrendUp />
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full text-gray-500 bg-gray-100">
              Steady
            </span>
          </div>

          <h3 className="text-[var(--chart-3)] text-sm">Enrollments</h3>
          <h3 className="text-2xl font-extrabold">{teacherErollemnts?.length}</h3>
        </div>

        <div className="bg-white rounded-xl p-4 flex flex-col justify-center gap-3">

          <div className="flex justify-between items-start">
            <div className="w-10 flex justify-center bg-[var(--ring)]/20 p-2 rounded-md text-[var(--primary)]">
              <FaChalkboardUser />
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full text-orange-500 bg-orange-50">
              {teacherCourses?.data?.filter(c => c.status === "draft").length ?? 0} drafts
            </span>
          </div>

          <h3 className="text-[var(--chart-3)] text-sm">Total Courses</h3>
          <h3 className="text-2xl font-extrabold">{teacherCourses?.data?.length}</h3>
        </div>

        <div className="bg-white rounded-xl p-4 flex flex-col justify-center gap-3">

          <div className="flex justify-between items-start">
            <div className="w-10 flex justify-center bg-[var(--ring)]/20 p-2 rounded-md text-[var(--primary)]">
              <FaClipboardCheck />
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full text-red-500 bg-red-50">
              {teacherCourses?.data?.filter(c => c.status === "draft").length ?? 0} drafts
            </span>
          </div>

          <h3 className="text-[var(--chart-3)] text-sm">Published Courses</h3>
          <h3 className="text-2xl font-extrabold">{publishedCoursesCount}</h3>
        </div>


      </div>

      <div className="col-span-4 grid grid-cols-1 md:grid-cols-[2.5fr_1.5fr] gap-3">

        <div className="bg-white rounded-xl p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <div>
              <h2 className="text-md font-bold">Weekly Earnings</h2>
              <h3 className="text-[var(--chart-3)] text-sm">{dateRange}</h3>
            </div>

            {/* Period selector — matches the screenshot */}
            <select
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white font-medium focus:outline-none"
            >
              <option value={7}>Last 7 Days</option>
              <option value={14}>Last 14 Days</option>
              <option value={30}>Last 30 Days</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData} barSize={28} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={({ x, y, payload, index }) => {
                  const today = new Date().toLocaleDateString("en-GB", { weekday: "short" }).slice(0, 3);
                  const isToday = period === 7 && payload.value === new Date().toLocaleDateString("en-GB", { weekday: "short" }).slice(0, 3);
                  return (
                    <text
                      x={x} y={y + 15}
                      textAnchor="middle"
                      fontSize={12}
                      fill={isToday ? "#6D28D9" : "#9CA3AF"}
                      fontWeight={isToday ? "700" : "400"}
                    >
                      {payload.value.toUpperCase()}
                    </text>
                  );
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                tickFormatter={(v) => `$${v}`}
                width={45}
              />
              <Tooltip
                formatter={(value) => [`$${value}`, "Earnings"]}
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {weeklyData.map((entry, index) => {
                  const isHighest = entry.amount === Math.max(...weeklyData.map(d => d.amount));
                  return <Cell key={index} fill={isHighest ? "#6D28D9" : "#E9D5FF"} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className=" bg-[#312E81] rounded-xl py-7 px-5 flex flex-col gap-3">
          <div className="flex flex-col md:flex-row justify-between items-center ">
            <h2 className="text-lg font-bold text-white">Upcoming Events</h2>
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
                  {/* {sortedActivities.map((item, index) => (
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
                  ))} */}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-col gap-3">
            {/* {sortedActivities.slice(0, 5).map((item, index) => {
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
            })} */}

          </div>


        </div>

      </div>

      <div className="col-span-4">
        <div className="flex flex-col md:flex-row justify-between items-center m-5">
          <h2 className="font-bold text-lg">Active Courses</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {publishedCourses?.map((item, index) => (
            <TeacherActiveCoureCard key={item._id} course={item} /> // ✅ key on the component, use _id not index
          ))}
          <div className="border-1 border-gray-400 border-dashed bg-gray-200 flex flex-col justify-center items-center py-30 rounded-md text-center">
            <button  onClick={()=>navigate('/teacher/courses/create')}  className="bg-white w-12 h-12 flex justify-center items-center rounded-full text-[var(--primary)]"><IoMdAdd size={25} /></button>
            <h3 className="text-lg font-semibold">Launch New Module</h3>
            <p className="text-gray-600 text-xs font-light">Create Your New Course</p>
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

export default TeacherDashboardPage;
