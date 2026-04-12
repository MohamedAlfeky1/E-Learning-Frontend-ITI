import {
  LayoutDashboard,
  BookOpen,
  PlayCircle,
  ShoppingCart,
  Heart,
  ClipboardList,
  HelpCircle,
  Receipt,
  UserCircle,
  BrainCircuit,
  MessageSquare,
  CalendarCheck,
  LogOut,
} from "lucide-react";

export const studentSidebarLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Courses",
    href: "/my-courses",
    icon: BookOpen,
  },
  {
    title: "Favorites",
    href: "/favorites",
    icon: Heart,
  },
  {
    title: "Cart",
    href: "/cart",
    icon: ShoppingCart,
  },
  {
    title: "Assignments",
    href: "/assignments",
    icon: ClipboardList,
  },
  {
    title: "Quizzes",
    href: "/quizzes",
    icon: HelpCircle,
  },
  {
    title: "Sessions",
    href: "/sessions",
    icon: CalendarCheck,
  },
  {
    title: "Payment History",
    href: "/payment-history",
    icon: Receipt,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: UserCircle,
  },
];

export const studentBottomLinks = [
  {
    title: "Help Center",
    href: "/help",
    icon: HelpCircle,
  },
  {
    title: "Sign Out",
    onClick: () => console.log("Sign Out clicked"),
    icon: LogOut,
    isAction: true,
  },
];
