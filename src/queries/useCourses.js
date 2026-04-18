import { useQuery } from '@tanstack/react-query';
import { getAllCourses, getAllCoursesOfLoggedInTeacher, getCourseById } from '../services/courseService';

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


/**
 * Fetch a single course by ID using React Query.
 *
 * @function useGetCoursesById
 * @param {string} id - Course ID
 * @returns {import('@tanstack/react-query').UseQueryResult}
 * React Query result with course data, loading, and error states.
 */
export const useGetCoursesById = (id) =>{
  return useQuery({
    queryKey:['course', id],
    queryFn:() => getCourseById(id),
  })
}

/**
 * Fetch all courses using React Query.
 *
 * @function useGetAllCourses
 * @returns {import('@tanstack/react-query').UseQueryResult}
 * React Query result with courses data, loading, and error states.
 */
export const useGetAllCourses = () =>{
  return useQuery({
    queryKey:['allCourses'],
    queryFn:getAllCourses,
  })
}


export const useGetAllTeacherCourses = () =>{
  return useQuery({
    queryKey:['allCourses'],
    queryFn:getAllCoursesOfLoggedInTeacher,
  })
}

