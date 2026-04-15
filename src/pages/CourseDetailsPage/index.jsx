import { Badge } from "@/components/ui/badge";
import Loader from "@/components/ui/loader";
import { useGetGategories } from "@/queries/categoryQueries";
import { useGetCoursesById } from "@/queries/useCourses";
import { FaStar } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdPeople } from "react-icons/io";
import { IoPricetags, IoInfinite, IoFileTrayFullSharp } from "react-icons/io5";
import { MdPlayLesson, MdOutlineStarBorder } from "react-icons/md";
import { MdOutlineAddShoppingCart, MdOutlineVerified, MdOndemandVideo } from "react-icons/md";
import { Button } from "../../components/ui/button";
import { useGetCourseReview } from "@/queries/useReviewQueries";
import { useUserQuery } from "@/queries/authQueries";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAddToCart } from "@/mutations/cartMutations";
import { toast } from "sonner";
import { useEnrollmentDetailsQuery } from "@/queries/enrollmentQueries";


const CourseDetailsPage = () => {
  const { id } = useParams();
  const [errors, setErrors] = useState()
  const [openPopover, setOpenPopover] = useState(false);

  const { data: userData, isLoading: useLoading, error: useError } = useUserQuery(id);
  const { data, isLoading, error } = useGetCoursesById(id);
  const { data: resultsGategories, isLoading: loadingGategories, error: errorGategories } = useGetGategories();
  const { data: reviewsData, isLoading: loadingReviews, error: errorReviews } = useGetCourseReview(id);
  const { data: enrollmentData, isLoading: loadingEnrollment, error: errorEnrollment } = useEnrollmentDetailsQuery(id)
  const addToCartMutation = useAddToCart();

  const navigate = useNavigate();
  const isLoggedIn = !!userData;
  const course = data?.data;
  const categoryName = resultsGategories?.data?.find(cat => cat._id === course?.categoryId)?.name || "Category";
  const totalVideos = course?.lessons.reduce((total, lesson) => total + lesson.videos.length, 0) || 0;
  const totalMaterials = course?.lessons.reduce((total, lesson) => total + lesson.materials.length, 0) || 0;
  console.log('====================================');
  console.log(course);
  console.log('====================================');


  // const addToCartAction= ()=>{}
  const addToCartAction = (data) => {
    addToCartMutation.mutate(
      {
        courseId: data.courseId
      },

      {
        onSuccess: () => {
          toast.success('Course Added Successfully')
          navigate('/cart');
        },
        onError: (err) => {
          const message = err.response?.data.message || "Failed to add course";
          setErrors((prev) => ({ ...prev, api: message }));
          toast.error(message); // add this
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
        addToCartAction({ courseId: course._id })
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

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-6">

      {/* Hero Banner */}
      <div className="bg-[#eef2ff] px-5 py-5 md:py-20 grid grid-cols-1 md:grid-cols-3 gap-5 rounded-lg">
        <div className="col-span-2 flex flex-col gap-4">
          <Badge variant="lightPurple">{categoryName}</Badge>
          <p className="text-[#1e1b4b] text-5xl font-extrabold">{course.title}</p>
          <p className="text-[#4338ca] font-medium text-xs">
            Course Requirments: &nbsp;
            {course.requirements.map((req) => {
              return <span className="text-[#464555] font-light text-xs">{req}</span>
            })}
          </p>
          <p className="text-md text-[#464555]">{course.description}</p>

          <div className="flex gap-3 items-center">
            <div className="flex items-center gap-1 text-sm font-medium text-[#4338ca]">
              <FaStar color="#4f46e5" />
              {course.totalReviews}
              <span className="text-[#1e1b4b] font-normal">({course.totalReviews}) Reviews</span>
            </div>

            <div className="flex items-center gap-1 text-sm font-medium text-[#4338ca]">
              <IoMdPeople color="#4f46e5" />
              {course.totalStudents}
              <span className="text-[#1e1b4b] font-normal">({course.totalStudents}) Students</span>
            </div>

            <div className="flex items-center gap-1 text-sm font-medium text-[#4338ca]">
              <IoPricetags color="#4f46e5" />
              {course.type}
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <img
            src={course.thumbnail}
            alt="Course Thumbnail"
            className="w-full h-auto object-cover rounded-lg transform rotate-3 shadow-2xl shadow-indigo-300"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">

        {/* Left Column */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-5">

          {/* What you'll learn */}
          <div>
            <h2 className="text-2xl font-bold text-[#1e1b4b] mb-4
              relative before:content-[''] before:absolute before:w-2 before:h-7 before:bg-[#4f46e5] before:rounded-full before:left-0 before:top-1/2 before:-translate-y-1/2 pl-4">
              What you'll learn
            </h2>
            <ul className="list-disc list-inside text-[#464555] text-sm">
              {course.whatYouWillLearn.map((outcome, index) => (
                <li key={index} className="font-light">{outcome}</li>
              ))}
            </ul>
          </div>

          {/* Feature cards */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="mt-5 bg-[#f4f4f4] rounded-md px-3 py-4 w-64">
              <MdOutlineVerified color="#4f46e5" size={20} />
              <p className="text-[#1e1b4b] font-semibold">Certified</p>
              <p className="text-[#4338ca]">Industry recognized certificate</p>
            </div>
            <div className="mt-5 bg-[#f4f4f4] rounded-md px-3 py-4 w-64">
              <IoInfinite color="#4f46e5" size={20} />
              <p className="text-[#1e1b4b] font-semibold">Lifetime Access</p>
              <p className="text-[#4338ca]">Learn at your own pace</p>
            </div>
          </div>

          {/* Course Lessons */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-[#1e1b4b] mb-4
              relative before:content-[''] before:absolute before:w-2 before:h-7 before:bg-[#4f46e5] before:rounded-full before:left-0 before:top-1/2 before:-translate-y-1/2 pl-4">
              Course Lessons
            </h2>
            <div className="bg-[#eef2ff] rounded-xl">
              {(course.lessons) ? (<p className="col-span-2 text-center text-red-500 text-sm bg-white">No Lessons Provided Yet</p>) : (course.lessons.map((lesson, index) => (
                <div key={index} className="flex items-center gap-3 p-4">
                  <div className="bg-[#4f46e5] text-white rounded-full p-1 font-semibold">
                    0{lesson.orderIndex}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[#1e1b4b] font-medium">{lesson.title}</p>
                    <p className="text-[#4338ca] text-xs">{lesson.videos.length} Videos</p>
                  </div>
                </div>
              )))}
            </div>
          </div>

          {/* Student Reviews */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-[#1e1b4b]
                  relative before:content-[''] before:absolute before:w-2 before:h-7 before:bg-[#4f46e5] before:rounded-full before:left-0 before:top-1/2 before:-translate-y-1/2 pl-4">
                  Student Reviews
                </h2>
                <p className="text-[#4338ca] text-md">What our global community says</p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-[#1e1b4b]">{course.averageRating}/{course.totalReviews}</p>
                {course.totalMaterials > 0 ? (
                  <div className="flex items-center gap-1 text-sm font-medium text-[#4338ca]">
                    <FaStar color="#4f46e5" />
                    {course.totalMaterials}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-sm font-medium text-[#4338ca]">
                    <MdOutlineStarBorder color="#4f46e5" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(reviewsData?.data) ? (<p className="col-span-2 text-center text-red-500 text-sm ">No Review Provided</p>) : (reviewsData?.data?.map((review, index) => (
                <div key={index} className="bg-[#f4f4f4] rounded-md p-3">
                  <div className="flex gap-2 justify-between items-start w-full">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 bg-[#cccccc] rounded-full flex items-center justify-center">
                        {review.studentId?.avatar ? (
                          <img src={review.studentId.avatar} alt={review.studentId.name} className="w-12 h-12 rounded-full" />
                        ) : (
                          <span className="text-white text-sm font-medium">
                            {`${review.studentId.firstName?.[0] || ""}${review.studentId.lastName?.[0] || ""}`}
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-[#1e1b4b]">
                        {review.studentId?.firstName + " " + review.studentId?.lastName}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-[#4338ca] mt-2">
                      {review.rating}
                      <FaStar color="#4f46e5" />
                    </div>
                  </div>
                  <p className="text-[#4338ca] text-sm italic">"{review.comment}"</p>
                </div>
              )))}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="col-span-1 flex flex-col gap-4">

          {/* Enroll Card */}
          <div className="bg-[#f4f4f4] py-4 px-6 rounded-xl flex flex-col gap-4">
            {enrollmentData ?
              <p>You Already Enrolled In This Course</p> :
              (
                <>
                  {course.type === "paid" ? (
                    <h1 className="text-[#1e1b4b] font-semibold text-4xl">${course.price}</h1>
                  ) : (
                    <h1 className="text-[#1e1b4b] font-semibold text-4xl">Free</h1>
                  )}
                  <p className="text-[#4338ca]">{course.updatedAt}</p>

                  <Button variant="success" onClick={handleEnroll}>
                    <MdOutlineAddShoppingCart color="white" />
                    Enroll Now
                  </Button>

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

                  <Button variant="secondary" className="text-[#4f46e5]">
                    Try Free Preview
                  </Button>
                </>
              )
            }


            <hr className="border-[#c7d2fe]" />

            <div>
              <p className="text-[#1e1b4b] font-semibold text-lg">This course includes:</p>
              <ul className="list-none list-inside text-[#4338ca] text-sm gap-2 flex flex-col mt-2">
                <li className="flex gap-2"><MdPlayLesson color="#4f46e5" /> {course.lessons.length} Lessons</li>
                <li className="flex gap-2"><MdOndemandVideo color="#4f46e5" /> {totalVideos} Videos</li>
                <li className="flex gap-2"><IoFileTrayFullSharp color="#4f46e5" /> {totalMaterials} Materials</li>
              </ul>
            </div>
          </div>

          {/* Instructor Card */}
          <div className="bg-[#f4f4f4] py-4 px-6 rounded-xl flex flex-col gap-4">
            <h1 className="text-[#1e1b4b] font-bold text-md">Meet Your Instructor</h1>

            <div className="flex gap-2 items-start">
              <div className="w-12 h-12 bg-[#4f46e5] rounded-full flex items-center justify-center">
                {course.teacherId?.avatar ? (
                  <img src={course.teacherId.avatar} alt={course.teacherId.name} className="w-12 h-12 rounded-full" />
                ) : (
                  <span className="text-white text-sm font-medium">
                    {`${course.teacherId.firstName?.[0] || ""}${course.teacherId.lastName?.[0] || ""}`}
                  </span>
                )}
              </div>
              <div>
                <p className="font-semibold text-[#1e1b4b]">
                  {course.teacherId?.firstName + " " + course.teacherId?.lastName}
                </p>
                <p className="text-sm text-[#4338ca]">{course.teacherId?.email}</p>
              </div>
            </div>

            <div className="flex flex-col gap-1 items-center justify-center">
              <p className="text-[#4338ca] text-xs">{course.teacherId?.bio}</p>
              <div className="w-full flex flex-col md:flex-row gap-3">
                <Button variant="secondary" className="rounded-md text-[#4f46e5] flex-1 py-2">
                  Book Appointment
                </Button>
                <Button variant="outline" className="rounded-md text-[#4338ca] flex-1 py-2">
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