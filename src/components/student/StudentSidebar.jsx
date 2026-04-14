import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { studentSidebarLinks, studentBottomLinks } from "@/data/studentLinks";
import SidebarItem from "@/components/common/SidebarItem";
import { X, GraduationCap } from "lucide-react";

const StudentSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Close sidebar on path change (mobile)
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between py-6 overflow-y-auto transform transition-transform duration-300 ease-in-out z-50 shadow-xl lg:shadow-none lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Brand & Top Links */}
      <div>
        <div className="px-6 mb-8 flex items-center justify-between">
          <NavLink to="/" className="flex flex-col group">
            <span className="text-2xl font-black text-indigo-600 flex items-center gap-2 tracking-tight group-hover:text-indigo-700 transition-colors">
              Nexora
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 ">
              Student Portal
            </span>
          </NavLink>
          <button
            className="lg:hidden text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col space-y-1.5 px-3">
          {studentSidebarLinks.map((link, index) => {
            const isActive =
              (location.pathname.startsWith(link.href) &&
                link.href !== "/dashboard") ||
              location.pathname === link.href;
            return (
              <div onClick={handleLinkClick} key={index}>
                <SidebarItem item={{ ...link, isActive }} variant="primary" />
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="px-3 mt-8 flex flex-col gap-2 border-t border-slate-100 pt-6">
        {studentBottomLinks.map((link, index) => (
          <div onClick={handleLinkClick} key={index}>
            <SidebarItem item={link} variant="secondary" />
          </div>
        ))}
      </div>
    </aside>
  );
};

export default StudentSidebar;
