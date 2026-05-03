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
    title: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Vouchers",
    href: "/admin/vouchers",
    icon: Ticket,
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
];

export const adminBottomLinks = [
  {
    title: "Add Admin",
    href: "/admin/admins/add",
    icon: UserPlus,
  },
  {
    title: "Help Center",
    href: "/admin/tickets",
    icon: HelpCircle,
  },
];
