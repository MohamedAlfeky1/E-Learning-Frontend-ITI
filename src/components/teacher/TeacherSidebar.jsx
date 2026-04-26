import { NavLink } from "react-router-dom";
import { teacherSidebarLinks, teacherBottomLinks } from "@/data/teacherLinks";
import SidebarItem from "@/components/common/SidebarItem";
import { ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const TeacherSidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-screen bg-white border-r border-slate-200/80 flex flex-col z-50 transition-all duration-300 ease-in-out overflow-hidden
          ${isCollapsed ? "md:w-[72px]" : "md:w-[260px]"}
          ${isMobileOpen ? "translate-x-0 w-[260px] shadow-2xl" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* ─── Brand ─── */}
        <div className={`flex items-center shrink-0 h-16 border-b border-slate-100 transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "justify-between px-5"}`}>
          <NavLink 
            to="/" 
            className={`flex flex-col overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? "items-center" : ""}`}
          >
            {/* Logo mark */}
            <span className={`font-black text-indigo-600 tracking-tight transition-all duration-300 ${isCollapsed ? "text-[13px] uppercase" : "text-2xl"}`}>
              Nexora
            </span>
            {!isCollapsed && (
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mt-0.5">
                Teacher Portal
              </span>
            )}
          </NavLink>

          {/* Mobile Close */}
          <button 
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsMobileOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* ─── Navigation ─── */}
        <div className="flex-1 flex flex-col min-h-0 pt-4">
          {!isCollapsed && (
            <p className="px-5 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
              Menu
            </p>
          )}

          <nav className={`flex-1 flex flex-col overflow-y-auto overflow-x-hidden scrollbar-thin ${isCollapsed ? "px-2 items-center gap-5" : "px-3 gap-0.5"}`}>
            {teacherSidebarLinks.map((link, index) => (
              <SidebarItem 
                key={index} 
                item={link} 
                variant="primary" 
                isCollapsed={isCollapsed} 
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setIsMobileOpen(false);
                  }
                }}
              />
            ))}
          </nav>
        </div>

        {/* ─── Bottom Section ─── */}
        <div className={`shrink-0 border-t border-slate-100 pt-3 pb-4 flex flex-col ${isCollapsed ? "px-2 items-center gap-1.5" : "px-3 gap-0.5"}`}>
          {!isCollapsed && (
            <p className="px-2 mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
              Support
            </p>
          )}

          {teacherBottomLinks.map((link, index) => (
            <SidebarItem 
              key={index} 
              item={link} 
              variant="secondary" 
              isCollapsed={isCollapsed} 
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsMobileOpen(false);
                }
              }}
            />
          ))}

          {/* Collapse Toggle */}
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setIsCollapsed(false)}
                  className="mt-2 w-10 h-10 mx-auto flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                >
                  <ChevronsRight size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2 font-semibold">
                Expand sidebar
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={() => setIsCollapsed(true)}
              className="hidden md:flex mt-2 mx-2 items-center gap-2 justify-center h-9 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition-all duration-200"
            >
              <ChevronsLeft size={16} />
              <span className="text-xs font-semibold">Collapse</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default TeacherSidebar;
