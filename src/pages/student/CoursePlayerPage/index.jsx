import Loader from "@/components/ui/loader";
import { useGetCoursesById } from "@/queries/useCourses";
import { useGetAllLessonsByCourse } from "@/queries/useLessonQueries";
import { useParams } from "react-router-dom";
import { IoPlay } from "react-icons/io5";
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


const CoursePlayerPage = () => {

  // states
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videosProgress, setVideosProgress] = useState({});


  const { courseId } = useParams();
  const { data: course, isLoading, error } = useGetCoursesById(courseId);
  const { data: lessons, isLoading: lessonsLoading, error: lessonsError } = useGetAllLessonsByCourse(courseId);
  const { data: enrollments } = useMyCoursesQuery();
  const { data: enrollmentsDetails } = useEnrollmentDetailsQuery(courseId);
  const { mutate: updateProgress } = useUpdateProgressMutation();
  const enrollmentId = enrollmentsDetails?._id


  console.log("enrollments", enrollments);
  console.log("enrollmentsDetails", enrollmentsDetails);
  console.log("updateProgress", updateProgress);



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
          setVideosProgress(prev => ({
            ...prev,
            [videoId]: data.progress // { "videoId123": 75, "videoId456": 50 }
          }));
        }
      }
    );
  }





  useEffect(() => {
    if (lessons?.data?.length > 0) {
      const firstVideo = lessons?.data[0]?.videos?.[0];

      if (firstVideo) {
        setSelectedVideo({
          ...firstVideo,
          lesson: lessons?.data[0]

        });
      }
    }
  }, [lessons]);

  console.log(courseId);
  console.log("course", course);
  console.log(lessons?.data);
  console.log("selectedVideo", selectedVideo);


  if (lessonsLoading && isLoading) return <div className="min-h-full min-w-full flex justify-center items-center"><Loader /></div>;
  if (lessonsError) return <div>Error loading lessons: {lessonsError.message}</div>;
  if (error) return <div>Error loading course: {error.message}</div>;






  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">

      <div className="col-span-1 md:col-span-2">

        <div className="flex flex-col gap-2">
          <p className="text-[#464555] text-xs font-medium"> {course?.data?.title} &gt; Lesson {lessons?.data[0]?.orderIndex} &gt;
            <span className="text-[var(--primary)]"> {selectedVideo?.lesson?.orderIndex}.{selectedVideo?.orderIndex} {selectedVideo?.title}</span>

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
        <div className="flex justify-between items-center mt-4">
          <h2 className="font-bold text-2xl">{selectedVideo?.lesson?.orderIndex}.{selectedVideo?.orderIndex} {selectedVideo?.title}</h2>
          <Button
            onClick={() => handleProgressUpdate(enrollmentId, selectedVideo?._id)}
          > <IoMdCheckmark color="white" /> Record progress</Button>
        </div>
        <p className="flex items-center gap-1 text-xs text-gray-500 mt-2">
          <CiCalendar />
          Updated {selectedVideo?.lesson?.updatedAt && formatDate(selectedVideo?.lesson?.updatedAt)}
        </p>

        <div>
          <Tabs defaultValue="overview" className="mt-4">
            <TabsList
              variant="line"
              className="border-b w-full justify-start text-purple-600"
            >
              <TabsTrigger
                value="overview"
                className="data-active:text-purple-600 data-active:after:bg-purple-600"
              >
                Overview
              </TabsTrigger>

              <TabsTrigger
                value="notes"
                className="data-active:text-purple-600 data-active:after:bg-purple-600"
              >
                Course Material
              </TabsTrigger>

              <TabsTrigger
                value="quizes"
                className="data-active:text-purple-600 data-active:after:bg-purple-600"
              >
                Course Quizes
              </TabsTrigger>

            </TabsList>

            {/* Content */}
            <TabsContent value="overview" className="mt-4 flex flex-col gap-3">
              <p className="text-sm font-normal text-gray-600">
                {course?.data?.description}
              </p>

              <h2 className="font-bold text-lg">What You Will Learn:</h2>
              {course?.data?.whatYouWillLearn?.length > 0 && (
                <ol className="space-y-3">
                  {course?.data?.whatYouWillLearn?.map((item, index) => (

                    <li key={index} className="flex items-center gap-3">

                      {/* Number badge */}
                      <span className="w-7 h-7 flex items-center justify-center rounded-full bg-green-500 text-white text-xs font-bold">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {/* Text */}
                      <span className="text-sm text-gray-700">
                        {item}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </TabsContent>

            <TabsContent value="notes" className="mt-4">
              <div className="flex flex-col gap-3">

                {selectedVideo?.materials?.length > 0 ? (
                  selectedVideo.materials.map((file) => (
                    <div
                      key={file._id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
                    >
                      {/* Left side */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-lg">
                          <FiFileText />
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-700">
                            {file.title}
                          </h3>
                          <p className="text-xs text-gray-400">PDF Document</p>
                        </div>
                      </div>

                      {/* Right side */}
                      <a
                        href={file.url}
                        download
                        className="text-gray-500 hover:text-green-600"
                      >
                        <FiDownload size={18} />
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No materials available</p>
                )}

              </div>

            </TabsContent>

            <TabsContent value="quizes" className="mt-4">
              <div className="flex flex-col gap-3">

                No Quizes Provide

              </div>

            </TabsContent>


          </Tabs>
        </div>
      </div>

      <div className="col-span-1 flex flex-col gap-4">
        <div className="bg-[var(--secondary)] p-5 rounded-md flex flex-col  gap-3">
          <div className=" flex justify-between items-center">
            <h2 className="font-semibold text-sm">Video Progress</h2>
            <Badge variant="lightPruple">{videosProgress[selectedVideo?._id] ?? 0} % DONE</Badge>
          </div>
          <div>
            <Progress value={videosProgress[selectedVideo?._id] ?? 0} className="w-full mt-2 bg-gray-500" />
          </div>
        </div>

        <div className="bg-white shadow shadow-gray-300 py-3 rounded-md">
          <div className=" flex justify-between items-center pb-3 px-3">
            <h2 className="font-semibold text-sm">Course Content</h2>
            <h3 className="text-[var(--ring)] font-semibold text-xs">Expand All</h3>
          </div>
          <hr className="w-full" />

          <div >
            <Accordion type="single" collapsible className="w-full">
              {lessons?.data?.map((lesson) => (
                <AccordionItem key={lesson._id} value={lesson._id}>

                  {/* Trigger (your lesson box) */}
                  <AccordionTrigger
                    className={cn(
                      "!flex !flex-row !items-center !justify-between !rounded w-full gap-2 py-2 px-3",
                      "data-[state=open]:bg-[var(--secondary)]/50 data-[state=open]:pl-4",
                      "relative data-[state=open]:before:content-[''] data-[state=open]:before:absolute data-[state=open]:before:w-1 data-[state=open]:before:h-full data-[state=open]:before:bg-[var(--primary)] data-[state=open]:before:left-0 data-[state=open]:before:top-1/2 data-[state=open]:before:-translate-y-1/2"
                    )}
                  >
                    {/* Lesson number */}
                    <div className="flex flex-col items-start gap-2 w-full">
                      <h3 className="font-semibold text-xs text-[#464555] data-[state=open]:text-[var(--primary)]">
                        Lesson 0{lesson.orderIndex}
                      </h3>

                      {/* Title + icon */}
                      <div className="flex justify-between items-center w-full pe-2">
                        <h2 className="font-semibold text-sm text-[#464555] data-[state=open]:text-[var(--primary)]">
                          {lesson.title}
                        </h2>
                      </div>
                    </div>

                  </AccordionTrigger>

                  {/* Content (videos) */}
                  <AccordionContent >
                    <div className="flex flex-col ">
                      {lesson.videos?.map((video) => (
                        <div
                          onClick={() => {
                            setSelectedVideo({
                              ...video,
                              lesson: lesson
                            })
                          }}
                          key={video._id}
                          className={`text-sm hover:bg-gray-50 p-2
                            ${selectedVideo?._id === video._id ?
                              "bg-[var(--primary)]/10 relative after:content-[''] after:absolute after:w-1 after:h-full after:bg-[#3525CD]/40 after:right-0 after:top-1/2 after:-translate-y-1/2 pl-4"
                              :
                              "bg-white"}`}
                        >
                          <div className="flex justify-between items-center">
                            <h2 className="text-sm font-semibold">{video.orderIndex} {video.title}</h2>
                            {selectedVideo?._id === video._id ? (
                              <MdBarChart className="text-gray-400" />
                            ) : (
                              <IoPlay className="text-gray-400" />
                            )}

                          </div>
                          <p className="font-light text-xs text-[var(--primary)]/50">{video.duration}
                            {selectedVideo?._id === video._id && (
                              <span className=" ms-2">
                                • Watching Now
                              </span>
                            )}
                          </p>


                        </div>
                      ))}
                    </div>
                  </AccordionContent>

                </AccordionItem>
              ))}
            </Accordion>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CoursePlayerPage;


// [{…}]
// 0
// : 
// courseId
// : 
// {_id: '69d6a5fb3940a1c77a47fe55', title: 'Teaching English'}
// createdAt
// : 
// "2026-04-08T20:05:47.352Z"
// description
// : 
// "learn the alphabet for begginers learn the alphabet for begginers "
// materials
// : 
// []
// orderIndex
// : 
// 1
// teacherId
// : 
// "69d3f77927768c09bdb61add"
// title
// : 
// "learn the alpahet"
// updatedAt
// : 
// "2026-04-08T20:05:47.352Z"
// videos
// : 
// (2) [{…}, {…}]
// __v
// : 
// 0
// _id
// : 
// "69d6b51b0b026f5877d57cc6"
// [[Prototype]]
// : 
// Object
// length
// : 
// 1
// [[Prototype]]
// : 
// Array(0)