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

  const estimatedHours = enrollments?.reduce((sum, e) => {
    const totalHours = e.courseId?.totalHours;
    if (totalHours) {
      return sum + totalHours * (e.progress / 100);
    }
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
    }
  }

  const fetchAssignments = async () => {
    try {
      const endpoint = ENDPOINTS.ASSIGNMENTS_MY || "/assignment/my-submissions";
      const response = await axiosInstance.get(endpoint);
      setAssignmentData(response?.data?.data);
    } catch (error) {
      console.error("Failed to load assignments", error);
      // Suppress the toast error to avoid annoying the user if the endpoint isn't implemented yet
    }
  };

  useEffect(() => {
    fetchBookings()
    fetchAssignments()
  }, [])

  if (isLoading) return <div className="min-h-full min-w-full flex justify-center items-center"><Loader /></div>

  return (
    <div className="grid grid-cols-4 gap-3">

      <div className="col-span-4">

        {/* Hero banner — kept as-is, it's an intentional branded gradient */}
        <div className="bg-gradient-to-tr from-[#3525CD] to-[#712AE2] rounded-2xl pt-10 pb-16 px-7">
          <h1 className="text-3xl font-extrabold text-white">Welcom Back, {userData.firstName}!</h1>
          <p className="text-white/70 font-light text-xs">
            You've completed{" "}
            <span className="text-white">{averageProgress}%</span> of your weekly goals. Keep the momentum <br />
            going to ace your upcoming physics quiz!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 -mt-6 px-5">
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
            wordColor="text-[var(--primary)]"
            title='Overall Progress'
            length={estimatedHours > 0 ? estimatedHours.toFixed(1) : null}
          />
        </div>

      </div>

      <div className="col-span-4 grid grid-cols-1 md:grid-cols-[2.5fr_1.5fr] gap-3">

        <div className="flex flex-col gap-3">

          <div className="flex justify-between items-center w-full">
            <h2 className="font-bold text-xl text-[var(--foreground)]">Countinue Learning</h2>
            <Button
              variant='link'
              className='text-sm p-0 hover:no-underline hover:cursor-pointer text-[var(--primary)]'
              onClick={() => { navigate('/my-courses') }}
            >
              View All Courses
            </Button>
          </div>

          <div>
            {enrollments?.slice(0, 1).map((course) => {
              return (
                <div
                  key={course._id}
                  className="flex flex-col md:flex-row gap-4 rounded-md overflow-hidden items-stretch bg-[var(--secondary)]"
                >
                  {/* Thumbnail */}
                  <div className="w-full md:w-2/5 min-h-48 shrink-0">
                    {course.courseId?.thumbnail ? (
                      <img
                        src={course?.courseId?.thumbnail}
                        alt="Course Thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[var(--primary)] flex flex-col items-center justify-center gap-2">
                        <MdOutlineOndemandVideo size={40} color="white" />
                        <p className="text-[var(--primary-foreground)] text-sm font-medium">No Thumbnail</p>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-3 p-4 w-full">
                    {/* Badge + Module */}
                    <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                      <span className="bg-[var(--primary)]/10 text-[var(--primary)] font-semibold px-2 py-1 rounded-full">
                        {course.courseId?.categoryId?.name || "COURSE"}
                      </span>
                      <span>•</span>
                      <span>
                        Module {course.completedVideos?.length + 1 || 1} of{" "}
                        {course.courseId?.videos?.length || "?"}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold leading-snug text-[var(--foreground)]">
                      {course.courseId?.title}
                    </h2>
                    <p className="text-sm font-light text-[var(--muted-foreground)] line-clamp-2">
                      {course.courseId?.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-4/5 flex flex-col gap-3">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-xs font-semibold text-[var(--foreground)]">Course Progress</h3>
                        <h4 className="text-xs font-semibold text-[var(--foreground)]">{course.progress}%</h4>
                      </div>
                      <div className="w-full bg-[var(--muted)] rounded-full h-2">
                        {course.progress > 0 ? (
                          <div
                            className="bg-[var(--primary)] h-2 rounded-full transition-all duration-500"
                            style={{ width: `${course.progress}%` }}
                          />
                        ) : (
                          <div className="bg-[var(--border)] h-2 rounded-full transition-all duration-500 w-full" />
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 mt-1">
                      <Button onClick={() => navigate(`/my-courses/${course?.courseId?._id}/learn`)} className='rounded-md'>
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
                <Link
                  to={`/my-courses/${course?.courseId?._id}/learn`}
                  key={course._id}
                  className="p-3 bg-[var(--secondary)] rounded-md w-full flex flex-col gap-3 items-start justify-center"
                >
                  <div className="flex gap-3 rounded-md overflow-hidden">
                    <div>
                      {course.courseId?.thumbnail ? (
                        <img
                          src={course?.courseId?.thumbnail}
                          alt="Course Thumbnail"
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-[var(--primary)] flex flex-col items-center justify-center gap-2 rounded-md">
                          <MdOutlineOndemandVideo size={30} color="white" />
                          <p className="text-[var(--primary-foreground)] text-xs font-medium">No Thumbnail</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="text-md font-bold text-[var(--foreground)]">{course.courseId?.title}</h3>
                      <p className="font-light text-xs text-[var(--muted-foreground)]">
                        {course.completed == 'true'
                          ? 'All Lessons Completed'
                          : (course?.completedVideos?.length || 0) + ' Lessons Completed'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-[var(--muted)] rounded-full h-2">
                    {course.progress > 0 ? (
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${course.completed == 'true' ? 'bg-green-500' : 'bg-[var(--primary)]'}`}
                        style={{ width: `${course.progress}%` }}
                      />
                    ) : (
                      <div className="bg-[var(--border)] h-2 rounded-full transition-all duration-500 w-full" />
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Weekly Schedule sidebar */}
        <div className="bg-[var(--secondary)] py-5 px-7 rounded-md">
          <h2 className="font-bold text-md mb-4 text-[var(--foreground)]">Weekly Schedule</h2>

          <div className="flex flex-col gap-3 flex-1 justify-between">
            {bookings?.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)] text-center mt-6">No upcoming sessions</p>
            ) : (
              <div className="flex flex-col gap-3">
                {bookings?.map((booking) => {
                  const date = new Date(booking.scheduledDate);
                  const dayName = date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
                  const dayNum = date.getDate();

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
                    completed: "bg-[var(--muted-foreground)]",
                  }[booking.status] || "bg-[var(--primary)]";

                  return (
                    <div key={booking._id} className="flex gap-4 items-start">
                      {/* Date Column */}
                      <div className="flex flex-col items-center min-w-[40px]">
                        <span className="text-[10px] font-semibold text-[var(--muted-foreground)]">{dayName}</span>
                        <span className="text-xl font-bold text-[var(--foreground)]">{dayNum}</span>
                        <div className={`w-1.5 h-1.5 rounded-full mt-1 ${statusColor}`} />
                      </div>

                      {/* Card */}
                      <div className="bg-[var(--card)] border-l-4 border-[var(--primary)] rounded-xl px-4 py-3 flex flex-col gap-1 w-full shadow-sm">
                        <span className="text-xs text-[var(--muted-foreground)] font-medium">
                          {startFormatted} - {endFormatted}
                        </span>
                        <h3 className="text-sm font-bold text-[var(--card-foreground)]">{booking.topic}</h3>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {booking.teacherId?.firstName} {booking.teacherId?.lastName}
                          <span className="mx-1">•</span>
                          <span className={`capitalize font-medium ${
                            booking.status === "pending" ? "text-yellow-500" :
                            booking.status === "confirmed" ? "text-green-500" :
                            booking.status === "cancelled" ? "text-red-400" :
                            "text-[var(--muted-foreground)]"
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
              onClick={() => { navigate('/teachers') }}
              className='bg-transparent border-2 border-dashed border-[var(--border)] rounded-lg py-3 font-bold text-sm text-[var(--muted-foreground)]
              hover:bg-[var(--primary)]/10 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:cursor-pointer transition-all duration-200'
            >
              Add New Event
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboardPage;