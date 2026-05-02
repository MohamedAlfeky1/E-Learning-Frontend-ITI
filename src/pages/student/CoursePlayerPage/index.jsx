import Loader from "@/components/ui/loader";
import { useGetCoursesById } from "@/queries/useCourses";
import { useGetAllLessonsByCourse } from "@/queries/useLessonQueries";
import { useParams, useNavigate } from "react-router-dom";
import { IoPlay } from "react-icons/io5";
import { MdLockOutline } from "react-icons/md";
import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils"
import { Button } from "../../../components/ui/button";
import { IoMdCheckmark } from "react-icons/io";
import { CiCalendar } from "react-icons/ci";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FiDownload, FiFileText } from "react-icons/fi";
import { MdBarChart } from "react-icons/md";
import { useEnrollmentDetailsQuery, useMyCoursesQuery, useUpdateProgressMutation } from "@/queries/enrollmentQueries";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useAddReview, useDeleteReview } from "@/mutations/useReviewMutations";
import { useFormik } from "formik";
import { RATING_RANGE } from "@/data/reviewData";
import { useGetMyCourseReview } from "@/queries/useReviewQueries";
import { useUserQuery } from "@/queries/authQueries";
import { FaStar } from "react-icons/fa";
import { MessageSquare } from "lucide-react";
import { FaDeleteLeft } from "react-icons/fa6";
import VideoChatWidget from "./components/VideoChatWidget";

