import { createBrowserRouter, Navigate } from "react-router-dom";

// ─── Layouts ────────────────────────────────────────────────────────────────
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import StudentLayout from "@/layouts/StudentLayout";
import AdminLayout from "@/layouts/AdminLayout";
import TeacherLayout from "@/layouts/TeacherLayout";

// ─── Route Guards ────────────────────────────────────────────────────────────
import ProtectedRoute from "@/router/ProtectedRoute";

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC PAGES  (Guest + any logged-in user)
// ─────────────────────────────────────────────────────────────────────────────
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import CoursesPage from "@/pages/CoursesPage";
import CourseDetailsPage from "@/pages/CourseDetailsPage";
import TeacherPublicProfilePage from "@/pages/TeacherPublicProfilePage";

// ─────────────────────────────────────────────────────────────────────────────
// AUTH PAGES
// ─────────────────────────────────────────────────────────────────────────────
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

// ─────────────────────────────────────────────────────────────────────────────
// STUDENT PAGES  (role: student)
// ─────────────────────────────────────────────────────────────────────────────
import StudentDashboardPage from "@/pages/student/StudentDashboardPage";
import StudentProfilePage from "@/pages/student/StudentProfilePage";
import MyCoursesPage from "@/pages/student/MyCoursesPage";
import CoursePlayerPage from "@/pages/student/CoursePlayerPage";
import CheckoutPage from "@/pages/student/CheckoutPage";
import PaymentSuccessPage from "@/pages/student/PaymentSuccessPage";
import PaymentHistoryPage from "@/pages/student/PaymentHistoryPage";
import CartPage from "@/pages/student/CartPage";
import FavoritesPage from "@/pages/student/FavoritesPage";
import StudentAssignmentsPage from "@/pages/student/StudentAssignmentsPage";
import StudentQuizzesPage from "@/pages/student/StudentQuizzesPage";
import QuizTakePage from "@/pages/student/QuizTakePage";
import QuizResultPage from "@/pages/student/QuizResultPage";
import AiReportPage from "@/pages/student/AiReportPage";
import StudentChatPage from "@/pages/student/StudentChatPage";
import MySessionsPage from "@/pages/student/MyBookingsPage";
import SessionRoomPage from "@/pages/student/SessionRoomPage";
import TicketsPage from "@/pages/student/TicketPage";

// ─────────────────────────────────────────────────────────────────────────────
// TEACHER PAGES  (role: teacher)
// ─────────────────────────────────────────────────────────────────────────────
import TeacherDashboardPage from "@/pages/teacher/TeacherDashboardPage";
import TeacherProfilePage from "@/pages/teacher/TeacherProfilePage";
import TeacherCoursesPage from "@/pages/teacher/TeacherCoursesPage";
import CreateCoursePage from "@/pages/teacher/CreateCoursePage";
import EditCoursePage from "@/pages/teacher/EditCoursePage";
import CourseDetailManagePage from "@/pages/teacher/CourseDetailManagePage";
import AddLessonPage from "@/pages/teacher/AddLessonPage";
import UploadMaterialPage from "@/pages/teacher/UploadMaterialPage";
import ManageQuizzesPage from "@/pages/teacher/ManageQuizzesPage";
import CreateQuizPage from "@/pages/teacher/CreateQuizPage";
import EditQuizPage from "@/pages/teacher/EditQuizPage";
import ReviewStudentAnswersPage from "@/pages/teacher/ReviewStudentAnswersPage";
import ManageAssignmentsPage from "@/pages/teacher/ManageAssignmentsPage";
import GradeAssignmentPage from "@/pages/teacher/GradeAssignmentPage";
import TeacherEarningsPage from "@/pages/teacher/TeacherEarningsPage";
import WithdrawalRequestPage from "@/pages/teacher/WithdrawalRequestPage";
import TeacherVerificationPage from "@/pages/teacher/TeacherVerificationPage";
import TeacherChatPage from "@/pages/teacher/TeacherChatPage";
import TeacherTicketPage from "@/pages/teacher/TeacherTicketPage";
import MyBookings from './../pages/teacher/TeacherBookingPage/index';


