import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";
import StudentDashboardCart from "@/components/student/StudentDashboardCart";
import { useUserQuery } from "@/queries/authQueries";
import { useMyCoursesQuery } from "@/queries/enrollmentQueries";
import { useEffect, useState } from "react";
import { MdOutlineMenuBook, MdAssignment, MdOutlineOndemandVideo } from "react-icons/md";
import { toast } from "sonner";
import { TbClockHour10 } from "react-icons/tb";
import { Button } from "../../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { sessionService } from "@/services/sessionService";


const StudentDashboardPage = () => {
  const [assignmetData, setAssignmentData] = useState([])
  const [bookings, setBookings] = useState([])
  const { data: userData, isLoading, error } = useUserQuery()
  const { data: enrollments } = useMyCoursesQuery();
  const navigate = useNavigate()


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

  const fetchBookings = async () => {
    try {
      const response = await sessionService.getMyBookings()
      setBookings(response.data.data || [])
      console.log('Teacher Booking', response.data.data);

    } catch (error) {
      toast.error("Failed to load your bookings")
      console.error(error)
    } finally {
    }
  }

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
    fetchBookings()
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
            icon={<MdOutlineMenuBook color="text-[var(--primary)]" />}
            spanNum={completeCourses?.length || null}
            word={completeCourses?.length ? 'NEW' : ''}
            wordColor="text-green-900"
            title='Courses In Progress'
            length={inProgressCourses?.length}
          />

          <StudentDashboardCart
            icon={<MdAssignment color="[var(--primary)]" />}
            spanNum={null}
            word={assignmetData?.results > 0 ? 'ON TRACK' : ''}
            wordColor="text-blue-600"
            title='Completed Assignments'
            length={assignmetData?.results || null}
          />

          <StudentDashboardCart
            icon={<TbClockHour10 color="black" />}
            badgeColor="bg-green-300"
            spanNum={null}
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

      <div className="col-span-4 grid grid-cols-1 md:grid-cols-[2.5fr_1.5fr] gap-3">

        <div className="flex flex-col gap-3">

          <div className="flex justify-between items-center w-full">
            <h2 className="font-bold text-xl">Countinue Learning</h2>
            <Button variant='link' className='text-sm p-0 hover:no-underline hover:cursor-pointer'
              onClick={() => { navigate('/my-courses') }}>View All Courses</Button>
          </div>

          <div>
            {enrollments?.slice(0, 1).map((course) => {
              return (
                <div key={course._id}
                  className="flex flex-col md:flex-row gap-4 rounded-md overflow-hidden items-stretch bg-[var(--secondary)]">
                  {/* Thumbnail */}
                  <div className="w-full md:w-2/5 min-h-48 shrink-0">
                    {course.courseId?.thumbnail ? (
                      <img
                        src={course?.courseId?.thumbnail}
                        alt="Course Thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center gap-2">
                        <MdOutlineOndemandVideo size={40} color="white" />
                        <p className="text-white text-sm font-medium">No Thumbnail</p>
                      </div>
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex flex-col  gap-3 p-4 w-full">
                    {/* Badge + Module */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="bg-purple-100 text-purple-700 font-semibold px-2 py-1 rounded-full">
                        {course.courseId?.categoryId.name || "COURSE"}
                      </span>
                      <span>•</span>
                      <span>
                        Module {course.completedVideos?.length + 1 || 1} of{" "}
                        {course.courseId?.videos?.length || "?"}
                      </span>
                    </div>
                    {/* Title */}
                    <h2 className="text-2xl font-bold leading-snug">{course.courseId?.title}</h2>
                    <p className="text-sm font-light text-gray-500 line-clamp-2">{course.courseId.description}</p>
                    {/* Progress Bar */}
                    <div className="w-4/5 flex flex-col gap-3">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-xs font-semibold">Course Progress</h3>
                        <h4 className="text-xs font-semibold">{course.progress}%</h4>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        {course.progress > 0 ?
                          <div
                            className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${course.progress}%` }}
                          />
                          :
                          <div
                            className="bg-gray-400 h-2 rounded-full transition-all duration-500 w-full"
                          // style={{ width: `${course.progress}%` }}
                          />
                        }

                      </div>

                    </div>
                    <div className="flex gap-3 mt-1">
                      <Button onClick={() => { navigate(`/my-courses/${course._id}/learn`) }}
                        className='rounded-md'>
                        Resume Lesson
                      </Button>
                    </div>
                  </div>



                </div>
              )
            })}
          </div>

          <div className="flex flex-col md:flex-row gap-3 rounded-md flex-1">
            {enrollments?.slice(1, 3).map((course) => {
              return (
                <Link to={`/my-courses/${course._id}/learn`} className="p-3 bg-gray-200 rounded-md w-full flex flex-col gap-3 items-start justify-center">
                  <div className="flex gap-3 rounded-md overflow-hidden">
                    <div>
                      {course.courseId?.thumbnail ? (
                        <img
                          src={course?.courseId?.thumbnail}
                          alt="Course Thumbnail"
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center gap-2">
                          <MdOutlineOndemandVideo size={40} color="white" />
                          <p className="text-white text-sm font-medium">No Thumbnail</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="text-md font-bold">{course.courseId?.title}</h3>
                      <p className="font-light text-xs ">
                        {course.completed == 'true' ?
                          'All Lessons Completed' :
                          course?.completedVideos.length + ' Lessons Completed'
                        }
                      </p>
                    </div>

                  </div>
                  {/* Progress Bar */}
                  {course.completed == 'false' ?
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      {course.progress > 0 ?
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-500 w-full"
                          style={{ width: `${course.progress}%` }}
                        />
                        :
                        <div
                          className="bg-gray-400 h-2 rounded-full transition-all duration-500 w-full"
                        />
                      }

                    </div>
                    :
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      {course.progress > 0 ?
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-500 w-full"
                          style={{ width: `${course.progress}%` }}
                        />
                        :
                        <div
                          className="bg-gray-400 h-2 rounded-full transition-all duration-500 w-full"
                        />
                      }

                    </div>
                  }


                </Link>
              )
            })}
          </div>
        </div>

        <div className="bg-[var(--secondary)] py-5 px-7 rounded-md">
          <h2 className="font-bold text-md mb-4">Weekly Schedule</h2>

          <div className="flex flex-col gap-3 flex-1 justify-between">

            {bookings?.length === 0 ? (
              <p className="text-sm text-gray-400 text-center mt-6">No upcoming sessions</p>
            ) : (
              <div className="flex flex-col gap-3">
                {bookings?.map((booking) => {
                  const date = new Date(booking.scheduledDate);
                  const dayName = date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
                  const dayNum = date.getDate();

                  // Calculate end time from scheduledTime + duration (fallback 90min)
                  const [startHour, startMin] = booking.scheduledTime.split(":").map(Number);
                  const durationMins = booking.duration || 60;
                  const endDate = new Date(0, 0, 0, startHour, startMin + durationMins);
                  const format = (h, m) =>
                    `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
                  const startFormatted = format(startHour, startMin);
                  const endFormatted = format(endDate.getHours(), endDate.getMinutes());

                  const statusColor = {
                    pending: "bg-yellow-400",
                    confirmed: "bg-green-500",
                    cancelled: "bg-red-400",
                    completed: "bg-gray-400",
                  }[booking.status] || "bg-purple-500";

                  return (
                    <div key={booking._id} className="flex gap-4 items-start">
                      {/* Date Column */}
                      <div className="flex flex-col items-center min-w-[40px]">
                        <span className="text-[10px] font-semibold text-gray-400">{dayName}</span>
                        <span className="text-xl font-bold">{dayNum}</span>
                        <div className={`w-1.5 h-1.5 rounded-full mt-1 ${statusColor}`} />
                      </div>

                      {/* Divider */}
                      {/* <div className="w-[3px] self-stretch bg-purple-500 rounded-full" /> */}

                      {/* Card */}
                      <div className="bg-white border-l-5 border-purple-500 rounded-xl px-4 py-3 flex flex-col gap-1 w-full shadow-sm">
                        <span className="text-xs text-gray-400 font-medium">
                          {startFormatted} - {endFormatted}
                        </span>
                        <h3 className="text-sm font-bold">{booking.topic}</h3>
                        <p className="text-xs text-gray-500">
                          {booking.teacherId?.firstName} {booking.teacherId?.lastName}
                          <span className="mx-1">•</span>
                          <span className={`capitalize font-medium ${booking.status === "pending" ? "text-yellow-500" :
                            booking.status === "confirmed" ? "text-green-500" :
                              booking.status === "cancelled" ? "text-red-400" : "text-gray-400"
                            }`}>
                            {booking.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })}

              </div>
            )}

            <button
            onClick={()=>{navigate('/teachers')}}
              className='bg-transparent border-2 border-dashed rounded-lg py-3 font-bold text-sm text-gray-600
              hover:bg-[var(--primary)]/20 hover:border-0 hover:cursor-pointer transform duration-200'>
              Add New Event
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboardPage;
