import { useQuery } from "@tanstack/react-query";
import { adminUsersService } from "../services/adminStudentService";

/**
 * Custom hook to fetch a paginated list of users based on filter parameters.
 * Uses "keepPreviousData" to prevent UI flickering during pagination.
 * * @param {Object} params - Filter and pagination parameters (e.g., page, limit, role).
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result containing the users list and pagination metadata.
 */
export const useUsersQuery = (params) => {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => adminUsersService.getAllUsers(params),
    keepPreviousData: true,
  });
};
/**
 * Custom hook to fetch basic details of a specific user by their ID.
 * This is typically used for general admin management tasks.
 * * @param {string} id - The unique identifier of the user.
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result containing basic user data.
 */

export const useUserDetailQuery = (id) => {
  return useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => adminUsersService.getUserById(id),
    enabled: !!id,
  });
};
/**
 * Custom hook to fetch the comprehensive profile of a student.
 * Used in the dedicated Student Profile page to show coursesو activities.
 * * @param {string} id - The unique identifier of the student.
 * @returns {import('@tanstack/react-query').UseQueryResult} Query result containing detailed student profile data.
 */
export const useStudentProfileQuery = (id) => {
  return useQuery({
    queryKey: ["student-profile", id],
    queryFn: () => adminUsersService.getStudentProfile(id),
    enabled: !!id,
  });
};
