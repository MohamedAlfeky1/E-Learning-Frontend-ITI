import { useQuery } from '@tanstack/react-query';
import { getAllCourses, getCourseById } from '../services/courseService';

// Example TanStack Query hook for fetching courses
// export const useCourses = () => {
//   return useQuery({
//     queryKey: ['courses'],
//     queryFn: fetchCourses,
//     // Optional configuration:
//     // staleTime: 1000 * 60 * 5, // 5 minutes
//     // retry: 1,
//   });
// };

export const useGetCoursesById = (id) =>{
  return useQuery({
    queryKey:['course', id],
    queryFn:() => getCourseById(id),
  })
}


export const useGetAllCourses = () =>{
  return useQuery({
    queryKey:['allCourses'],
    queryFn:getAllCourses,
  })
}

