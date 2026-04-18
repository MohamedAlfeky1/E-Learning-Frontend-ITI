import {
  Wrench,
  CreditCard,
  User,
  BookOpen,
  UserX,
  Users,
  Calendar,
  RotateCcw,
  Lightbulb,
  MessageCircle,
  HelpCircle,
} from "lucide-react";

export const TICKET_CATEGORIES = [
  {
    value: "technical_issue",
    label: "Technical Issue",
    color: "bg-red-100 text-red-600",
    icon: Wrench,
  },
  {
    value: "payment_issue",
    label: "Payment Issue",
    color: "bg-green-100 text-green-600",
    icon: CreditCard,
  },
  {
    value: "account_issue",
    label: "Account Issue",
    color: "bg-yellow-100 text-yellow-600",
    icon: User,
  },
  {
    value: "course_issue",
    label: "Course Issue",
    color: "bg-blue-100 text-blue-600",
    icon: BookOpen,
  },
  {
    value: "teacher_complaint",
    label: "Teacher Complaint",
    color: "bg-orange-100 text-orange-600",
    icon: UserX,
  },
  {
    value: "student_complaint",
    label: "Student Complaint",
    color: "bg-pink-100 text-pink-600",
    icon: Users,
  },
  {
    value: "session_issue",
    label: "Session Issue",
    color: "bg-indigo-100 text-indigo-600",
    icon: Calendar,
  },
  {
    value: "refund_request",
    label: "Refund Request",
    color: "bg-emerald-100 text-emerald-600",
    icon: RotateCcw,
  },
  {
    value: "feature_request",
    label: "Feature Request",
    color: "bg-purple-100 text-purple-600",
    icon: Lightbulb,
  },
  {
    value: "general_inquiry",
    label: "General Inquiry",
    color: "bg-gray-100 text-gray-600",
    icon: MessageCircle,
  },
  {
    value: "other",
    label: "Other",
    color: "bg-slate-100 text-slate-600",
    icon: HelpCircle,
  },
];