// ─────────────────────────────────────────────────────────────────────────────
// ADMIN PAGES  (role: admin)
// ─────────────────────────────────────────────────────────────────────────────
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminProfilePage from "@/pages/admin/AdminProfilePage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminTeachersPage from "@/pages/admin/AdminTeachersPage";
import AdminStudentsPage from "@/pages/admin/AdminStudentsPage";
import AdminCoursesPage from "@/pages/admin/AdminCoursesPage";
import AdminCategoriesPage from "@/pages/admin/AdminCategoriesPage";
import AdminVouchersPage from "@/pages/admin/AdminVouchersPage";
import AdminSlidersPage from "@/pages/admin/AdminSlidersPage";
import AdminReportsPage from "@/pages/admin/AdminReportsPage";
import AdminRevenueConfigPage from "@/pages/admin/AdminRevenueConfigPage";
import AdminWithdrawalsPage from "@/pages/admin/AdminWithdrawalsPage";
import AdminVerificationsPage from "@/pages/admin/AdminVerificationsPage";
import AdminEnrollStudentPage from "@/pages/admin/AdminEnrollStudentPage";
import AdminAddAdminPage from "@/pages/admin/AdminAddAdminPage";
import AdminPaymentsPage from "@/pages/admin/AdminPaymentsPage";
import AdminTicketPage from "@/pages/admin/AdminTicketPage";
import StudentProfilePageA from "@/pages/admin/StudentProfilePage";

// ─────────────────────────────────────────────────────────────────────────────
// ERROR / FALLBACK
// ─────────────────────────────────────────────────────────────────────────────
import NotFoundPage from "@/pages/NotFoundPage";
import BookingPage from "@/pages/student/BookSessionPage";
import TeachersPage from "@/pages/student/TeacherList";
import TeacherAvailabilityPage from "@/pages/teacher/TeacherAvailabilityPage";
import ChatsPages from "@/pages/student/ChatsPage";
import VideoCall from "@/pages/VideoCall";
import AvailableSlotsPage from "@/pages/teacher/AvailableSlotsPage";

// ─────────────────────────────────────────────────────────────────────────────
// Chat
// ─────────────────────────────────────────────────────────────────────────────
import ChatPage from "@/pages/chatPage";

