export const ENDPOINTS = {
  // ─── Auth ───────────────────────────────────────────────────────────────────
  AUTH_REGISTER: "/auth/register",
  AUTH_LOGIN: "/auth/login",
  AUTH_REFRESH: "/auth/refresh",
  AUTH_FORGOT_PASSWORD: "/auth/forgot-password", 
  AUTH_RESET_PASSWORD: (token) => `/auth/reset-password/${token}`,
  AUTH_GOOGLE: "/auth/google",

  // ─── Profile ────────────────────────────────────────────────────────────────
  PROFILE_GET: "/auth/me",
  PROFILE_UPDATE: "/auth/me",
  PROFILE_AVATAR: "/profile/avatar",
  PROFILE_CHANGE_PASSWORD: "/auth/change-password",

  // ─── Admin — Users ──────────────────────────────────────────────────────────
  ADMIN_USERS_LIST: "/admin/users",
  ADMIN_USER_STATUS: (id) => `/admin/users/${id}/status`,

  // ─── Categories ─────────────────────────────────────────────────────────────
  CATEGORIES_LIST: "/categories",
  CATEGORY_BY_ID: (id) => `categories/id/${id}`,
  CATEGORIES_CREATE: "/categories",
  CATEGORIES_UPDATE: (id) => `/categories/${id}`,
  CATEGORIES_DELETE: (id) => `/categories/${id}`,

  // ─── Courses ─────────────────────────────────────────────────────────────────
  COURSES_LIST: "/courses",
  COURSES_SEARCH: "/courses/browserCourses",
  COURSES_MY: "/courses/my-courses",
  COURSES_GET: (id) => `/courses/${id}`,
  COURSES_CREATE: "/courses",
  COURSES_STATUS: (id) => `/courses/${id}/status`,
  COURSES_SET_STREAK_REQUIREMENT: (id) =>
    `/admin/courses/${id}/streak-requirement`,

  // ─── Videos & Materials ──────────────────────────────────────────────────────
  COURSE_VIDEOS_ADD: (id) => `/courses/${id}/videos`,
  COURSE_VIDEOS_DELETE: (id, videoId) => `/courses/${id}/videos/${videoId}`,
  COURSE_VIDEOS_REORDER: (id) => `/courses/${id}/videos/reorder`,
  COURSE_MATERIALS_ADD: (id) => `/courses/${id}/materials`,
  COURSE_MATERIALS_DELETE: (id, mid) => `/courses/${id}/materials/${mid}`,

  // ─── Enrollments ─────────────────────────────────────────────────────────────
  ENROLLMENTS_CREATE: "/enrollments",
  ENROLLMENTS_MY: "/enrollments/my",
  ENROLLMENTS_GET: (courseId) => `/enrollments/${courseId}`,
  ENROLLMENTS_VIDEO_COMPLETE: (courseId, videoId) =>
    `/enrollments/${courseId}/videos/${videoId}/complete`,
  ENROLLMENTS_PROGRESS: (courseId) => `/enrollments/${courseId}/progress`,

  // ─── Assignments ─────────────────────────────────────────────────────────────
  ASSIGNMENTS_LIST: (courseId) => `/courses/${courseId}/assignments`,
  ASSIGNMENTS_CREATE: (courseId) => `/courses/${courseId}/assignments`,
  ASSIGNMENTS_UPDATE: (id) => `/assignments/${id}`,
  ASSIGNMENTS_DELETE: (id) => `/assignments/${id}`,
  ASSIGNMENTS_SUBMIT: (id) => `/assignments/${id}/submit`,
  ASSIGNMENTS_MY_SUBMISSION: (id) => `/assignments/${id}/my`,
  ASSIGNMENTS_SUBMISSIONS_LIST: (id) => `/assignments/${id}/submissions`,
  ASSIGNMENTS_GRADE: (id, sid) => `/assignments/${id}/submissions/${sid}`,

  // ─── Quizzes ──────────────────────────────────────────────────────────────────
  QUIZZES_LIST: (courseId) => `/courses/${courseId}/quizzes`,
  QUIZZES_CREATE: (courseId) => `/courses/${courseId}/quizzes`,
  QUIZZES_UPDATE: (id) => `/quizzes/${id}`,
  QUIZZES_DELETE: (id) => `/quizzes/${id}`,
  QUIZZES_START: (id) => `/quizzes/${id}/start`,
  QUIZZES_SUBMIT: (id) => `/quizzes/${id}/submit`,
  QUIZZES_RESULT: (id) => `/quizzes/${id}/result`,

  // ─── Cart ─────────────────────────────────────────────────────────────────────
  CART_GET: "/cart",
  CART_ADD: "/cart/add",
  CART_REMOVE: (id) => `/cart/remove/${id}`,
  CART_CLEAR: "/cart/clear",
  CART_APPLY_VOUCHER: "/cart/apply-voucher",
  CART_REMOVE_VOUCHER: "/cart/remove-voucher",

  // ─── Vouchers ─────────────────────────────────────────────────────────────────
  ADMIN_VOUCHERS_LIST: "/admin/vouchers",
  ADMIN_VOUCHERS_CREATE: "/admin/vouchers",
  ADMIN_VOUCHERS_UPDATE: (id) => `/admin/vouchers/${id}`,
  ADMIN_VOUCHERS_DELETE: (id) => `/admin/vouchers/${id}`,

  // ─── Payments ─────────────────────────────────────────────────────────────────
  PAYMENTS_CREATE_INTENT: "/payments/create-intent",
  PAYMENTS_WEBHOOK: "/payments/webhook",
  PAYMENTS_MY: "/payments/my",

  // ─── Reviews ──────────────────────────────────────────────────────────────────
  REVIEWS_LIST: (courseId) => `/courses/${courseId}/reviews`,
  REVIEWS_CREATE: (courseId) => `/courses/${courseId}/reviews`,
  REVIEWS_DELETE: (id) => `/reviews/${id}`,

  // ─── Favorites ────────────────────────────────────────────────────────────────
  FAVORITES_LIST: "/favorites",
  FAVORITES_ADD: (courseId) => `/favorites/${courseId}`,
  FAVORITES_REMOVE: (courseId) => `/favorites/${courseId}`,

  // ─── Chat ─────────────────────────────────────────────────────────────────────
  CHAT_HISTORY: (courseId) => `/chat/${courseId}`,
  CHAT_SEND: (courseId) => `/chat/${courseId}`,
  CHAT_MARK_READ: (courseId) => `/chat/${courseId}/read`,
  CHAT_UNREAD_COUNT: "/chat/unread-count",

  // ─── AI Reports ───────────────────────────────────────────────────────────────
  REPORTS_GENERATE: (courseId) => `/reports/${courseId}/generate`,
  REPORTS_GET: (courseId) => `/reports/${courseId}`,

  // ─── Revenue & Earnings ───────────────────────────────────────────────────────
  ADMIN_REVENUE_CONFIG_GET: "/admin/revenue-config",
  ADMIN_REVENUE_CONFIG_UPDATE: "/admin/revenue-config",
  TEACHER_EARNINGS: "/teacher/earnings",
  ADMIN_EARNINGS: "/admin/earnings",

  // ─── Withdrawals ──────────────────────────────────────────────────────────────
  TEACHER_WITHDRAWALS_CREATE: "/teacher/withdrawals",
  TEACHER_WITHDRAWALS_LIST: "/teacher/withdrawals",
  ADMIN_WITHDRAWALS_LIST: "/admin/withdrawals",
  ADMIN_WITHDRAWALS_PROCESS: (id) => `/admin/withdrawals/${id}`,

  // ─── Admin Dashboard ──────────────────────────────────────────────────────────
  ADMIN_STATS_OVERVIEW: "/admin/stats/overview",
  ADMIN_STATS_REVENUE: "/admin/stats/revenue",
  ADMIN_STATS_ENROLLMENTS: "/admin/stats/enrollments",

  // ─── Sliders ──────────────────────────────────────────────────────────────────
  SLIDERS_LIST: "/sliders",
  ADMIN_SLIDERS_CREATE: "/admin/sliders",
  ADMIN_SLIDERS_UPDATE: (id) => `/admin/sliders/${id}`,
  ADMIN_SLIDERS_DELETE: (id) => `/admin/sliders/${id}`,
  ADMIN_SLIDERS_REORDER: "/admin/sliders/reorder",

  // ─── Teacher Verification ─────────────────────────────────────────────────────
  TEACHER_VERIFICATION_SUBMIT: "/teacher/verification",
  TEACHER_VERIFICATION_STATUS: "/teacher/verification",
  ADMIN_VERIFICATIONS_LIST: "/admin/verifications",
  ADMIN_VERIFICATIONS_PROCESS: (id) => `/admin/verification/${id}`,

  // ─── Teacher Availability ─────────────────────────────────────────────────────
  TEACHER_AVAILABILITY_CREATE: "/teacher/availability",
  TEACHER_AVAILABILITY_LIST: "/teacher/availability",
  TEACHER_AVAILABILITY_UPDATE: (id) => `/teacher/availability/${id}`,
  TEACHER_AVAILABILITY_DELETE: (id) => `/teacher/availability/${id}`,
  TEACHER_AVAILABILITY_PUBLIC: (teacherId) =>
    `/teachers/${teacherId}/availability`,

  // ─── Sessions (1-to-1) ────────────────────────────────────────────────────────
  SESSIONS_BOOK: "/sessions/book",
  SESSIONS_MY: "/sessions/my",
  SESSIONS_JOIN: (id) => `/sessions/${id}/join`,
  SESSIONS_START_CALL: (id) => `/sessions/${id}/start-call`,
  SESSIONS_END_CALL: (id) => `/sessions/${id}/end-call`,

  // ─── Mobile — Question Bank ───────────────────────────────────────────────────
  QUESTION_BANK_LIST: (courseId) => `/courses/${courseId}/question-bank`,
  QUESTION_BANK_CREATE: (courseId) => `/courses/${courseId}/question-bank`,
  QUESTION_BANK_UPDATE: (qid) => `/question-bank/${qid}`,
  QUESTION_BANK_DELETE: (qid) => `/question-bank/${qid}`,

  // ─── Mobile — Daily Questions ─────────────────────────────────────────────────
  DAILY_QUESTIONS_GET: (courseId) => `/mobile/daily-questions/${courseId}`,
  DAILY_ANSWERS_SUBMIT: (courseId) => `/mobile/daily-answers/${courseId}`,
  DAILY_ANSWERS_HISTORY: (courseId) =>
    `/mobile/daily-answers/${courseId}/history`,

  // ─── Mobile — Streaks ─────────────────────────────────────────────────────────
  STREAKS_GET: (courseId) => `/mobile/streaks/${courseId}`,
  STREAKS_ALL: "/mobile/streaks",

  // ─── Mobile — Push Notifications ─────────────────────────────────────────────
  FCM_TOKEN_REGISTER: "/mobile/fcm-token",

  // ─── Mobile — QR Code ────────────────────────────────────────────────────────
  QR_GENERATE: (courseId) => `/mobile/qr/generate/${courseId}`,
  QR_SCAN: "/mobile/qr/scan",

  // ─── Attendance ───────────────────────────────────────────────────────────────
  ATTENDANCE_SESSIONS_LIST: (courseId) => `/sessions/${courseId}`,
  ATTENDANCE_SESSION_RECORDS: (id) => `/sessions/${id}/attendance`,
  ATTENDANCE_STUDENT_SUMMARY: (courseId, sid) =>
    `/attendance/${courseId}/student/${sid}`,
  ATTENDANCE_MY: (courseId) => `/attendance/my/${courseId}`,

  // ─── File Upload ──────────────────────────────────────────────────────────────
  UPLOAD: "/upload",
};
