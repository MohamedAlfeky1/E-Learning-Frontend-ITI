import { Badge } from "@/components/ui/badge";
import Loader from "@/components/ui/loader";
import { useCategories } from "@/queries/categoryQueries";
import { useGetCoursesById } from "@/queries/useCourses";
import { FaStar } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdPeople } from "react-icons/io";
import { IoPricetags, IoInfinite, IoFileTrayFullSharp } from "react-icons/io5";
import {
  MdPlayLesson,
  MdOutlineStarBorder,
  MdOutlineAddShoppingCart,
  MdOutlineVerified,
  MdOndemandVideo,
} from "react-icons/md";
import { MessageSquare } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useGetCourseReview } from "@/queries/useReviewQueries";
import { useUserQuery } from "@/queries/authQueries";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useGetCartItems } from "@/queries/useCartQueries";
import { useEnrollmentDetailsQuery } from "@/queries/enrollmentQueries";
import { useAddToCart } from "@/mutations/cartMutations";

/* ─── Helpers ──────────────────────────────────────────────── */

const StarRow = ({ rating, max = 5 }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: max }).map((_, i) =>
      i < Math.round(rating)
        ? <FaStar key={i} size={12} color="var(--primary)" />
        : <MdOutlineStarBorder key={i} size={14} color="var(--muted-foreground)" />
    )}
  </div>
);

const StatChip = ({ icon, text }) => (
  <div className="flex items-center gap-1.5 bg-[var(--background)] border border-[var(--border)] rounded-full px-3 py-1.5 text-xs font-medium text-[var(--foreground)]">
    {icon}{text}
  </div>
);

const InstructorAvatar = ({ teacher, size = "md" }) => {
  const initials = `${teacher?.firstName?.[0] ?? ""}${teacher?.lastName?.[0] ?? ""}`;
  const cls = size === "lg" ? "w-14 h-14 text-base" : "w-10 h-10 text-sm";
  return teacher?.avatar
    ? <img src={teacher.avatar} alt={teacher.firstName} className={`${cls} rounded-full object-cover ring-2 ring-[var(--primary)]/20`} />
    : <span className={`${cls} rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-bold`}>{initials}</span>;
};

const SectionTitle = ({ children }) => (
  <h2 className="text-2xl font-bold text-[var(--foreground)] pl-4 relative before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-full before:bg-[var(--primary)]">
    {children}
  </h2>
);

/* ─── Page ─────────────────────────────────────────────────── */

