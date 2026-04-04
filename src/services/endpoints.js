export const ENDPOINTS = {
  // ─── Auth ───────────────────────────────────────────────────────────────────
  AUTH_REGISTER: "/api/auth/register",
  AUTH_LOGIN: "/api/auth/login",
  AUTH_REFRESH: "/api/auth/refresh",

  // ─── Profile ────────────────────────────────────────────────────────────────
  PROFILE_GET: "/api/profile",
  PROFILE_UPDATE: "/api/profile",
  PROFILE_AVATAR: "/api/profile/avatar",
  PROFILE_CHANGE_PASSWORD: "/api/profile/password",

  // ─── Admin — Users ──────────────────────────────────────────────────────────
  ADMIN_USERS_LIST: "/api/admin/users",
  ADMIN_USER_STATUS: (id) => `/api/admin/users/${id}/status`,

  // ─── Categories ─────────────────────────────────────────────────────────────
  CATEGORIES_LIST: "/api/categories",
  CATEGORIES_CREATE: "/api/categories",
  CATEGORIES_UPDATE: (id) => `/api/categories/${id}`,
  CATEGORIES_DELETE: (id) => `/api/categories/${id}`,

  // ─── Courses ─────────────────────────────────────────────────────────────────
  COURSES_LIST: "/api/courses",
  COURSES_SEARCH: "/api/courses/search",
  COURSES_MY: "/api/courses/my",
  COURSES_GET: (id) => `/api/courses/${id}`,
  COURSES_CREATE: "/api/courses",
  COURSES_STATUS: (id) => `/api/courses/${id}/status`,
  COURSES_SET_STREAK_REQUIREMENT: (id) =>
    `/api/admin/courses/${id}/streak-requirement`,

  // ─── Videos & Materials ──────────────────────────────────────────────────────
  COURSE_VIDEOS_ADD: (id) => `/api/courses/${id}/videos`,
  COURSE_VIDEOS_DELETE: (id, videoId) => `/api/courses/${id}/videos/${videoId}`,
  COURSE_VIDEOS_REORDER: (id) => `/api/courses/${id}/videos/reorder`,
  COURSE_MATERIALS_ADD: (id) => `/api/courses/${id}/materials`,
  COURSE_MATERIALS_DELETE: (id, mid) => `/api/courses/${id}/materials/${mid}`,

  // ─── Enrollments ─────────────────────────────────────────────────────────────
  ENROLLMENTS_CREATE: "/api/enrollments",
  ENROLLMENTS_MY: "/api/enrollments/my",
  ENROLLMENTS_GET: (courseId) => `/api/enrollments/${courseId}`,
  ENROLLMENTS_VIDEO_COMPLETE: (courseId, videoId) =>
    `/api/enrollments/${courseId}/videos/${videoId}/complete`,
  ENROLLMENTS_PROGRESS: (courseId) => `/api/enrollments/${courseId}/progress`,

  // ─── Assignments ─────────────────────────────────────────────────────────────
  ASSIGNMENTS_LIST: (courseId) => `/api/courses/${courseId}/assignments`,
  ASSIGNMENTS_CREATE: (courseId) => `/api/courses/${courseId}/assignments`,
  ASSIGNMENTS_UPDATE: (id) => `/api/assignments/${id}`,
  ASSIGNMENTS_DELETE: (id) => `/api/assignments/${id}`,
  ASSIGNMENTS_SUBMIT: (id) => `/api/assignments/${id}/submit`,
  ASSIGNMENTS_MY_SUBMISSION: (id) => `/api/assignments/${id}/my`,
  ASSIGNMENTS_SUBMISSIONS_LIST: (id) => `/api/assignments/${id}/submissions`,
  ASSIGNMENTS_GRADE: (id, sid) => `/api/assignments/${id}/submissions/${sid}`,

  // ─── Quizzes ──────────────────────────────────────────────────────────────────
  QUIZZES_LIST: (courseId) => `/api/courses/${courseId}/quizzes`,
  QUIZZES_CREATE: (courseId) => `/api/courses/${courseId}/quizzes`,
  QUIZZES_UPDATE: (id) => `/api/quizzes/${id}`,
  QUIZZES_DELETE: (id) => `/api/quizzes/${id}`,
  QUIZZES_START: (id) => `/api/quizzes/${id}/start`,
  QUIZZES_SUBMIT: (id) => `/api/quizzes/${id}/submit`,
  QUIZZES_RESULT: (id) => `/api/quizzes/${id}/result`,

  // ─── Cart ─────────────────────────────────────────────────────────────────────
  CART_GET: "/api/cart",
  CART_ADD: "/api/cart/add",
  CART_REMOVE: (id) => `/api/cart/remove/${id}`,
  CART_CLEAR: "/api/cart/clear",
  CART_APPLY_VOUCHER: "/api/cart/apply-voucher",
  CART_REMOVE_VOUCHER: "/api/cart/remove-voucher",

  // ─── Vouchers ─────────────────────────────────────────────────────────────────
  ADMIN_VOUCHERS_LIST: "/api/admin/vouchers",
  ADMIN_VOUCHERS_CREATE: "/api/admin/vouchers",
  ADMIN_VOUCHERS_UPDATE: (id) => `/api/admin/vouchers/${id}`,
  ADMIN_VOUCHERS_DELETE: (id) => `/api/admin/vouchers/${id}`,

  // ─── Payments ─────────────────────────────────────────────────────────────────
  PAYMENTS_CREATE_INTENT: "/api/payments/create-intent",
  PAYMENTS_WEBHOOK: "/api/payments/webhook",
  PAYMENTS_MY: "/api/payments/my",

  // ─── Reviews ──────────────────────────────────────────────────────────────────
  REVIEWS_LIST: (courseId) => `/api/courses/${courseId}/reviews`,
  REVIEWS_CREATE: (courseId) => `/api/courses/${courseId}/reviews`,
  REVIEWS_DELETE: (id) => `/api/reviews/${id}`,

  // ─── Favorites ────────────────────────────────────────────────────────────────
  FAVORITES_LIST: "/api/favorites",
  FAVORITES_ADD: (courseId) => `/api/favorites/${courseId}`,
  FAVORITES_REMOVE: (courseId) => `/api/favorites/${courseId}`,

  // ─── Chat ─────────────────────────────────────────────────────────────────────
  CHAT_HISTORY: (courseId) => `/api/chat/${courseId}`,
  CHAT_SEND: (courseId) => `/api/chat/${courseId}`,
  CHAT_MARK_READ: (courseId) => `/api/chat/${courseId}/read`,
  CHAT_UNREAD_COUNT: "/api/chat/unread-count",

  // ─── AI Reports ───────────────────────────────────────────────────────────────
  REPORTS_GENERATE: (courseId) => `/api/reports/${courseId}/generate`,
  REPORTS_GET: (courseId) => `/api/reports/${courseId}`,

  // ─── Revenue & Earnings ───────────────────────────────────────────────────────
  ADMIN_REVENUE_CONFIG_GET: "/api/admin/revenue-config",
  ADMIN_REVENUE_CONFIG_UPDATE: "/api/admin/revenue-config",
  TEACHER_EARNINGS: "/api/teacher/earnings",
  ADMIN_EARNINGS: "/api/admin/earnings",

  // ─── Withdrawals ──────────────────────────────────────────────────────────────
  TEACHER_WITHDRAWALS_CREATE: "/api/teacher/withdrawals",
  TEACHER_WITHDRAWALS_LIST: "/api/teacher/withdrawals",
  ADMIN_WITHDRAWALS_LIST: "/api/admin/withdrawals",
  ADMIN_WITHDRAWALS_PROCESS: (id) => `/api/admin/withdrawals/${id}`,

  // ─── Admin Dashboard ──────────────────────────────────────────────────────────
  ADMIN_STATS_OVERVIEW: "/api/admin/stats/overview",
  ADMIN_STATS_REVENUE: "/api/admin/stats/revenue",
  ADMIN_STATS_ENROLLMENTS: "/api/admin/stats/enrollments",

  // ─── Sliders ──────────────────────────────────────────────────────────────────
  SLIDERS_LIST: "/api/sliders",
  ADMIN_SLIDERS_CREATE: "/api/admin/sliders",
  ADMIN_SLIDERS_UPDATE: (id) => `/api/admin/sliders/${id}`,
  ADMIN_SLIDERS_DELETE: (id) => `/api/admin/sliders/${id}`,
  ADMIN_SLIDERS_REORDER: "/api/admin/sliders/reorder",

  // ─── Teacher Verification ─────────────────────────────────────────────────────
  TEACHER_VERIFICATION_SUBMIT: "/api/teacher/verification",
  TEACHER_VERIFICATION_STATUS: "/api/teacher/verification",
  ADMIN_VERIFICATIONS_LIST: "/api/admin/verifications",
  ADMIN_VERIFICATIONS_PROCESS: (id) => `/api/admin/verifications/${id}`,

  // ─── Teacher Availability ─────────────────────────────────────────────────────
  TEACHER_AVAILABILITY_CREATE: "/api/teacher/availability",
  TEACHER_AVAILABILITY_LIST: "/api/teacher/availability",
  TEACHER_AVAILABILITY_UPDATE: (id) => `/api/teacher/availability/${id}`,
  TEACHER_AVAILABILITY_DELETE: (id) => `/api/teacher/availability/${id}`,
  TEACHER_AVAILABILITY_PUBLIC: (teacherId) =>
    `/api/teachers/${teacherId}/availability`,

  // ─── Sessions (1-to-1) ────────────────────────────────────────────────────────
  SESSIONS_BOOK: "/api/sessions/book",
  SESSIONS_MY: "/api/sessions/my",
  SESSIONS_JOIN: (id) => `/api/sessions/${id}/join`,
  SESSIONS_START_CALL: (id) => `/api/sessions/${id}/start-call`,
  SESSIONS_END_CALL: (id) => `/api/sessions/${id}/end-call`,

  // ─── Mobile — Question Bank ───────────────────────────────────────────────────
  QUESTION_BANK_LIST: (courseId) => `/api/courses/${courseId}/question-bank`,
  QUESTION_BANK_CREATE: (courseId) => `/api/courses/${courseId}/question-bank`,
  QUESTION_BANK_UPDATE: (qid) => `/api/question-bank/${qid}`,
  QUESTION_BANK_DELETE: (qid) => `/api/question-bank/${qid}`,

  // ─── Mobile — Daily Questions ─────────────────────────────────────────────────
  DAILY_QUESTIONS_GET: (courseId) => `/api/mobile/daily-questions/${courseId}`,
  DAILY_ANSWERS_SUBMIT: (courseId) => `/api/mobile/daily-answers/${courseId}`,
  DAILY_ANSWERS_HISTORY: (courseId) =>
    `/api/mobile/daily-answers/${courseId}/history`,

  // ─── Mobile — Streaks ─────────────────────────────────────────────────────────
  STREAKS_GET: (courseId) => `/api/mobile/streaks/${courseId}`,
  STREAKS_ALL: "/api/mobile/streaks",

  // ─── Mobile — Push Notifications ─────────────────────────────────────────────
  FCM_TOKEN_REGISTER: "/api/mobile/fcm-token",

  // ─── Mobile — QR Code ────────────────────────────────────────────────────────
  QR_GENERATE: (courseId) => `/api/mobile/qr/generate/${courseId}`,
  QR_SCAN: "/api/mobile/qr/scan",

  // ─── Attendance ───────────────────────────────────────────────────────────────
  ATTENDANCE_SESSIONS_LIST: (courseId) => `/api/sessions/${courseId}`,
  ATTENDANCE_SESSION_RECORDS: (id) => `/api/sessions/${id}/attendance`,
  ATTENDANCE_STUDENT_SUMMARY: (courseId, sid) =>
    `/api/attendance/${courseId}/student/${sid}`,
  ATTENDANCE_MY: (courseId) => `/api/attendance/my/${courseId}`,

  // ─── File Upload ──────────────────────────────────────────────────────────────
  UPLOAD: "/api/upload",
};
