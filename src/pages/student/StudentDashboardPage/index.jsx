import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";
import StudentDashboardCart from "@/components/student/StudentDashboardCart";
import { useUserQuery } from "@/queries/authQueries";
import { useMyCoursesQuery } from "@/queries/enrollmentQueries";
import { useEffect, useState } from "react";
import { MdOutlineMenuBook, MdAssignment } from "react-icons/md";
import { toast } from "sonner";
import { TbClockHour10 } from "react-icons/tb";

const StudentDashboardPage = () => {
  const [assignmetData, setAssignmentData] = useState([])
  const { data: userData, isLoading, error } = useUserQuery()
  const { data: enrollments } = useMyCoursesQuery();

  const inProgressCourses = enrollments?.filter((enrollment) => {
    return enrollment?.completed === false;
  })
  const completeCourses = enrollments?.filter((enrollment) => {
    return enrollment?.completed === true;
  })

  const averageProgress = enrollments?.length
    ? Math.round(
      enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length
    )
    : 0;
  // 33.33... → 33

  const estimatedHours = enrollments?.reduce((sum, e) => {
    const totalHours = e.courseId?.totalHours;
    if (totalHours) {
      return sum + totalHours * (e.progress / 100);
    }
    // Fallback: assume ~10 min per completed video
    const completedVideos = e.completedVideos?.length || 0;
    return sum + (completedVideos * 10) / 60;
  }, 0) || 0;

  const fetchAssignments = async () => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ASSIGNMENTS_MY)
      setAssignmentData(response?.data?.data)
      console.log(response?.data);

    }
    catch (error) {
      toast.error("Failed to load your Assignments")
      console.error(error)
    }
  }

  console.log('enrollments', enrollments);

  console.log('inProgressCourses', inProgressCourses);

  useEffect(() => {
    fetchAssignments()
  }, [])

  if (isLoading) return <div className="min-h-full min-w-full flex justify-center items-center"><Loader /></div>

  return (

    <div className="grid grid-cols-4 gap-3">

      <div className="col-span-4">

        <div className="bg-gradient-to-tr from-[#3525CD] to-[#712AE2] rounded-2xl pt-10 pb-16 px-7">
          <h1 className="text-3xl font-extrabold text-white">Welcom Back, {userData.firstName}!</h1>
          <p className="text-gray-300 font-light text-xs">You've completed {" "}<span className="text-white">{averageProgress}%</span> of your weekly goals. Keep the momentum <br />
            going to ace your upcoming physics quiz!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 -mt-6 px-5">

          <StudentDashboardCart
            icon={<MdOutlineMenuBook color="text-[var(--primary)]"/>}
            spanNum={completeCourses?.length || null}
            word={completeCourses?.length ? 'NEW' : ''}
            wordColor="text-green-900"
            title='Courses In Progress'
            length={inProgressCourses?.length}
          />

          <StudentDashboardCart
            icon={<MdAssignment color="[var(--primary)]"/>}
            spanNum={null}
            word={assignmetData?.results > 0 ? 'ON TRACK' : ''}
            wordColor="text-blue-600"
            title='Completed Assignments'
            length={assignmetData?.results || null}
          />

          <StudentDashboardCart
            icon={<TbClockHour10 color="black"/>}
            badgeColor="bg-green-300"
            spanNum={null}
            word={estimatedHours > 0 ? 'STREAK: 12d' : ''}
            wordColor="text-purple-600"
            title='Overall Progress'
            length={estimatedHours > 0 ? estimatedHours.toFixed(1) : null}
          />

          {/* <StudentDashboardCart icon={<TbClockHour10 />} spanNum='' word='' title='Overall Progress' length={`${averageProgress}%`} /> */}

          <div className="bg-white rounded-md p-4 flex flex-col justify-center gap-3 w-[220px]">


            <h3 className="text-[var(--chart-3)] text-sm">Learning Hours</h3>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
