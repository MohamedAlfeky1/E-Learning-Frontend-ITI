import { NavLink, useNavigate } from "react-router-dom";
import { studentSidebarLinks, studentBottomLinks } from "@/data/studentLinks";
import SidebarItem from "@/components/common/SidebarItem";

const StudentSidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-slate-50 border-r flex flex-col justify-between py-6 overflow-y-auto">
      {/* Brand & Top Links */}
      <div>
        <div className="px-6 mb-8">
          <NavLink to="/" className="flex flex-col">
            <span className="text-2xl font-bold text-indigo-600">Nexora</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Portal</span>
          </NavLink>
        </div>

        <nav className="flex flex-col space-y-1">
          {studentSidebarLinks.map((link, index) => (
            <SidebarItem key={index} item={link} variant="primary" />
          ))}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="px-6 mt-8 flex flex-col gap-4">
        {studentBottomLinks.map((link, index) => (
          <SidebarItem key={index} item={link} variant="secondary" />
        ))}
      </div>
    </aside>
  );
};

export default StudentSidebar;