// =============================================================================
const router = createBrowserRouter([
  // ───────────────────────────────────────────────────────────────────────────
  // PUBLIC  — wrapped in MainLayout (Navbar + Footer)
  // ───────────────────────────────────────────────────────────────────────────
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> }, // /
      { path: "about", element: <AboutPage /> }, // /about
      { path: "courses", element: <CoursesPage /> },

      // /courses
      {
        // /courses/:id
        path: "courses/:id",
        element: <CourseDetailsPage />,
      },
      {
        // /teachers/:id
        path: "teachers/:id",
        element: <TeacherPublicProfilePage />,
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // AUTH  — wrapped in AuthLayout (centered card, no navbar)
  // ───────────────────────────────────────────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> }, // /login
      { path: "register", element: <RegisterPage /> }, // /register
      { path: "forgot-password", element: <ForgotPasswordForm /> },
      { path: "reset-password/:token", element: <ResetPasswordForm /> },

      // { path: "register/teacher", element: <TeacherRegisterPage /> }, // /register/teacher
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // STUDENT  — role guard + DashboardLayout
  // ───────────────────────────────────────────────────────────────────────────
  {
    path: "checkout-page",
    element: (
      <ProtectedRoute allowedRoles={["student"]}>
        {/* You can wrap it in a minimal layout here if needed */}
        <CheckoutPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "payment-success",
    element: (
      <ProtectedRoute allowedRoles={["student"]}>
        <PaymentSuccessPage />
      </ProtectedRoute>
    ),
  },
  
  {
    element: (
      <ProtectedRoute allowedRoles={["student"]}>
        <StudentLayout />
      </ProtectedRoute>
    ),
    children: [
      // Dashboard & profile
      { path: "dashboard", element: <StudentDashboardPage /> }, // /dashboard
      { path: "profile", element: <StudentProfilePage /> }, // /profile
      { path: "chats", element: <ChatPage /> }, // /chat

      // Courses
      { path: "my-courses", element: <MyCoursesPage /> }, // /my-courses
      { path: "my-courses/:courseId/learn", element: <CoursePlayerPage /> }, // /my-courses/:courseId/learn
      // {path: "course-viewer/:courseId", element: <CourseViewerPage /> }, // /my-courses/:courseId/view

      // Cart & Checkout
      { path: "cart", element: <CartPage /> }, // /cart
      { path: "payment-history", element: <PaymentHistoryPage /> }, // /payment-history

      // Favorites
      { path: "favorites", element: <FavoritesPage /> }, // /favorites

      // Assignments
      {
        // /assignments
        path: "assignments",
        element: <StudentAssignmentsPage />,
      },

      // Chats
      { path: "/chats", element: <ChatsPages /> },

      // Quizzes
      { path: "quizzes", element: <StudentQuizzesPage /> }, // /quizzes
      { path: "quizzes/:quizId/take", element: <QuizTakePage /> }, // /quizzes/:quizId/take
      { path: "quizzes/:quizId/result", element: <QuizResultPage /> }, // /quizzes/:quizId/result
       {
    path: "teachers",
    element: (
        <TeachersPage />
    ),
  },

      // AI Report
      {
        // /courses/:courseId/report
        path: "courses/:courseId/report",
        element: <AiReportPage />,
      },

      // Chat
      {
        // /chat/:courseId
        path: "chat/:courseId",
        element: <StudentChatPage />,
      },

      // One-to-One Sessions
      {
        // /teachers/:teacherId/book
        path: "teachers/:teacherId/book",
        element: <BookingPage />,
      },
      { path: "sessions", element: <MySessionsPage /> }, // /sessions
      {
        // /sessions/:sessionId/room
        path: "sessions/:sessionId/room",
        element: <SessionRoomPage />,
      },
      //video call
      { path: "videoCall/:bookingId", element: <VideoCall /> },

      // /tickets
      {
        path: "tickets",
        element: <TicketsPage />,
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // TEACHER  — role guard + TeacherLayout
  // ───────────────────────────────────────────────────────────────────────────
  {
    path: "teacher",
    element: (
      <ProtectedRoute allowedRoles={["teacher"]}>
        <TeacherLayout />
      </ProtectedRoute>
    ),
    children: [
      // Index redirect
      { index: true, element: <Navigate to="dashboard" replace /> },
      // { path: "verification", element: <TeacherVerificationPage /> }, // /teacher/verification
      // Dashboard & profile
      { path: "dashboard", element: <TeacherDashboardPage /> }, // /teacher/dashboard
      { path: "profile", element: <TeacherProfilePage /> }, // /teacher/profile

      // Courses
      { path: "courses", element: <TeacherCoursesPage /> }, // /teacher/courses
      { path: "courses/create", element: <CreateCoursePage /> }, // /teacher/courses/create
      { path: "courses/:courseId", element: <CourseDetailManagePage /> }, // /teacher/courses/:courseId
      { path: "courses/:courseId/edit", element: <EditCoursePage /> }, // /teacher/courses/:courseId/edit
      { path: "courses/:courseId/lessons/add", element: <AddLessonPage /> }, // /teacher/courses/:courseId/lessons/add
      {
        path: "courses/:courseId/materials/upload",
        element: <UploadMaterialPage />,
      }, // /teacher/courses/:courseId/materials/upload

      // Quizzes
      { path: "courses/:courseId/quizzes", element: <ManageQuizzesPage /> }, // /teacher/courses/:courseId/quizzes
      { path: "courses/quizzes/create", element: <CreateQuizPage /> }, // /teacher/courses/:courseId/quizzes/create
      { path: "quizzes/:quizId/edit", element: <EditQuizPage /> }, // /teacher/quizzes/:quizId/edit
      {
        path: "quizzes/:quizId/answers",
        element: <ReviewStudentAnswersPage />,
      }, // /teacher/quizzes/:quizId/answers

      // Assignments
      {
        path: "courses/:courseId/assignments",
        element: <ManageAssignmentsPage />,
      }, // /teacher/courses/:courseId/assignments
      {
        path: "assignments/:assignmentId/grade",
        element: <GradeAssignmentPage />,
      }, // /teacher/assignments/:assignmentId/grade

      // Chat
      { path: "chats", element: <ChatPage /> }, // /chat
      // Earnings & Withdrawals
      { path: "earnings", element: <TeacherEarningsPage /> }, // /teacher/earnings
      { path: "withdrawals", element: <WithdrawalRequestPage /> }, // /teacher/withdrawals

      // Availability & Sessions
      { path: "availability", element: <TeacherAvailabilityPage /> }, // /teacher/availability
      { path: "availableSlotsPage", element: <AvailableSlotsPage /> }, // /teacher/availability

      { path: "mybookings", element: <MyBookings/> }, // /teacher/sessions
      { path: "tickets", element: <TeacherTicketPage /> }, // /teacher/tickets

      // video call
      { path: "videoCall/:bookingId", element: <VideoCall /> },

      // Verification
    ],
  },
  {
    path: "teacher/verification",
    element: (
      <ProtectedRoute allowedRoles={["teacher"]}>
        <TeacherVerificationPage />
      </ProtectedRoute>
    ),
  },
  // ───────────────────────────────────────────────────────────────────────────
  // ADMIN  — role guard + AdminLayout
  // ───────────────────────────────────────────────────────────────────────────
  {
    path: "admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      // Index redirect
      { index: true, element: <Navigate to="dashboard" replace /> },

      // Dashboard & profile
      { path: "dashboard", element: <AdminDashboardPage /> }, // /admin/dashboard
      { path: "profile", element: <AdminProfilePage /> }, // /admin/profile

      // User management
      { path: "users", element: <AdminUsersPage /> }, // /admin/users
      { path: "teachers", element: <AdminTeachersPage /> }, // /admin/teachers
      { path: "students", element: <AdminStudentsPage /> }, // /admin/students
      { path: "admins/add", element: <AdminAddAdminPage /> }, // /admin/admins/add

      // Teacher verifications
      { path: "verifications", element: <AdminVerificationsPage /> }, // /admin/verifications

      // Courses & Categories
      { path: "courses", element: <AdminCoursesPage /> }, // /admin/courses
      { path: "categories", element: <AdminCategoriesPage /> }, // /admin/categories

      // Enrollment
      { path: "enroll", element: <AdminEnrollStudentPage /> }, // /admin/enroll

      // Commerce
      { path: "vouchers", element: <AdminVouchersPage /> }, // /admin/vouchers
      { path: "payments", element: <AdminPaymentsPage /> }, // /admin/payments
      { path: "withdrawals", element: <AdminWithdrawalsPage /> }, // /admin/withdrawals
      { path: "revenue-config", element: <AdminRevenueConfigPage /> }, // /admin/revenue-config

      // Content
      { path: "sliders", element: <AdminSlidersPage /> }, // /admin/sliders

      // Reports & Analytics
      { path: "reports", element: <AdminReportsPage /> }, // /admin/reports
      { path: "tickets", element: <AdminTicketPage /> }, // /admin/tickets
      { path: "students/:id", element: <StudentProfilePageA /> }, // /admin/students/:id
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CATCH-ALL  — 404
  // ───────────────────────────────────────────────────────────────────────────
  { path: "*", element: <NotFoundPage /> },
]);

export default router;
