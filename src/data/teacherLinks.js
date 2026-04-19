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
  },
  {
    title: "Upload Videos",
    href: "/teacher/materials/upload", // Generic or specific
    icon: Video,
  },
  {
    title: "Assignments",
    href: "/teacher/assignments", // Ensure this route is correct in actual router
    icon: ClipboardList,
  },
  {
    title: "Quizzes",
    href: "courses/quizzes/create", // Ensure this route is correct in actual router
    icon: HelpCircle,
  },
  {
    title: "Students",
    href: "/teacher/students", // Doesn't exist uniquely yet, maybe they wanted something else, router has nothing like this inside teacher yet
    icon: Users,
  },
  {
    title: "Add Avalabilty",
    href: "/teacher/availability", // Doesn't exist uniquely yet, maybe they wanted something else, router has nothing like this inside teacher yet
    icon: Users,
  },
  {
    title: "My Bookings",
    href: "/teacher/myBookings", // Doesn't exist uniquely yet, maybe they wanted something else, router has nothing like this inside teacher yet
    icon: Users,
  },
  {
    title: "My Availabilits",
    href: "/teacher/availableSlotsPage", // Doesn't exist uniquely yet, maybe they wanted something else, router has nothing like this inside teacher yet
    icon: Users,
  },
  {
    title: "Earnings",
    href: "/teacher/earnings",
    icon: BadgeDollarSign,
  },
  {
    title: "Profile",
    href: "/teacher/profile",
    icon: UserCircle,
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
  {
    title: "Sign Out",
    onClick: () => console.log("Sign Out clicked"),
    icon: LogOut,
    isAction: true,
  },
];