const CoursePlayerPage = () => {

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videosProgress, setVideosProgress] = useState({});
  const [reviewError, setReviewError] = useState({ review: "", api: "" });
  const [courseProgress, setCourseProgress] = useState(0);

  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data: studentData } = useUserQuery();
  const studentId = studentData?._id;
  const { data: course, isLoading, error } = useGetCoursesById(courseId);
  const { data: lessons, isLoading: lessonsLoading, error: lessonsError } = useGetAllLessonsByCourse(courseId);
  const { data: enrollments } = useMyCoursesQuery();
  const { data: reviewsData, isLoading: loadingReviews, error: errorReviews } = useGetMyCourseReview(courseId, studentId);
  const { data: enrollmentsDetails } = useEnrollmentDetailsQuery(courseId);
  const { mutate: updateProgress } = useUpdateProgressMutation();
  const deleteReviewMutation = useDeleteReview()
  const addReviewMutation = useAddReview();
  const enrollmentId = enrollmentsDetails?._id;
  const myReview = reviewsData?.data;
  const hasReview = myReview?.length > 0;

  const teacherObj = course?.data?.teacherId || course?.data?.createdBy;
  const teacherId = teacherObj?._id || teacherObj;
  const teacherName = teacherObj?.firstName ? `${teacherObj.firstName} ${teacherObj.lastName || ''}`.trim() : "Teacher";

  const handleSubmitReview = (formData) => {
    addReviewMutation.mutate(
      {
        courseId,
        rating: formData.rating,
        comment: formData.comment
      },

    );
  };

  const handleDeleteReview = (reviewId) => {
    deleteReviewMutation.mutate(
      reviewId,
      {
        onError: (err) => {
          setReviewError((prev) => ({
            ...prev,
            api: err.response?.data.message || "Invalid data",
          }));
        },
      }
    );
  };

  let formik = useFormik({
    initialValues: { comment: '', rating: '' },
    onSubmit: handleSubmitReview,
  });

  const completedVideoIds = enrollmentsDetails?.completedVideos?.map(v => v.videoId) ?? [];
  const allVideos = lessons?.data?.flatMap(lesson =>
    lesson.videos.map(video => ({ ...video, lesson }))
  ) ?? [];

  const isVideoAccessible = (videoId) => {
    if (completedVideoIds.includes(videoId)) return true;
    const firstUncompleted = allVideos.find(v => !completedVideoIds.includes(v._id));
    return firstUncompleted?._id === videoId;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const handleProgressUpdate = (enrollmentId, videoId) => {
    updateProgress(
      { enrollmentId, videoId },
      {
        onSuccess: (data) => {
          setCourseProgress(data.progress);
        },
      }
    );
  };

  useEffect(() => {
    if (lessons?.data?.length > 0) {
      const firstVideo = lessons?.data[0]?.videos?.[0];
      if (firstVideo) {
        setSelectedVideo({ ...firstVideo, lesson: lessons?.data[0] });
      }
    }
  }, [lessons]);

  useEffect(() => {
    if (enrollmentsDetails?.progress !== undefined) {
      setCourseProgress(enrollmentsDetails.progress);
    }
  }, [enrollmentsDetails]);

  if (lessonsLoading && isLoading) return (
    <div className="min-h-full min-w-full flex justify-center items-center"><Loader /></div>
  );
  if (lessonsError) return <div>Error loading lessons: {lessonsError.message}</div>;
  if (error) return <div>Error loading course: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">

      {/* ── Left / main column ── */}
      <div className="col-span-1 md:col-span-2">

        <div className="flex flex-col gap-2">
          <p className="text-[var(--muted-foreground)] text-xs font-medium">
            {course?.data?.title} &gt; Lesson {lessons?.data[0]?.orderIndex} &gt;{" "}
            <span className="text-[var(--primary)]">
              {selectedVideo?.lesson?.orderIndex}.{selectedVideo?.orderIndex} {selectedVideo?.title}
            </span>
          </p>

          <div className="w-full h-[300px] bg-black rounded-lg flex items-center justify-center">
            {selectedVideo?.url ? (
              <video
                key={selectedVideo._id}
                src={selectedVideo.url}
                controls
                className="w-full h-full rounded-lg"
              />
            ) : (
              <p className="text-white text-sm">Video not found</p>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2  justify-between items-center md:items-start mt-4">
          <h2 className="font-bold text-2xl text-[var(--foreground)]">
            {selectedVideo?.lesson?.orderIndex}.{selectedVideo?.orderIndex} {selectedVideo?.title}
          </h2>
          <div className="flex flex-row md:flex-col justify-center items-center gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
              onClick={() => navigate('/chats', { state: { courseId, teacherId, teacherName } })}
            >
              <MessageSquare className="w-4 h-4" /> Chat with Teacher
            </Button>
            <Button onClick={() => handleProgressUpdate(enrollmentId, selectedVideo?._id)}>
              <IoMdCheckmark color="white" /> Record progress
            </Button>
          </div>
        </div>

        <p className="flex items-center gap-1 text-xs text-[var(--muted-foreground)] mt-2">
          <CiCalendar />
          Updated {selectedVideo?.lesson?.updatedAt && formatDate(selectedVideo?.lesson?.updatedAt)}
        </p>

        <div>
          <Tabs defaultValue="overview" className="mt-4">
            <TabsList
              variant="line"
              className="border-b w-full justify-start text-[var(--primary)]"
            >
              <TabsTrigger
                value="overview"
                className="data-active:text-[var(--primary)] data-active:after:bg-[var(--primary)]"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="data-active:text-[var(--primary)] data-active:after:bg-[var(--primary)]"
              >
                Course Material
              </TabsTrigger>
              <TabsTrigger
                value="quizes"
                className="data-active:text-[var(--primary)] data-active:after:bg-[var(--primary)]"
              >
                Course Comments
              </TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="mt-4 flex flex-col gap-3">
              <p className="text-sm font-normal text-[var(--muted-foreground)]">
                {course?.data?.description}
              </p>

              <h2 className="font-bold text-lg text-[var(--foreground)]">What You Will Learn:</h2>

              {course?.data?.whatYouWillLearn?.length > 0 && (
                <ol className="space-y-3">
                  {course?.data?.whatYouWillLearn?.map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <span className="w-7 h-7 flex items-center justify-center rounded-full bg-green-500 text-white text-xs font-bold">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm text-[var(--foreground)]">{item}</span>
                    </li>
                  ))}
                </ol>
              )}
            </TabsContent>

            {/* Course Material */}
            <TabsContent value="notes" className="mt-4">
              <div className="flex flex-col gap-3">
                {selectedVideo?.materials?.length > 0 ? (
                  selectedVideo.materials.map((file) => (
                    <div
                      key={file._id}
                      className="flex items-center justify-between p-3 border border-[var(--border)] rounded-lg hover:bg-[var(--secondary)] transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-lg">
                          <FiFileText />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-[var(--foreground)]">{file.title}</h3>
                          <p className="text-xs text-[var(--muted-foreground)]">PDF Document</p>
                        </div>
                      </div>
                      <a href={file.url} download className="text-[var(--muted-foreground)] hover:text-green-600">
                        <FiDownload size={18} />
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[var(--muted-foreground)]">No materials available</p>
                )}
              </div>
            </TabsContent>

            {/* Reviews / Comments */}
            <TabsContent value="quizes" className="mt-4 flex flex-col gap-3">
              <h2 className="text-lg font-semibold mb-3 text-[var(--foreground)]">My Reviews</h2>

              <div className="flex flex-col gap-3">
                {myReview?.map((item) => (
                  <div
                    key={item._id}
                    className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 shadow-sm hover:shadow-md transition"
                  >

                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <Button
                          type='button'
                          onClick={() => { handleDeleteReview(item._id) }}
                          className="group px-2 py-1 rounded-xl bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-300 transition-all duration-200 cursor-pointer"
                        >
                          <FaDeleteLeft className="text-red-400 group-hover:text-red-600 w-4 h-4 transition-colors duration-200" />
                        </Button>

                        <p className="text-sm text-black leading-relaxed">
                          {item.comment}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                        {item.rating}
                        <FaStar />
                      </div>
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)] mt-2">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>

              <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
                <Input
                  variant="white"
                  className="text-[var(--foreground)] border border-[var(--border)] bg-[var(--card)]"
                  placeholder={`${hasReview?'You Already Reviewd This Course':'Add Your Comment'}`}
                  name="comment"
                  disabled={hasReview}
                  value={formik.values.comment}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <label htmlFor="rating" className="text-sm text-[var(--foreground)]">Rate This Course:</label>
                <select
                  id="rating"
                  name="rating"
                  disabled={hasReview}
                  value={formik.values.rating}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] rounded-md px-4 py-2 text-sm"
                >
                  <option value="">Select rating</option>
                  {RATING_RANGE.map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>

                <p className="text-red-500">{reviewError.api || reviewError.review}</p>
                <Button variant="purpleBtnXl" disabled={hasReview}>Submit</Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* ── Right / sidebar column ── */}
      <div className="col-span-1 flex flex-col gap-4">

        {/* Progress card */}
        <div className="bg-[var(--secondary)] p-5 rounded-md flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-sm text-[var(--foreground)]">Course Progress</h2>
            <Badge variant="lightPruple">{courseProgress}% DONE</Badge>
          </div>
          <Progress value={courseProgress} className="w-full mt-2 bg-[var(--muted)]" />
        </div>

        {/* Course content accordion */}
        <div className="bg-[var(--card)] shadow shadow-[var(--border)] py-3 rounded-md">
          <div className="flex justify-between items-center pb-3 px-3">
            <h2 className="font-semibold text-sm text-[var(--foreground)]">Course Content</h2>
            <h3 className="text-[var(--primary)] font-semibold text-xs cursor-pointer">Expand All</h3>
          </div>
          <hr className="w-full border-[var(--border)]" />

          <Accordion type="single" collapsible className="w-full">
            {lessons?.data?.map((lesson) => (
              <AccordionItem key={lesson._id} value={lesson._id}>

                <AccordionTrigger
                  className={cn(
                    "!flex !flex-row !items-center !justify-between !rounded w-full gap-2 py-2 px-3",
                    "data-[state=open]:bg-[var(--secondary)]/50 data-[state=open]:pl-4",
                    "relative data-[state=open]:before:content-[''] data-[state=open]:before:absolute data-[state=open]:before:w-1 data-[state=open]:before:h-full data-[state=open]:before:bg-[var(--primary)] data-[state=open]:before:left-0 data-[state=open]:before:top-1/2 data-[state=open]:before:-translate-y-1/2"
                  )}
                >
                  <div className="flex flex-col items-start gap-2 w-full">
                    <h3 className="font-semibold text-xs text-[var(--muted-foreground)] data-[state=open]:text-[var(--primary)]">
                      Lesson 0{lesson.orderIndex}
                    </h3>
                    <div className="flex justify-between items-center w-full pe-2">
                      <h2 className="font-semibold text-sm text-[var(--foreground)] data-[state=open]:text-[var(--primary)]">
                        {lesson.title}
                      </h2>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="flex flex-col">
                    {lesson.videos?.map((video) => {
                      const accessible = isVideoAccessible(video._id);
                      const isCompleted = completedVideoIds.includes(video._id);
                      return (
                        <div
                          onClick={() => {
                            if (!accessible) return;
                            setSelectedVideo({ ...video, lesson });
                          }}
                          key={video._id}
                          className={cn(
                            "text-sm p-2 cursor-pointer hover:bg-[var(--secondary)] transition",
                            selectedVideo?._id === video._id
                              ? "bg-[var(--primary)]/10 relative after:content-[''] after:absolute after:w-1 after:h-full after:bg-[var(--primary)]/40 after:right-0 after:top-1/2 after:-translate-y-1/2 pl-4"
                              : "bg-[var(--card)]",
                            !accessible && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <div className="flex justify-between items-center">
                            <h2 className="text-sm font-semibold text-[var(--foreground)]">
                              {video.orderIndex} {video.title}
                            </h2>
                            {isCompleted ? (
                              <IoMdCheckmark className="text-green-500" />
                            ) : selectedVideo?._id === video._id ? (
                              <MdBarChart className="text-[var(--muted-foreground)]" />
                            ) : accessible ? (
                              <IoPlay className="text-[var(--muted-foreground)]" />
                            ) : (
                              <MdLockOutline className="text-[var(--muted-foreground)]" />
                            )}
                          </div>
                          <p className="font-light text-xs text-[var(--primary)]/50">
                            {video.duration}
                            {selectedVideo?._id === video._id && (
                              <span className="ms-2">• Watching Now</span>
                            )}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>

              </AccordionItem>
            ))}
          </Accordion>
        </div>

      </div>

      {/* RAG Video Chat Widget */}
      {selectedVideo?.lesson?._id && (
        <VideoChatWidget lessonId={selectedVideo.lesson._id} />
      )}
    </div>
  );
};

export default CoursePlayerPage;