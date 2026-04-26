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
  MdOutlineRemoveShoppingCart,
  MdOutlineVerified,
  MdOndemandVideo,
} from "react-icons/md";
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


const CourseDetailsPage = () => {
  const { id } = useParams();
  const [openPopover, setOpenPopover] = useState(false);
  const [openAppointmentDialog, setOpenAppointmentDialog] = useState(false);


  const { data: userData, isLoading: useLoading, error: useError } = useUserQuery();
  const { data: cartData } = useGetCartItems();
  const { data, isLoading, error } = useGetCoursesById(id);
  const { data: categoriesData, isLoading: loadingCategories, error: errorCategories } = useCategories();
  const { data: reviewsData, isLoading: loadingReviews, error: errorReviews } = useGetCourseReview(id);
  const { data: enrollmentData, isLoading: loadingEnrollment, error: errorEnrollment } = useEnrollmentDetailsQuery(id)

  const addToCartMutation = useAddToCart();

  const userRole = userData?.role
  const isInCart = cartData?.data?.cart?.items?.some(
    (item) => item.courseId === id || item.courseId?._id === id
  );



  console.log("cartData", cartData);
  console.log("isInCart", isInCart);

  console.log("data", data);

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
    addToCartMutation.mutate(
      { courseId: course._id }
      ,
      {
        onSuccess: (data) => {
          toast.success('Course Added To Cart');
          console.log('Course Added To Cart', data);

        },
        onError: (err) => {
          toast.error('Error Add Course To Cart ')
          console.log('Error Add Course To Cart ', err);
        }
      })
  }

  const handleEnroll = () => {
    try {
      if (!isLoggedIn) {
        setOpenPopover(true);
        return;
      }
      else if (course.type == 'paid') {
        handleAddToCart()
      } else if (course.type == 'free') {
        navigate('/my-courses')
      }
    } catch (error) {
      toast.error(error)
    }

  };



  if (isLoading) {
    return (
      <div className="col-span-4 flex justify-center items-center min-h-40">
        <Loader />
      </div>
    );
  }

  if (error) return <div>Error: {error.message}</div>;
  console.log("reviewsData", reviewsData);
  console.log("userData", userData);
  console.log("isLoggedIn", isLoggedIn);

  return (
    <div className="p-6">

      {/* Hero Banner */}
      <div className="bg-[var(--secondary)] px-5 py-5 md:py-20 grid grid-cols-1 md:grid-cols-3 gap-5 rounded-lg">
        <div className="col-span-2">
          <div className="col-span-2 flex flex-col gap-4">
            <Badge variant="lightPruple">{categoryName}</Badge>

            <p className="text-[var(--foreground)] text-5xl font-extrabold">
              {course.title}
            </p>

            {course.createdAt && (
              <p className="text-[var(--foreground)] font-medium text-xs">
                Created At:{" "}
                <span className="text-[var(--muted-foreground)] font-light text-xs">
                  {new Date(course.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </p>
            )}

            <p className="text-md text-[var(--muted-foreground)] break-words">
              {course.description}
            </p>

            <div className="flex gap-3 items-center">
              <div className="flex items-center gap-1 text-sm font-medium text-[var(--foreground)]">
                <FaStar color="var(--primary)" />
                {course.totalReviews}
                <span className="text-[var(--foreground)] font-normal">
                  ({course.totalReviews}) Reviews
                </span>
              </div>

              <div className="flex items-center gap-1 text-sm font-medium text-[var(--foreground)]">
                <IoMdPeople color="var(--primary)" />
                {course.totalStudents}
                <span className="text-[var(--foreground)] font-normal">
                  ({course.totalStudents}) Students
                </span>
              </div>

              <div className="flex items-center gap-1 text-sm font-medium text-[var(--foreground)]">
                <IoPricetags color="var(--primary)" />
                {course.type}
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt="Course Thumbnail"
              className="w-full h-auto object-cover rounded-lg transform rotate-3 shadow-2xl shadow-[var(--primary)]/20"
            />
          ) : (
            <div className="w-full h-48 bg-[var(--primary)] rounded-lg transform rotate-3 shadow-2xl shadow-[var(--primary)]/30 flex flex-col items-center justify-center gap-2">
              <MdOndemandVideo size={40} color="white" />
              <p className="text-[var(--primary-foreground)] text-sm font-medium">{course.title}</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
        {/* Left Column */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-5">

          {/* What you'll learn */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4
              relative before:content-[''] before:absolute before:w-2 before:h-7 before:bg-[var(--primary)] before:rounded-full before:left-0 before:top-1/2 before:-translate-y-1/2 pl-4">
              What you'll learn
            </h2>
            <ul className="list-disc list-inside text-[var(--muted-foreground)] text-md">
              {course.whatYouWillLearn.map((outcome, index) => (
                <li key={index} className="font-light">{outcome}</li>
              ))}
            </ul>
          </div>

          {/* Feature cards */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="mt-5 bg-[var(--secondary)] rounded-md px-3 py-4 w-64">
              <MdOutlineVerified color="var(--primary)" size={20} />
              <p className="text-[var(--foreground)] font-semibold">Certified</p>
              <p className="text-[var(--muted-foreground)]">Industry recognized certificate</p>
            </div>

            <div className="mt-5 bg-[var(--secondary)] rounded-md px-3 py-4 w-64">
              <IoInfinite color="var(--primary)" size={20} />
              <p className="text-[var(--foreground)] font-semibold">Lifetime Access</p>
              <p className="text-[var(--muted-foreground)]">Learn at your own pace</p>
            </div>
          </div>

          {/* Course Lessons */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4
              relative before:content-[''] before:absolute before:w-2 before:h-7 before:bg-[var(--primary)] before:rounded-full before:left-0 before:top-1/2 before:-translate-y-1/2 pl-4">
              Course Lessons
            </h2>

            {course?.lessons?.length > 0 ? (
              <div className="bg-[var(--secondary)] rounded-xl">
                {course.lessons.map((lesson, index) => (
                  <div key={index} className="flex items-center gap-3 p-4">
                    <div className="bg-[var(--primary)] text-[var(--primary-foreground)] rounded-full p-1 font-semibold">
                      0{lesson.orderIndex}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[var(--foreground)] font-medium">{lesson.title}</p>
                      <p className="text-[var(--muted-foreground)] text-xs">{lesson.videos.length} Videos</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="col-span-2 text-center text-red-500 text-sm">No Lessons Provided</p>
            )
            }

          </div>

          {/* Student Reviews */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-[var(--foreground)]
                  relative before:content-[''] before:absolute before:w-2 before:h-7 before:bg-[var(--primary)] before:rounded-full before:left-0 before:top-1/2 before:-translate-y-1/2 pl-4">
                  Student Reviews
                </h2>
                <p className="text-[var(--muted-foreground)] text-md">What our global community says</p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-[var(--foreground)]">
                  {course.averageRating}/{course.totalReviews}
                </p>
                {course.totalMaterials > 0 ? (
                  <div className="flex items-center gap-1 text-sm font-medium text-[var(--foreground)]">
                    <FaStar color="var(--primary)" />
                    {course.totalMaterials}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-sm font-medium text-[var(--foreground)]">
                    <MdOutlineStarBorder color="var(--primary)" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviewsData?.data?.length === 0 ? (
                <p className="col-span-2 text-center text-red-500 text-sm">No Review Provided</p>
              ) : (
                reviewsData?.data?.map((review, index) => (
                  <div key={index} className="bg-[var(--secondary)] rounded-md p-3">
                    <div className="flex gap-2 justify-between items-start w-full">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 bg-[var(--muted)] rounded-full flex items-center justify-center">
                          {review.studentId?.avatar ? (
                            <img
                              src={review.studentId.avatar}
                              alt={review.studentId.name}
                              className="w-12 h-12 rounded-full"
                            />
                          ) : (
                            <span className="text-[var(--foreground)] text-sm font-medium">
                              {`${review.studentId.firstName?.[0] || ""}${review.studentId.lastName?.[0] || ""}`}
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-[var(--foreground)]">
                          {review.studentId?.firstName + " " + review.studentId?.lastName}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium text-[var(--foreground)] mt-2">
                        {review.rating}
                        <FaStar color="var(--primary)" />
                      </div>
                    </div>
                    <p className="text-[var(--muted-foreground)] text-sm italic">"{review.comment}"</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-1 flex flex-col gap-4">

          {/* Enroll card */}
          <div className="bg-[var(--secondary)] py-4 px-6 rounded-xl flex flex-col gap-4">
            {enrollmentData ?
              <p>You Already Enrolled In This Course</p> :
              <>
                {course.type === "paid" ? (
                  <h1 className="text-[var(--foreground)] font-semibold text-4xl">${course.price}</h1>
                ) : (
                  <h1 className="text-[var(--foreground)] font-semibold text-4xl">Free</h1>
                )}

                {course?.updatedAt && (
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Last updated:{" "}
                    {new Date(course.updatedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}

                {userRole === 'student' ? (
                  <Button
                    variant="default"
                    onClick={handleEnroll}
                    disabled={useLoading || isInCart}
                    className={isInCart ? "bg-[var(--muted-foreground)]" : ""}
                  >
                    <MdOutlineAddShoppingCart color="white" />
                    {useLoading ? "Loading..." : isInCart ? "Added to Cart ✓" : "Enroll Now"}
                  </Button>
                ) : ''}


                <Dialog open={openPopover} onOpenChange={setOpenPopover}>
                  <DialogContent showCloseButton={true}>
                    <DialogHeader>
                      <DialogTitle>Login Required</DialogTitle>
                      <DialogDescription>
                        You need to be logged in to enroll in this course.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="purpleBtnDefault"
                        className="w-full"
                        onClick={() => navigate("/login")}
                      >
                        Go to Login
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button variant="secondary" className="text-[var(--primary)]">
                  Try Free Preview
                </Button>
              </>
            }

            <hr className="border-[var(--border)]" />

            <div>
              <p className="text-[var(--foreground)] font-semibold text-lg">This course includes:</p>
              <ul className="list-none list-inside text-[var(--muted-foreground)] text-sm gap-2 flex flex-col mt-2">
                <li className="flex gap-2">
                  <MdPlayLesson color="var(--primary)" /> {course.lessons.length} Lessons
                </li>
                <li className="flex gap-2">
                  <MdOndemandVideo color="var(--primary)" /> {totalVideos} Videos
                </li>
                <li className="flex gap-2">
                  <IoFileTrayFullSharp color="var(--primary)" /> {totalMaterials} Materials
                </li>
              </ul>
            </div>
          </div>

          {/* Instructor card */}
          <div className="bg-[var(--secondary)] py-4 px-6 rounded-xl flex flex-col gap-4">
            <h1 className="text-[var(--foreground)] font-bold text-md">Meet Your Instructor</h1>

            <div className="flex gap-2 items-start">
              <div className="w-12 h-12 bg-[var(--primary)] rounded-full flex items-center justify-center">
                {course.teacherId?.avatar ? (
                  <img
                    src={course.teacherId.avatar}
                    alt={course.teacherId.name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <span className="text-[var(--primary-foreground)] text-sm font-medium">
                    {`${course.teacherId.firstName?.[0] || ""}${course.teacherId.lastName?.[0] || ""}`}
                  </span>
                )}
              </div>
              <div>
                <p className="font-semibold text-[var(--foreground)]">
                  {course.teacherId?.firstName + " " + course.teacherId?.lastName}
                </p>
                <p className="text-sm text-[var(--muted-foreground)]">{course.teacherId?.email}</p>
              </div>
            </div>

            <div className="flex flex-col gap-1 items-center justify-center">
              <p className="text-[var(--muted-foreground)] text-xs">{course.teacherId?.bio}</p>
              <div className="w-full flex flex-col md:flex-row gap-3">

                {userRole === 'student' ?
                  (<Button
                    variant="secondary"
                    className="rounded-md text-[var(--primary)] flex-1 py-2"
                    onClick={() => {
                      if (!isLoggedIn) {
                        setOpenAppointmentDialog(true);
                      } else {
                        navigate(`/teachers/${course.teacherId?._id}/book`);
                      }
                    }}
                  >
                    Book Appointment
                  </Button>
                  ) : ''}

                <Dialog open={openAppointmentDialog} onOpenChange={setOpenAppointmentDialog}>
                  <DialogContent showCloseButton={true}>
                    <DialogHeader>
                      <DialogTitle>Login Required</DialogTitle>
                      <DialogDescription>
                        You need to be logged in to book an appointment.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="purpleBtnDefault"
                        className="w-full"
                        onClick={() => navigate("/login")}
                      >
                        Go to Login
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button onClick={()=>navigate(`/teachers/${course.teacherId?._id}`)} variant="outline" className="rounded-md text-[var(--muted-foreground)] flex-1 py-2">
                  Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;