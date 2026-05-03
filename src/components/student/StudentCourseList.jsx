import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Loader2 } from "lucide-react"; 
import { getAllCoursesOfUser } from "@/services/enrollmentService";

const StudentCourseList = ({ onCourseChange }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [loading, setLoading] = useState(true);
  console.log(courses);
  console.log(selectedCourseId);
  

  

  useEffect(() => {
    const fetchAllCourses = async () => {
      setLoading(true);
      try {
        const data = await getAllCoursesOfUser();
        console.log(data.data);
        
        const fetchedCourses = data.data || [];
        setCourses(fetchedCourses);
        
        

        if (fetchedCourses.length > 0) {
          const firstCourseId = fetchedCourses[0]?.courseId?._id;
          console.log("hereeeeeeeeeeeeeee : ",firstCourseId);
          
          setSelectedCourseId(firstCourseId);
          
          if (onCourseChange) onCourseChange(firstCourseId);
        }
      } catch (error) {
        console.error("Failed to load courses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllCourses();
  }, []); 

  const handleValueChange = (value) => {
    setSelectedCourseId(value);
    if (onCourseChange) onCourseChange(value);
  };

  return (
    <div className="mb-8 flex items-center gap-4 bg-white/50 p-4 rounded-2xl border border-slate-200 shadow-sm backdrop-blur-sm w-fit">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <BookOpen className="w-4 h-4 text-indigo-600" />
        </div>
        <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">
          Active Course:
        </span>
      </div>

      <Select 
        value={selectedCourseId} 
        onValueChange={handleValueChange}
        disabled={loading}
      >
        <SelectTrigger className="w-[300px] h-11 rounded-xl border-slate-200 focus:ring-indigo-500 bg-white shadow-sm transition-all hover:border-indigo-200">
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              <span>Loading courses...</span>
            </div>
          ) : (
            <SelectValue placeholder="Choose a course to manage" />
          )}
        </SelectTrigger>
        
        <SelectContent className="rounded-xl shadow-2xl border-slate-100 p-1">
          {courses.map((course) => (
            <SelectItem 
              key={course?.courseId?._id} 
              value={course?.courseId?._id} 
              className="rounded-lg py-3 focus:bg-indigo-50 focus:text-indigo-700 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span className="font-medium text-slate-700">{course?.courseId?.title}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StudentCourseList;
