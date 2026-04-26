import {
  LayoutDashboard,
  PlusCircle,
  Library,
  Video,
  ClipboardList,
  HelpCircle,
  Users,
  BadgeDollarSign,
  UserCircle,
  Megaphone,
  LogOut,
  MessageSquare,
  FileQuestion,
  CalendarPlus,
  CalendarCheck,
  CalendarDays,
} from "lucide-react";

export const teacherSidebarLinks = [
  {
    title: "Dashboard",
    href: "/teacher/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Chats",
    href: "/teacher/chats",
    icon: MessageSquare,
  },
  {
    title: "Create Course",
    href: "/teacher/courses/create",
    icon: PlusCircle,
  },
  {
    title: "Manage Courses",
    href: "/teacher/courses",
    icon: Library,
    exact: true,
  },
  {
    title: "Upload Videos",
    href: "/teacher/materials/upload", 
    icon: Video,
  },
  {
    title: "Assignments",
    href: "/teacher/assignments",
    icon: ClipboardList,
  },
  {
    title: "Quizzes",
    href: "courses/quizzes/create", 
    icon: FileQuestion,
  },
  {
    title: "Students",
    href: "/teacher/students", 
    icon: Users,
  },
  {
    title: "Add Availability",
    href: "/teacher/availability", 
    icon: CalendarPlus,
  },
  {
    title: "Bookings",
    href: "/teacher/myBookings", 
    icon: CalendarCheck,
  },
  {
    title: "Availabilities",
    href: "/teacher/availableSlotsPage", 
    icon: CalendarDays,
  },
  {
    title: "Earnings",
    href: "/teacher/earnings",
    icon: BadgeDollarSign,
  },
];

export const teacherBottomLinks = [
  // {
  //   title: "New Announcement",
  //   onClick: () => console.log('New Announcement clicked'),
  //   icon: Megaphone,
  //   isButton: true,
  // },
  {
    title: "Help Center",
    href: "/teacher/tickets",
    icon: HelpCircle,
  },
  // {
  //   title: "Sign Out",
  //   onClick: () => console.log("Sign Out clicked"),
  //   icon: LogOut,
  //   isAction: true,
  // },
];
