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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";


const CourseDetailsPage = () => {
  const { id } = useParams();
  console.log(id);

  const { data: userData, isLoading: useLoading, error: useError } = useUserQuery(id);
  const { data, isLoading, error } = useGetCoursesById(id);
  const { data: resultsGategories, isLoading: loadingGategories, error: errorGategories } = useGetGategories()
  const { data: reviewsData, isLoading: loadingReviews, error: errorReviews } = useGetCourseReview(id);
  const [openPopover, setOpenPopover] = useState(false);

  const navigate = useNavigate()
  const isLoggedIn = !!userData;
  const course = data?.data;
  const categoryName = resultsGategories?.data?.find(cat => cat._id === course?.categoryId)?.name || "Category";
  const totalVideos = course?.lessons.reduce((total, lesson) => total + lesson.videos.length, 0) || 0;
  const totalMaterials = course?.lessons.reduce((total, lesson) => total + lesson.materials.length, 0) || 0;
  console.log(totalVideos);
  console.log(totalMaterials);
  console.log("data", data, "resultsGategories", resultsGategories);
  console.log("ID:", id);
  console.log("reviewsData:", reviewsData);
  console.log("loadingReviews:", loadingReviews);
  console.log("errorReviews:", errorReviews);

  const handleEnroll = () => {
    if (!isLoggedIn) {
      console.log("User not logged in. Redirecting to login page...");
      setOpenPopover(true); // 
      return;
     
    }

    // continue enroll logic
    console.log("Enroll user...");
  }

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

      <div className="bg-[#F1F3FF] px-5 py-5 md:py-20 grid grid-cols-1 md:grid-cols-3 gap-5 rounded-lg">
        <div className="col-span-2">

          <div className="col-span-2 flex flex-col gap-4">
            <Badge variant='lightPruple'>{categoryName}</Badge>
            <p className="text-[#141B2B] text-5xl font-extrabold">{course.title}</p>
            <p className="text-[#363642] font-medium text-xs">Created At :
              <span className="text-[#464555] font-light text-xs">
                {course.createdAt}
              </span>
            </p>
            <p className="text-md text-[#464555]">{course.description}</p>
            <div className="flex gap-3 items-center">

              <div className='flex items-center gap-1 text-sm font-medium text-gray-700'>
                <FaStar color='#3525CD' />
                {course.totalReviews}
                <span className="text-[#141B2B] font-normal">({course.totalReviews})Reviews</span>
              </div>

              <div className='flex items-center gap-1 text-sm font-medium text-gray-700'>
                <IoMdPeople color='#3525CD' />
                {course.totalStudents}
                <span className="text-[#141B2B] font-normal">({course.totalStudents})Students</span>
              </div>

              <div className='flex items-center gap-1 text-sm font-medium text-gray-700'>
                <IoPricetags color='#3525CD' />
                {course.type}
                <span className="text-[#141B2B] font-normal"></span>
              </div>

            </div>
          </div>

        </div>

        <div className="col-span-1">
          <img
            src={course.thumbnail}
            alt="Course Thumbnail"
            className="w-full h-auto object-cover rounded-lg transform rotate-3 shadow-2xl shadow-gray-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
        <div className="col-span-1 md:col-span-2 flex flex-col gap-5">

          <div>
            <h2 className="text-2xl font-bold text-[#141B2B] mb-4
              relative before:content-[''] before:absolute before:w-2 before:h-7 before:bg-[#3525CD] before:rounded-full before:left-0 before:top-1/2 before:-translate-y-1/2 pl-4">
              What you'll learn
            </h2>
            <ul type='square' className="list-disc list-inside text-[#464555] text-md">
              {course.whatYouWillLearn.map((outcome, index) => (
                <li key={index} className="font-light ">{outcome}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col md:flex-row gap-3">

            <div className=" mt-5 bg-gray-200 rounded-md px-3 py-4 w-64">
              <MdOutlineVerified color='#3525CD' size={20} />
              <p className="text-[#141B2B] font-semibold">Certified </p>
              <p className="text-[#464555]">Industry recognized certificate</p>
            </div>

            <div className=" mt-5 bg-gray-200 rounded-md px-3 py-4 w-64">
              <IoInfinite color='#3525CD' size={20} />
              <p className="text-[#141B2B] font-semibold">Lifetime Access </p>
              <p className="text-[#464555]">Learn at your own pace</p>
            </div>

            {/* <div className=" mt-5 bg-gray-200 rounded-md px-3 py-4  w-64">
              <MdOutlineVerified color='#3525CD' size={20}/>
              <p className="text-[#141B2B] font-semibold">Certified </p>
              <p className="text-[#464555]">Industry recognized certificate</p>
            </div> */}

          </div>

          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-[#141B2B] mb-4
              relative before:content-[''] before:absolute before:w-2 before:h-7 before:bg-[#3525CD] before:rounded-full before:left-0 before:top-1/2 before:-translate-y-1/2 pl-4">
              Course Lessons
            </h2>

            <div className="bg-[#F1F3FF] rounded-xl">
              {course.lessons.map((lesson, index) => (
                <div key={index} className="flex items-center gap-3 p-4 ">
                  <div className="bg-[#4F46E5] text-white rounded-full p-1 font-semibold">0{lesson.orderIndex}</div>
                  <div className="flex flex-col">
                    <p className="text-[#141B2B] font-medium">{lesson.title}</p>
                    <p className="text-[#464555] text-xs  ">{lesson.videos.length} Videos</p>
                  </div>

                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-[#141B2B]
              relative before:content-[''] before:absolute before:w-2 before:h-7 before:bg-[#3525CD] before:rounded-full before:left-0 before:top-1/2 before:-translate-y-1/2 pl-4">
                  Student Reviews
                </h2>
                <p className="text-[#464555] text-md">What our global community says</p>
              </div>


              <div className="flex flex-col gap-2">
                <p>{course.averageRating}/{course.totalReviews}</p>
                {course.totalMaterials > 0 ? (
                  <div className='flex items-center gap-1 text-sm font-medium text-gray-700'>
                    <FaStar color='#3525CD' />
                    {course.totalMaterials}
                  </div>
                ) : (
                  <div className='flex items-center gap-1 text-sm font-medium text-gray-700'>
                    <MdOutlineStarBorder color='#3525CD' />
                  </div>
                )}


              </div>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviewsData?.data?.map((review, index) => (
                <div key={index} className="bg-gray-200 rounded-md p-3">
                  <div className="flex gap-2 justify-between items-start w-full">
                    <div className="flex items-center items-start gap-2">
                      <div className="w-12 h-12 bg-gray-500 rounded-full p-3">
                        {review.studentId?.avatar ? (
                          <img src={review.studentId.avatar} alt={review.studentId.name} className="w-12 h-12 rounded-full" />
                        ) : (
                          <span className="text-gray-200">
                            {`${review.studentId.firstName?.[0] || ""}${review.studentId.lastName?.[0] || ""}`}
                          </span>
                        )}

                      </div>
                      <p className="font-semibold">{review.studentId?.firstName + " " + review.studentId?.lastName}</p>
                    </div>


                    <div>
                    </div>
                    <div className='flex items-center gap-1 text-sm font-medium text-gray-700 mt-2'>
                      {review.rating}
                      <FaStar color='#3525CD' />
                    </div>
                  </div>
                  <p className="text-[#464555] text-sm italic">"{review.comment}"</p>

                </div>
              ))}
            </div>

          </div>



        </div>

        <div className="col-span-1 flex flex-col gap-4">
          <div className="bg-gray-200 py-4 px-6 rounded-xl flex flex-col gap-4">
            {course.type === 'paid' ? (
              <h1 className="text-[#141B2B] font-semibold text-4xl">${course.price}</h1>
            ) : (
              <h1 className="text-[#141B2B] font-semibold text-4xl">Free</h1>
            )}
            <p>{course.updatedAt}</p>

            <Popover open={openPopover} onOpenChange={setOpenPopover}>
              <PopoverTrigger asChild>
                <Button variant="success" onClick={handleEnroll}>
                  <MdOutlineAddShoppingCart color='white' />
                  Enroll Now
                </Button>
              </PopoverTrigger>

              <PopoverContent>
                <p>Please log in to enroll in this course.</p>

                <Button
                  variant="purpleBtnDefault"
                  className="mt-2 w-full"
                  onClick={() => navigate("/login")}
                >
                  Go to Login
                </Button>
              </PopoverContent>
            </Popover>

            <Button variant="secondary" className='text-[#3525CD]'>
              Try Free Preview
            </Button>

            <hr />

            <div>
              <p className="text-[#141B2B] font-semibold text-lg ">This course includes:</p>
              <ul className="list-none list-inside text-[#464555] text-sm gap-2 flex flex-col mt-2">
                <li className="flex gap-2"> <MdPlayLesson color="#3525CD" /> {course.lessons.length} Lessons</li>
                <li className="flex gap-2"> <MdOndemandVideo color="#3525CD" /> {totalVideos} Videos</li>
                <li className="flex gap-2"> <IoFileTrayFullSharp color="#3525CD" /> {totalMaterials} Materials</li>

              </ul>
            </div>

          </div>

          <div className="bg-gray-200 py-4 px-6 rounded-xl flex flex-col gap-4">
            <h1 className="text-[#141B2B] font-bold text-md">Meet Your Instructor</h1>

            <div className="flex gap-2 items-start">
              <div className="w-12 h-12 bg-gray-500 rounded-full p-3">
                {course.teacherId?.avatar ? (
                  <img src={course.teacherId.avatar} alt={course.teacherId.name} className="w-12 h-12 rounded-full" />
                ) : (
                  <span className="text-gray-200">
                    {`${course.teacherId.firstName?.[0] || ""}${course.teacherId.lastName?.[0] || ""}`}
                  </span>
                )}
              </div>
              <div>
                <p className="font-semibold">{course.teacherId?.firstName + " " + course.teacherId?.lastName}</p>
                <p className="text-sm text-[#464555]">{course.teacherId?.email}</p>
              </div>
            </div>

            <div className="flex flex-col gap-1 items-center justify-center ">
              <p className="text-[#464555] text-xs">{course.teacherId?.bio}</p>
              <div className="w-full flex flex-col md:flex-row gap-3 ">
                <Button variant="secondary" className='rounded-md text-[#3525CD] flex-1 py-2'>
                  Book Appointment
                </Button>
                <Button variant="outline" className='rounded-md text-[#464555] flex-1 py-2'
                // onClick={()=>{navigate('./')}}
                >
                  Profile
                </Button>
              </div>
            </div>



          </div>
        </div>



      </div>
    </div >
  );
};

export default CourseDetailsPage;