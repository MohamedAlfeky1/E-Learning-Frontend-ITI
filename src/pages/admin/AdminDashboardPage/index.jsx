import { useLogout } from "../../../hooks/useLogout";
import { IoMdPeople } from "react-icons/io";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useGetAllCourses } from "@/queries/useCourses";
import TotalNumbersCard from "@/components/admin/TotalNumbersCard";
import { FaGraduationCap } from "react-icons/fa6";
import { useTeacherVerification } from "@/queries/adminVerificationQueries";
import Loader from "@/components/ui/loader";
import { MdOutlineVerified } from "react-icons/md";


const AdminDashboardPage = () => {
  const logout = useLogout();
  const { data: totalCourses, isLoading, error } = useGetAllCourses()
  const { data: verificationData } = useTeacherVerification()


  const verificationRequests = verificationData?.data?.requests
  const activeCourses = totalCourses?.data?.filter((item) => item.status == 'published')
  console.log(activeCourses);

  // Group by month
  const growthByMonth = activeCourses?.reduce((acc, course) => {
    const month = new Date(course.createdAt).toLocaleString('default', { month: 'short' }) // "Jan", "Feb"...
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {})

  const verificationByMonth = verificationRequests?.reduce((acc, request) => {
    const month = new Date(request.createdAt).toLocaleString('default', { month: 'short' }) // "Jan", "Feb"...
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(growthByMonth || {}).map(([month, count]) => ({
    month,
    value: count,
    date: new Date(`${month} 1, 2026`)
  }))
    .sort((a, b) => a.date - b.date)

  const verificationChartData = Object.entries(verificationByMonth || {}).map(([month, count]) => ({
    month,
    value: count,
    date: new Date(`${month} 1, 2026`)
  }))
    .sort((a, b) => a.date - b.date)

  const currentMonthCount = chartData.at(-1)?.value ?? 0
  const previousMonthCount = chartData.at(-2)?.value ?? 0
  const currentVeriMonthCount = verificationChartData.at(-1)?.value ?? 0
  const previousVeriMonthCount = verificationChartData.at(-2)?.value ?? 0

  const growthPercent = previousMonthCount === 0
    ? 100
    : Math.round(((currentMonthCount - previousMonthCount) / previousMonthCount) * 100)

  const verificationGrowthPercent = previousVeriMonthCount === 0
    ? 100
    : Math.round(((currentVeriMonthCount - previousVeriMonthCount) / previousVeriMonthCount) * 100)

  if (isLoading) return <div className="min-h-full min-w-full flex justify-center items-center"><Loader /></div>

  return (
    <div className="grid grid-cols-4 gap-3">

      <div className="col-span-1 sm:col-span-2 md:col-span-4">
        <span className="text-[var(--primary)] text-sm font-semibold">INSTITUTIONAL OVERVIEW</span>
        <h2 className="text-2xl font-extrabold">Academic Dashboard</h2>
      </div>

      <div className="col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">

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

        <TotalNumbersCard icon={<MdOutlineVerified size={23} />} title='Total Verifications Request' number={verificationData?.data?.results}
          chartData={verificationChartData}
          growth={verificationGrowthPercent} />

      </div>

      <div className="col-span-4 md:col-span-3 bg-white rounded-xl p-4 ">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h2 className="text-md font-bold">Monthly Growth</h2>
          <div className="flex gap-3">
            <div className="flex items-center gap-2"><div className="bg-[var(--ring)] w-2 h-2 rounded-full"></div>
              Student
            </div>
            <div className="flex items-center gap-2"><div className="bg-[var(--primary)]/30 w-2 h-2 rounded-full"></div>
              Teacher
            </div>
          </div>
        </div>
        <h3 className="text-[var(--chart-3)] text-sm">User registration vs. course enrollments</h3>
      </div>

      <div className="col-span-4 md:col-span-1 bg-white rounded-xl p-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h2 className="text-md font-bold">Recently Activities</h2>

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
