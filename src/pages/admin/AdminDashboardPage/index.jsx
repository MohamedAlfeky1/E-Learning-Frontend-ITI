import { useLogout } from "../../../hooks/useLogout";
import { IoMdPeople } from "react-icons/io";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useGetAllCourses } from "@/queries/useCourses";
import TotalNumbersCard from "@/components/admin/TotalNumbersCard";
import { FaGraduationCap } from "react-icons/fa6";

const AdminDashboardPage = () => {
  const logout = useLogout();
  const { data: totalCourses, isLoading, error } = useGetAllCourses()
  const activeCourses = totalCourses?.data?.filter((item) => item.status == 'published')
  console.log(activeCourses);

  // Group by month
  const growthByMonth = activeCourses?.reduce((acc, course) => {
    const month = new Date(course.createdAt).toLocaleString('default', { month: 'short' }) // "Jan", "Feb"...
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(growthByMonth || {}).map(([month, count]) => ({
    month,
    value: count,
    date: new Date(`${month} 1, 2026`)
  }))
   .sort((a, b) => a.date - b.date)

  const currentMonthCount = chartData.at(-1)?.value ?? 0
  const previousMonthCount = chartData.at(-2)?.value ?? 0

  const growthPercent = previousMonthCount === 0
    ? 100
    : Math.round(((currentMonthCount - previousMonthCount) / previousMonthCount) * 100)

  return (
    <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">

      <div className="col-span-1 sm:col-span-2 md:col-span-4">
        <span className="text-[var(--primary)] text-sm font-semibold">INSTITUTIONAL OVERVIEW</span>
        <h2 className="text-2xl font-extrabold">Academic Dashboard</h2>
      </div>

      <div className="bg-white rounded-xl p-4 flex flex-col justify-center gap-3">

        <div className="w-10 flex justify-center bg-[var(--ring)]/30 p-2 rounded-md text-[var(--primary)]">
          <IoMdPeople size={23} />
        </div>
        <h3 className="text-[var(--chart-3)] text-sm">Total Students</h3>


      </div>

      <div className="bg-white rounded-xl p-4 flex flex-col justify-center gap-3">

        <div className="w-10 flex justify-center bg-[var(--ring)]/30 p-2 rounded-md text-[var(--primary)]">
          <FaChalkboardTeacher size={23} />
        </div>
        <h3 className="text-[var(--chart-3)] text-sm">Total Teachers</h3>


      </div>

      <TotalNumbersCard icon={<FaGraduationCap size={23} />} title='Active Courses' number={activeCourses?.length}
        chartData={chartData}
        growth={growthPercent} />

      <div className="bg-white rounded-xl p-4 flex flex-col justify-center gap-3">

        <div className="w-10 flex justify-center bg-[var(--ring)]/30 p-2 rounded-md text-[var(--primary)]">
          <IoMdPeople size={23} />
        </div>
        <h3 className="text-[var(--chart-3)] text-sm">Total Students</h3>


      </div>


    </div>
    // <div>
    //   <h1>AdminDashboardPage</h1>
    //   <button onClick={logout}>Logout</button>
    // </div>
  );
};

export default AdminDashboardPage;
