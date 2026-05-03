import { useGetCoursesById } from "@/queries/useCourses";

function CourseTitle({ courseId }) {
    const { data: courseData } = useGetCoursesById(courseId);
    console.log("courseData",courseData);
    
    return (
        <p className="text-sm text-gray-700 font-medium break-words">
            {courseData?.data.title?.split(" ").slice(0, 2).join(" ") + "..."}
        </p>
    );
}

export default CourseTitle
