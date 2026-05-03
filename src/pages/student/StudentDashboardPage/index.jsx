import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";
import StudentDashboardCart from "@/components/student/StudentDashboardCart";
import AiReportSection from "@/components/student/AiReportSection";
import { useUserQuery } from "@/queries/authQueries";
import { useMyCoursesQuery } from "@/queries/enrollmentQueries";
import { useEffect, useState } from "react";
import { MdOutlineMenuBook, MdAssignment, MdOutlineOndemandVideo } from "react-icons/md";
import { toast } from "sonner";
import { TbClockHour10 } from "react-icons/tb";
import { Button } from "../../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { sessionService } from "@/services/sessionService";
import EmptyCourseCard from "@/components/course/EmptyCourseCard";



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
    }
  };

  useEffect(() => {
    fetchBookings()
    fetchAssignments()
  }, [])

  if (isLoading) return <div className="min-h-full min-w-full flex justify-center items-center"><Loader /></div>

  return (
    <div className="grid grid-cols-4 gap-4">

      <div className="col-span-4 flex flex-col gap-4">

        {/* ── Stat Cards — ABOVE the hero ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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

        {/* ── Hero Banner — BELOW the stat cards ── */}
        <div
          className="relative overflow-hidden rounded-2xl pt-10 pb-10 px-7"
          style={{
            background: "linear-gradient(135deg, #2a1ab0 0%, #3525CD 40%, #712AE2 100%)",
          }}
        >
          {/* decorative circles */}
          <div style={{
            position: "absolute", top: "-40px", right: "-40px",
            width: "220px", height: "220px", borderRadius: "50%",
            background: "rgba(255,255,255,0.05)", pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: "-60px", right: "120px",
            width: "160px", height: "160px", borderRadius: "50%",
            background: "rgba(255,255,255,0.04)", pointerEvents: "none",
          }} />
          {/* progress arc accent */}
          <div style={{
            position: "absolute", top: "50%", right: "24px",
            transform: "translateY(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
          }}>
            <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="5" />
              <circle
                cx="32" cy="32" r="26" fill="none"
                stroke="rgba(255,255,255,0.65)" strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 26 * averageProgress / 100} ${2 * Math.PI * 26}`}
                strokeLinecap="round"
              />
            </svg>
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "11px", fontWeight: 700, marginTop: "-4px" }}>
              {averageProgress}%
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-white" style={{ letterSpacing: "-0.02em" }}>
            Welcome Back, {userData.firstName}!
          </h1>
          <p className="text-white/65 font-light text-xs mt-1 leading-relaxed">
            You've completed{" "}
            <span className="text-white font-semibold">{averageProgress}%</span> of your weekly goals. Keep the momentum{" "}
            going to ace your upcoming physics quiz!
          </p>
        </div>

      </div>

      <div className="col-span-4">
        <AiReportSection enrollments={enrollments} />
      </div>

      {/* ── Main Content + Sidebar ── */}
      <div className="col-span-4 grid grid-cols-1 md:grid-cols-[2.5fr_1.5fr] gap-4">

        {/* LEFT: Continue Learning */}
        <div className="flex flex-col gap-4">

          <div className="flex justify-between items-center w-full">
            <h2
              className="font-bold text-xl"
              style={{ color: "var(--foreground)", letterSpacing: "-0.01em" }}
            >
              Continue Learning
            </h2>
            <Button
              variant='link'
              className='text-sm p-0 hover:no-underline hover:cursor-pointer'
              style={{ color: "var(--primary)" }}
              onClick={() => { navigate('/my-courses') }}
            >
              View All Courses →
            </Button>
          </div>

          {/* Featured course card */}
          {!enrollments || enrollments.length === 0 ? (
            <EmptyCourseCard />
          ) : (
            enrollments.slice(0, 1).map((course) => (
              <div
                key={course._id}
                className="flex flex-col md:flex-row gap-0 rounded-2xl overflow-hidden items-stretch"
                style={{
                  background: "var(--card)",
                  border: "1.5px solid var(--border)",
                  boxShadow: "0 2px 16px rgba(53,37,205,0.07)",
                }}
              >
                {/* Thumbnail */}
                <div className="w-full md:w-2/5 min-h-48 shrink-0 relative overflow-hidden">
                  {course.courseId?.thumbnail ? (
                    <>
                      <img
                        src={course?.courseId?.thumbnail}
                        alt="Course Thumbnail"
                        className="w-full h-full object-cover"
                        style={{ transition: "transform 0.4s ease" }}
                      />
                      <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(90deg, transparent 70%, var(--card) 100%)",
                        pointerEvents: "none",
                      }} />
                    </>
                  ) : (
                    <div
                      className="w-full h-full flex flex-col items-center justify-center gap-2"
                      style={{ background: "linear-gradient(135deg, #3525CD, #712AE2)" }}
                    >
                      <MdOutlineOndemandVideo size={40} color="white" />
                      <p className="text-white text-sm font-medium">No Thumbnail</p>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-3 p-5 w-full">
                  <div className="flex items-center gap-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
                    <span
                      style={{
                        background: "rgba(53,37,205,0.09)",
                        color: "var(--primary)",
                        fontWeight: 700,
                        fontSize: "10px",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        padding: "3px 10px",
                        borderRadius: "999px",
                        border: "1px solid rgba(53,37,205,0.15)",
                      }}
                    >
                      {course.courseId?.categoryId?.name || "COURSE"}
                    </span>
                    <span style={{ color: "var(--border)" }}>•</span>
                    <span>
                      Module {course.completedVideos?.length + 1 || 1} of{" "}
                      {course.courseId?.videos?.length || "?"}
                    </span>
                  </div>

                  <h2
                    className="text-xl font-bold leading-snug"
                    style={{ color: "var(--foreground)", letterSpacing: "-0.015em" }}
                  >
                    {course.courseId?.title}
                  </h2>
                  <p
                    className="text-sm font-light break-all overflow-hidden"
                    style={{
                      color: "var(--muted-foreground)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {course.courseId?.description}
                  </p>

                  <div className="w-4/5 flex flex-col gap-2 mt-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                        Course Progress
                      </h3>
                      <h4 className="text-xs font-bold" style={{ color: "var(--primary)" }}>
                        {course.progress}%
                      </h4>
                    </div>
                    <div className="w-full rounded-full h-2" style={{ background: "var(--muted)" }}>
                      <div
                        className="h-2 rounded-full transition-all duration-700"
                        style={{
                          width: `${course.progress}%`,
                          background: course.progress > 0
                            ? "linear-gradient(90deg, #3525CD 0%, #712AE2 100%)"
                            : "transparent",
                          boxShadow: course.progress > 0 ? "0 0 8px rgba(53,37,205,0.4)" : "none",
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-auto pt-1">
                    <button
                      onClick={() => navigate(`/my-courses/${course?.courseId?._id}/learn`)}
                      style={{
                        background: "linear-gradient(135deg, #3525CD 0%, #6246ea 100%)",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "13px",
                        padding: "9px 22px",
                        borderRadius: "10px",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 2px 12px rgba(53,37,205,0.35)",
                        transition: "all 0.2s ease",
                        letterSpacing: "0.01em",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.boxShadow = "0 4px 20px rgba(53,37,205,0.5)";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.boxShadow = "0 2px 12px rgba(53,37,205,0.35)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      ▶ Resume Lesson
                    </button>
                  </div>
                </div>
              </div>
            )))}

          {/* Secondary course cards */}
          <div className="flex flex-col md:flex-row gap-3 flex-1">
            {enrollments?.slice(1, 3).map((course) => (
              <Link
                to={`/my-courses/${course?.courseId?._id}/learn`}
                key={course._id}
                className="p-4 rounded-2xl w-full flex flex-col gap-3 items-start justify-center"
                style={{
                  background: "var(--card)",
                  border: "1.5px solid var(--border)",
                  boxShadow: "0 1px 8px rgba(53,37,205,0.05)",
                  transition: "box-shadow 0.2s, border-color 0.2s, transform 0.18s",
                  textDecoration: "none",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = "0 6px 24px rgba(53,37,205,0.12)";
                  e.currentTarget.style.borderColor = "rgba(53,37,205,0.25)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = "0 1px 8px rgba(53,37,205,0.05)";
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div className="flex gap-3 overflow-hidden w-full">
                  <div className="flex-shrink-0">
                    {course.courseId?.thumbnail ? (
                      <img
                        src={course?.courseId?.thumbnail}
                        alt="Course Thumbnail"
                        className="object-cover rounded-xl"
                        style={{ width: "72px", height: "72px", border: "1.5px solid var(--border)" }}
                      />
                    ) : (
                      <div
                        className="flex flex-col items-center justify-center gap-1 rounded-xl"
                        style={{
                          width: "72px", height: "72px",
                          background: "linear-gradient(135deg, #3525CD, #712AE2)",
                        }}
                      >
                        <MdOutlineOndemandVideo size={24} color="white" />
                        <p className="text-white text-xs font-medium">No Thumb</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center gap-1 min-w-0">
                    <h3
                      className="text-sm font-bold"
                      style={{
                        color: "var(--foreground)",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}
                    >
                      {course.courseId?.title}
                    </h3>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      {course.completed === 'true'
                        ? '✓ All Lessons Completed'
                        : `${course?.completedVideos?.length || 0} Lessons Completed`}
                    </p>

                  </div>
                </div>

                <div
                  className="w-full rounded-full"
                  style={{ height: "6px", background: "var(--muted)" }}
                >
                  {course.progress > 0 && (
                    <div
                      className="rounded-full transition-all duration-500"
                      style={{
                        height: "6px",
                        width: `${course.progress}%`,
                        background: course.completed === 'true'
                          ? "linear-gradient(90deg, #16a34a, #15803d)"
                          : "linear-gradient(90deg, #3525CD, #712AE2)",
                        boxShadow: course.completed === 'true'
                          ? "0 0 6px rgba(22,163,74,0.35)"
                          : "0 0 6px rgba(53,37,205,0.35)",
                      }}
                    />
                  )}
                </div>

              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT: Weekly Schedule */}
        <div
          className="py-5 px-6 rounded-2xl flex flex-col gap-4"
          style={{
            background: "var(--card)",
            border: "1.5px solid var(--border)",
            boxShadow: "0 2px 12px rgba(53,37,205,0.06)",
          }}
        >
          <div className="flex items-center justify-between">
            <h2
              className="font-bold text-base"
              style={{ color: "var(--foreground)", letterSpacing: "-0.01em" }}
            >
              Weekly Schedule
            </h2>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--primary)",
                background: "rgba(53,37,205,0.08)",
                border: "1px solid rgba(53,37,205,0.15)",
                borderRadius: "999px",
                padding: "2px 8px",
              }}
            >
              {bookings?.length || 0} Sessions
            </span>
          </div>

          <div className="flex flex-col gap-3 flex-1 justify-between">
            {bookings?.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center gap-2 mt-6 py-8 rounded-xl"
                style={{
                  background: "var(--muted)",
                  border: "1px dashed var(--border)",
                }}
              >
                <span style={{ fontSize: "28px", opacity: 0.4 }}>📅</span>
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                  No upcoming sessions
                </p>
              </div>
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

                  const statusStyles = {
                    pending: { dot: "#eab308", text: "#ca8a04", bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.2)" },
                    confirmed: { dot: "#22c55e", text: "#16a34a", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)" },
                    cancelled: { dot: "#ef4444", text: "#dc2626", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" },
                    completed: { dot: "#94a3b8", text: "#64748b", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.2)" },
                  };
                  const s = statusStyles[booking.status] || statusStyles.pending;

                  return (
                    <div key={booking._id} className="flex gap-3 items-start">
                      <div
                        className="flex flex-col items-center justify-center rounded-xl py-2 px-3 shrink-0"
                        style={{
                          background: "rgba(53,37,205,0.07)",
                          border: "1px solid rgba(53,37,205,0.12)",
                          minWidth: "48px",
                        }}
                      >
                        <span style={{ fontSize: "9px", fontWeight: 700, color: "var(--primary)", letterSpacing: "0.08em" }}>
                          {dayName}
                        </span>
                        <span style={{ fontSize: "20px", fontWeight: 800, color: "var(--foreground)", lineHeight: 1.1 }}>
                          {dayNum}
                        </span>
                      </div>

                      <div
                        className="rounded-xl px-4 py-3 flex flex-col gap-1 w-full"
                        style={{
                          background: s.bg,
                        }}
                      >
                        <span style={{ fontSize: "10px", color: "var(--muted-foreground)", fontWeight: 500 }}>
                          {startFormatted} – {endFormatted}
                        </span>
                        <h3 style={{ fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}>
                          {booking.topic}
                        </h3>
                        <p style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>
                          {booking.teacherId?.firstName} {booking.teacherId?.lastName}
                          <span className="mx-1">·</span>
                          <span style={{ color: s.text, fontWeight: 600, textTransform: "capitalize" }}>
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
              style={{
                background: "transparent",
                border: "2px dashed var(--border)",
                borderRadius: "12px",
                padding: "12px",
                fontWeight: 700,
                fontSize: "13px",
                color: "var(--muted-foreground)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                width: "100%",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(53,37,205,0.06)";
                e.currentTarget.style.borderColor = "rgba(53,37,205,0.35)";
                e.currentTarget.style.color = "var(--primary)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--muted-foreground)";
              }}
            >
              + Add New Event
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboardPage;