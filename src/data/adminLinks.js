import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCheck,
  BookOpen,
  FolderTree,
  Ticket,
  CreditCard,
  BadgeDollarSign,
  Settings,
  Image,
  BarChart3,
  ShieldCheck,
  UserPlus,
  UserCircle,
  HelpCircle,
  LogOut,
} from "lucide-react";

export const adminSidebarLinks = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Teachers",
    href: "/admin/teachers",
    icon: GraduationCap,
  },
  {
    title: "Students",
    href: "/admin/students",
    icon: UserCheck,
  },
  {
    title: "Verifications",
    href: "/admin/verifications",
    icon: ShieldCheck,
  },
  {
    title: "Courses",
    href: "/admin/courses",
    icon: BookOpen,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Enroll Student",
    href: "/admin/enroll",
    icon: UserPlus,
  },
  {
    title: "Vouchers",
    href: "/admin/vouchers",
    icon: Ticket,
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Withdrawals",
    href: "/admin/withdrawals",
    icon: BadgeDollarSign,
  },
  {
    title: "Revenue Config",
    href: "/admin/revenue-config",
    icon: Settings,
  },
  {
    title: "Sliders",
    href: "/admin/sliders",
    icon: Image,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    title: "Profile",
    href: "/admin/profile",
    icon: UserCircle,
  },
];

export const adminBottomLinks = [
  {
    title: "Add Admin",
    href: "/admin/admins/add",
    icon: UserPlus,
  },
  {
    title: "Help Center",
    href: "/admin/help",
    icon: HelpCircle,
  },
  {
    title: "Sign Out",
    onClick: () => console.log("Sign Out clicked"),
    icon: LogOut,
    isAction: true,
  },
];
