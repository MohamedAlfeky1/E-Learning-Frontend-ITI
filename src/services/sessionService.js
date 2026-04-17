import axiosInstance from '@/api/axiosInstance'
import { ENDPOINTS } from '@/api/endpoints'

export const sessionService = {
  // Teacher Availability
  getAvailability: () => axiosInstance.get(ENDPOINTS.SESSIONS_AVAILABILITY),
  addAvailability: (data) => axiosInstance.post(ENDPOINTS.SESSIONS_AVAILABILITY, data),
  updateAvailability: (id, data) => axiosInstance.put(ENDPOINTS.SESSIONS_AVAILABILITY_UPDATE(id), data),
  deleteAvailability: (id) => axiosInstance.delete(ENDPOINTS.SESSIONS_AVAILABILITY_UPDATE(id)),
  
  // Student
  getTeachers: () => axiosInstance.get(ENDPOINTS.SESSIONS_TEACHERS),
  getTeacherAvailability: (teacherId, date) => 
    axiosInstance.get(ENDPOINTS.SESSIONS_TEACHER_AVAILABILITY(teacherId), { params: { date } }),
  bookSession: (data) => axiosInstance.post(ENDPOINTS.SESSIONS_BOOK, data),
  getMyBookings: () => axiosInstance.get(ENDPOINTS.SESSIONS_MY_BOOKINGS),
  cancelBooking: (id) => axiosInstance.put(ENDPOINTS.SESSIONS_CANCEL(id)),
  
  // Teacher Bookings
  getTeacherBookings: () => axiosInstance.get(ENDPOINTS.SESSIONS_TEACHER_BOOKINGS),
  
  // Video Call
  joinSession: (id) => axiosInstance.get(ENDPOINTS.SESSIONS_JOIN(id)),
  endSession: (id) => axiosInstance.put(ENDPOINTS.SESSIONS_END(id)),
}