const CourseDetailsPage = () => {
  const { id } = useParams();
  const [openPopover, setOpenPopover] = useState(false);
  const [openAppointmentDialog, setOpenAppointmentDialog] = useState(false);

  const { data: userData, isLoading: useLoading } = useUserQuery();
  const { data: cartData } = useGetCartItems();
  const { data, isLoading, error } = useGetCoursesById(id);
  const { data: categoriesData } = useCategories();
  const { data: reviewsData } = useGetCourseReview(id);
  const { data: enrollmentData } = useEnrollmentDetailsQuery(id);
  const addToCartMutation = useAddToCart();

  const userRole = userData?.role;
  const isInCart = cartData?.data?.cart?.items?.some(
    (item) => item.courseId === id || item.courseId?._id === id
  );

  const navigate = useNavigate();
  const isLoggedIn = !!userData?._id;
  const course = data?.data;

  const categoryName =
    categoriesData?.data?.find((cat) => cat._id === course?.categoryId)?.name || "Category";
  const totalVideos =
    course?.lessons.reduce((total, lesson) => total + lesson.videos.length, 0) || 0;
  const totalMaterials =
    course?.lessons.reduce((total, lesson) => total + lesson.materials.length, 0) || 0;

  const handleAddToCart = () => {
    addToCartMutation.mutate({ courseId: course._id }, {
      onSuccess: () => toast.success("Course Added To Cart"),
      onError: () => toast.error("Error Add Course To Cart"),
    });
  };

  const handleEnroll = () => {
    try {
      if (!isLoggedIn) { setOpenPopover(true); return; }
      if (course.type === "paid") handleAddToCart();
      else if (course.type === "free")
        navigate(`/checkout-page?courseId=${course._id}`, { state: { isFreeCourse: true } });
    } catch (err) { toast.error(err); }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader />
    </div>
  );
  if (error) return <div className="text-red-500 p-8">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-[var(--background)]">

      {/* ── Hero ── */}
      <div className="bg-[var(--secondary)] relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-[var(--primary)]/5 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 rounded-full bg-[var(--primary)]/4 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-20 grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
          <div className="col-span-2 flex flex-col gap-5">
            <Badge variant="lightPruple" className="w-fit">{categoryName}</Badge>

            <h1 className="text-[var(--foreground)] text-4xl md:text-5xl font-extrabold leading-tight">
              {course.title}
            </h1>

            {course.createdAt && (
              <p className="text-[var(--foreground)] font-medium text-xs">
                Created At:{" "}
                <span className="text-[var(--muted-foreground)] font-light">
                  {new Date(course.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </p>
            )}

            <p className="text-[var(--muted-foreground)] text-[15px] leading-relaxed max-w-2xl">
              {course.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-1">
              <StatChip icon={<FaStar color="var(--primary)" size={12} />} text={`${course.averageRating?.toFixed(1) ?? "–"} (${course.totalReviews} reviews)`} />
              <StatChip icon={<IoMdPeople color="var(--primary)" size={14} />} text={`${course.totalStudents} students`} />
              <StatChip icon={<IoPricetags color="var(--primary)" size={12} />} text={course.type === "paid" ? `$${course.price}` : "Free"} />
            </div>
          </div>

          <div className="col-span-1 flex justify-center">
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt="Course Thumbnail"
                className="w-full max-w-lg rounded-2xl object-cover shadow-2xl shadow-[var(--primary)]/20 ring-1 ring-[var(--border)] transform rotate-2 hover:rotate-0 transition-transform duration-300"
              />
            ) : (
              <div className="w-full max-w-xs aspect-video bg-[var(--primary)]/10 border border-[var(--border)] rounded-2xl flex flex-col items-center justify-center gap-3 transform rotate-2 shadow-xl">
                <MdOndemandVideo size={44} color="var(--primary)" />
                <p className="text-[var(--muted-foreground)] text-sm font-medium px-4 text-center">{course.title}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Left */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-10">

          {/* What you'll learn */}
          <div className="flex flex-col gap-4">
            <SectionTitle>What You'll Learn</SectionTitle>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {course.whatYouWillLearn.map((item, i) => (
                <li key={i} className="flex items-start gap-3 bg-[var(--secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--muted-foreground)]">
                  <span className="text-[var(--primary)] font-bold mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Feature cards */}
          <div className="flex flex-wrap gap-4">
            {[
              { icon: <MdOutlineVerified size={22} color="var(--primary)" />, title: "Certified", sub: "Industry recognized certificate" },
              { icon: <IoInfinite size={22} color="var(--primary)" />, title: "Lifetime Access", sub: "Learn at your own pace" },
            ].map(({ icon, title, sub }) => (
              <div key={title} className="flex items-center gap-4 bg-[var(--secondary)] border border-[var(--border)] rounded-2xl px-5 py-4 min-w-[200px]">
                <span className="bg-[var(--primary)]/10 rounded-xl p-2.5 flex-shrink-0">{icon}</span>
                <div>
                  <p className="font-semibold text-[var(--foreground)] text-sm">{title}</p>
                  <p className="text-[var(--muted-foreground)] text-xs mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Lessons */}
          <div className="flex flex-col gap-4">
            <SectionTitle>Course Lessons</SectionTitle>
            {course?.lessons?.length > 0 ? (
              <div className="bg-[var(--secondary)] border border-[var(--border)] rounded-2xl overflow-hidden">
                {course.lessons.map((lesson, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--primary)]/5 transition-colors"
                    style={{ borderBottom: i < course.lessons.length - 1 ? "1px solid var(--border)" : "none" }}
                  >
                    <span className="bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 rounded-lg px-2.5 py-1 text-xs font-bold flex-shrink-0">
                      {String(lesson.orderIndex).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-[var(--foreground)] font-medium text-sm">{lesson.title}</p>
                      <p className="text-[var(--muted-foreground)] text-xs mt-0.5">{lesson.videos.length} video{lesson.videos.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-red-500 text-sm">No Lessons Provided</p>
            )}
          </div>

          {/* Reviews */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <SectionTitle>Student Reviews</SectionTitle>
              <div className="text-right flex-shrink-0 ml-4">
                <p className="text-3xl font-extrabold text-[var(--foreground)] leading-none">
                  {course.averageRating?.toFixed(1) ?? "–"}
                </p>
                <div className="mt-1"><StarRow rating={course.averageRating ?? 0} /></div>
                <p className="text-[var(--muted-foreground)] text-xs mt-1">{course.totalReviews} reviews</p>
              </div>
            </div>
            <p className="text-[var(--muted-foreground)] text-sm -mt-2">What our global community says</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviewsData?.data?.length === 0 ? (
                <p className="col-span-2 text-center text-red-500 text-sm">No Review Provided</p>
              ) : (
                reviewsData?.data?.map((review, i) => (
                  <div key={i} className="bg-[var(--secondary)] border border-[var(--border)] rounded-2xl p-4 hover:-translate-y-0.5 transition-transform">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-[var(--muted)] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {review.studentId?.avatar
                            ? <img src={review.studentId.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                            : <span className="text-[var(--foreground)] text-xs font-semibold">
                                {`${review.studentId?.firstName?.[0] ?? ""}${review.studentId?.lastName?.[0] ?? ""}`}
                              </span>
                          }
                        </div>
                        <p className="font-semibold text-[var(--foreground)] text-sm">
                          {review.studentId?.firstName} {review.studentId?.lastName}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-sm font-semibold text-[var(--foreground)]">{review.rating}</span>
                        <FaStar color="var(--primary)" size={12} />
                      </div>
                    </div>
                    <p className="text-[var(--muted-foreground)] text-sm italic leading-relaxed">"{review.comment}"</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="col-span-1 flex flex-col gap-5">

          {/* Enroll card */}
          <div className="bg-[var(--secondary)] border border-[var(--border)] rounded-2xl p-6 flex flex-col gap-5  top-6">
            {enrollmentData ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-green-700 font-semibold text-sm">✓ You're enrolled in this course</p>
              </div>
            ) : (
              <>
                <div>
                  {course.type === "paid"
                    ? <p className="text-[var(--foreground)] font-extrabold text-5xl">${course.price}</p>
                    : <p className="text-[var(--foreground)] font-extrabold text-5xl">Free</p>
                  }
                  {course?.updatedAt && (
                    <p className="text-xs text-[var(--muted-foreground)] mt-2">
                      Last updated:{" "}
                      {new Date(course.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  )}
                </div>

                {userRole === "student" && (
                  <Button
                    variant="default"
                    onClick={handleEnroll}
                    disabled={useLoading || isInCart}
                    className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 ${isInCart ? "bg-[var(--muted-foreground)]" : ""}`}
                  >
                    <MdOutlineAddShoppingCart size={17} />
                    {useLoading ? "Loading…" : isInCart ? "Added to Cart ✓" : "Enroll Now"}
                  </Button>
                )}

                <Button variant="secondary" className="w-full py-3 rounded-xl text-[var(--primary)] font-semibold text-sm">
                  Try Free Preview
                </Button>

                <Dialog open={openPopover} onOpenChange={setOpenPopover}>
                  <DialogContent showCloseButton={true}>
                    <DialogHeader>
                      <DialogTitle>Login Required</DialogTitle>
                      <DialogDescription>You need to be logged in to enroll in this course.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="purpleBtnDefault" className="w-full" onClick={() => navigate("/login")}>Go to Login</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}

            <hr className="border-[var(--border)]" />

            <div>
              <p className="text-[var(--foreground)] font-semibold text-sm mb-3">This course includes:</p>
              <div className="flex flex-col gap-2.5">
                {[
                  { icon: <MdPlayLesson color="var(--primary)" size={16} />, text: `${course.lessons.length} Lessons` },
                  { icon: <MdOndemandVideo color="var(--primary)" size={16} />, text: `${totalVideos} Videos` },
                  { icon: <IoFileTrayFullSharp color="var(--primary)" size={15} />, text: `${totalMaterials} Materials` },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-sm text-[var(--muted-foreground)]">
                    <span className="flex-shrink-0">{icon}</span>{text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Instructor card */}
          <div className="bg-[var(--secondary)] border border-[var(--border)] rounded-2xl p-6 flex flex-col gap-4">
            <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest">Your Instructor</p>

            <div className="flex items-center gap-3">
              <InstructorAvatar teacher={course.teacherId} size="lg" />
              <div>
                <p className="font-semibold text-[var(--foreground)] text-[15px]">
                  {course.teacherId?.firstName} {course.teacherId?.lastName}
                </p>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{course.teacherId?.email}</p>
              </div>
            </div>

            {course.teacherId?.bio && (
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed border-l-2 border-[var(--primary)]/40 pl-3">
                {course.teacherId.bio}
              </p>
            )}

            <div className="flex gap-2.5 mt-1">
              {userRole === "student" && (
                <Button
                  variant="secondary"
                  className="rounded-xl text-[var(--primary)] flex-1 py-2 text-sm font-semibold"
                  onClick={() => { if (!isLoggedIn) setOpenAppointmentDialog(true); else navigate(`/teachers/${course.teacherId?._id}/book`); }}
                >
                  Book Appointment
                </Button>
              )}
              <Button
                onClick={() => navigate(`/teachers/${course.teacherId?._id}`)}
                variant="outline"
                className="rounded-xl text-[var(--muted-foreground)] flex-1 py-2 text-sm"
              >
                View Profile
              </Button>
            </div>

            <Dialog open={openAppointmentDialog} onOpenChange={setOpenAppointmentDialog}>
              <DialogContent showCloseButton={true}>
                <DialogHeader>
                  <DialogTitle>Login Required</DialogTitle>
                  <DialogDescription>You need to be logged in to book an appointment.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="purpleBtnDefault" className="w-full" onClick={() => navigate("/login")}>Go to Login</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Chat with Teacher Card (Enrolled Only) */}
          {userRole === "student" && enrollmentData && (
            <div className="bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-2xl p-6 flex flex-col gap-4 items-center text-center">
              <div className="bg-[var(--primary)]/10 p-3 rounded-full">
                <MessageSquare className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--foreground)] text-[15px]">Have Questions?</h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">Chat directly with {course.teacherId?.firstName} for help</p>
              </div>
              <Button
                onClick={() => navigate(`/chats`, {
                  state: {
                    courseId: course._id,
                    teacherId: course.teacherId?._id,
                    teacherName: `${course.teacherId?.firstName || ""} ${course.teacherId?.lastName || ""}`.trim(),
                  },
                })}
                className="w-full mt-2 rounded-xl py-3 text-sm font-semibold shadow-md bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"
              >
                Chat with Teacher
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;