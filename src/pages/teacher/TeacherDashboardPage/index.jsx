import { useGetAllTeacherCourses } from "@/queries/useCourses";
import { FaArrowTrendUp } from "react-icons/fa6";
import { useTeacherVerification } from "@/queries/adminVerificationQueries";
import Loader from "@/components/ui/loader";
import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip, YAxis, Cell } from "recharts";
import { FaMoneyBills, FaChalkboardUser } from "react-icons/fa6";
import { FaClipboardCheck } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import { useUserQuery } from "@/queries/authQueries";
import { useTeacherBalance } from "@/queries/useTeacherFinanceQueries";
import { useEnrollmentDetailsQuery, useTeacherCoursesQuery } from "@/queries/enrollmentQueries";
import TeacherActiveCoureCard from "@/components/teacher/TeacherActiveCoureCard";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { sessionService } from "@/services/sessionService";
import { Button } from "@/components/ui/button";


const TeacherDashboardPage = () => {
  const navigate = useNavigate()
  const { data: userData, isLoading, error } = useUserQuery()
  const { data: teacherBalance } = useTeacherBalance()
  const { data: teacherErollemnts } = useTeacherCoursesQuery()
  const { data: teacherCourses } = useGetAllTeacherCourses()
  const { data: verificationData } = useTeacherVerification()
  // const {}

  const [period, setPeriod] = useState(7);
  const [bookings, setBookings] = useState([])

  const fetchBookings = async () => {
    try {
      const response = await sessionService.getTeacherBookings()
      setBookings(response.data.data || [])
      console.log('Teacher Booking', response.data.data);

    } catch (error) {
      toast.error("Failed to load your bookings")
      console.error(error)
    } finally {
    }
  }

  const weeklyData = useMemo(() => {
    if (!teacherBalance?.dailyEarnings) return [];

    return teacherBalance.dailyEarnings
      .slice(-period) // last 7, 14, or 30 days based on selector
      .map(entry => ({
        day: new Date(entry.date).toLocaleDateString("en-GB", { weekday: "short" }).slice(0, 3),
        amount: entry.amount,
        date: entry.date
      }));
  }, [teacherBalance?.dailyEarnings, period]);


  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - period + 1);
  const formatDate = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const dateRange = `Revenue flow from ${formatDate(startDate)} - ${formatDate(today)}`;



  const coursesStatus = teacherCourses?.data.map((st) => st.status === "published");
  const publishedCourses = teacherCourses?.data.filter((st) => st.status === "published");
  const publishedCoursesCount = publishedCourses?.length;

  console.log("coursesStatus", coursesStatus);
  console.log("userData", userData);
  console.log("teacherCourses", teacherCourses);
  console.log("teacherErollemnts", teacherErollemnts);
  console.log("teacherBalance", teacherBalance);
  console.log("verificationData", verificationData);
  console.log("publishedCourses", publishedCourses);

  useEffect(() => {
    fetchBookings()
  }, [])


  if (isLoading) return <div className="min-h-full min-w-full flex justify-center items-center"><Loader /></div>

  return (
    <div className="grid grid-cols-4 gap-3 p-3">

      <div className="col-span-1 sm:col-span-2 md:col-span-4 mx-5">
        <h2 className="text-2xl font-bold">Welcome back ,
          <span className="text-[var(--primary)]">{userData.firstName}{" "}{userData.lastName} </span> </h2>
        <p className="text-[var(--chart-4)] text-light">
          You have{" "}
          <strong className="text-slate-800">
            {publishedCourses?.length}
          </strong>{" "}
          published {publishedCourses?.length === 1 ? "course" : "courses"}{" "}
          and <strong className="text-slate-800">{teacherErollemnts?.length}</strong>{" "}
          total enrolled {teacherErollemnts === 1 ? "student" : "students"}.
          Here is a summary of your digital campus performance.
        </p>
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
          <h3 className="text-2xl font-extrabold">${teacherBalance?.totalEarnings}</h3>
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

        <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--ring)] rounded-xl py-7 px-5 flex flex-col gap-3">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h2 className="text-lg font-bold text-white">Upcoming Sessions</h2>
          </div>

          {/* 👇 This is what was MISSING — show bookings in the card itself */}
          <div className="flex flex-col gap-3 flex-1 justify-between">
            {bookings.length === 0 ? (
              <p className="text-white/50 text-sm text-center mt-4">No upcoming sessions</p>
            ) : (
              bookings.slice(0, 3).map((book) => ( // show max 3 in the card
                <div key={book._id} className="flex gap-3 items-center">
                  <div className="bg-white/10 rounded-md px-1 py-4 border-2 border-white/30 text-white text-xs font-bold text-center min-w-[45px]">
                    {new Date(book?.scheduledDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short"
                    })}
                  </div>
                  <div>
                    <h3 className="text-white text-sm font-semibold">
                      Session with {book?.studentId?.firstName}
                    </h3>
                    <p className="text-white/60 text-xs">At {book?.scheduledTime}</p>
                  </div>
                  <span className="ml-auto text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-600">
                    {book.status}
                  </span>
                </div>
              ))
            )}

            <div className="mt-auto">
              <Button variant="white" className="text-[#312E81] rounded-md w-full"
                onClick={() => {
                  navigate('/teacher/myBookings')
                }}>
                View Full Calendar
              </Button>
            </div>
          </div>
        </div>

      </div>

      <div className="col-span-4">
        <div className="flex flex-col md:flex-row justify-between items-center m-5">
          <h2 className="font-bold text-xl">Active Courses</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mx-5">
          {publishedCourses?.map((item, index) => (
            <TeacherActiveCoureCard key={item._id} course={item} /> // ✅ key on the component, use _id not index
          ))}
          <div className="border-1 border-gray-400 border-dashed bg-gray-200 flex flex-col justify-center items-center py-30 rounded-md text-center">
            <button onClick={() => navigate('/teacher/courses/create')} className="bg-white w-12 h-12 flex justify-center items-center rounded-full text-[var(--primary)]"><IoMdAdd size={25} /></button>
            <h3 className="text-lg font-semibold">Launch New Module</h3>
            <p className="text-gray-600 text-xs font-light">Create Your New Course</p>
          </div>
        </div>
      </div>


    </div>

  );
};

export default TeacherDashboardPage;