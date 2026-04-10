useLessonQueries.js

import { getAllLessonByCourse, getLessonById } from "@/services/lessonService"
import { useQuery } from "@tanstack/react-query"

/**
 * Custom hook to fetch all lessons by course ID.
 * @param {string} courseId - The ID of the course.
 * @returns {object} - The query object containing lesson data and metadata.
 */

export const useGetAllLessonsByCourse = (courseId) =>{
  return useQuery({
    queryKey:['lessons', courseId],
    queryFn:() => getAllLessonByCourse(courseId),
  })
}

/**
 * Custom hook to fetch a specific lesson by course ID and lesson ID.
 * @param {string} courseId - The ID of the course.
 * @param {string} lessonId - The ID of the lesson.
 * @returns {object} - The query object containing lesson data and metadata.
 */
export const useGetLessonById = (courseId, lessonId) =>{
  return useQuery({
    queryKey:['lesson', courseId, lessonId],
    queryFn:() => getLessonById(courseId, lessonId),
  })
}