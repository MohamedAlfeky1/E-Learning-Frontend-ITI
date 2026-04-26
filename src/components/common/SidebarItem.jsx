import { NavLink } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const SidebarItem = ({ item, variant = "primary", isCollapsed, onClick }) => {
  const Icon = item.icon;

  // Shared icon renderer
  const renderIcon = (isActive = false) => (
    <Icon 
      className={`shrink-0 transition-colors duration-200 ${
        isCollapsed ? "w-[20px] h-[20px]" : "w-[18px] h-[18px]"
      } ${
        isActive || item.isActive 
          ? "text-indigo-600" 
          : "text-slate-400 group-hover/item:text-indigo-500"
      }`} 
    />
  );

  // Shared label renderer
  const renderLabel = () => {
    if (isCollapsed) return null;
    return (
      <span className="truncate text-[13px] leading-none">
        {item.title}
      </span>
    );
  };

  // Shared class builder
  const baseClasses = `group/item flex items-center transition-all duration-200 rounded-lg ${
    isCollapsed 
      ? "w-10 h-10 mx-auto justify-center" 
      : "w-full gap-3 px-3 py-2.5"
  }`;

  let element;

  if (item.isAction) {
    // ── Action button (Sign Out, etc.) ──
    element = (
      <button
        onClick={(e) => {
          item.onClick?.(e);
          onClick?.(e);
        }}
        className={`${baseClasses} font-medium text-slate-500 hover:text-red-600 hover:bg-red-50`}
      >
        {renderIcon()}
        {renderLabel()}
      </button>
    );
  } else if (variant === "primary") {
    // ── Primary nav link ──
    element = (
      <NavLink
        to={item.href}
        end={item.exact}
        onClick={onClick}
        className={({ isActive }) =>
          `${baseClasses} font-medium ${
            isActive || item.isActive
              ? "bg-indigo-50 text-indigo-700 shadow-[inset_3px_0_0_0_theme(colors.indigo.500)]"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`
        }
      >
        {({ isActive }) => (
          <>
            {renderIcon(isActive)}
            {renderLabel()}
          </>
        )}
      </NavLink>
    );
  } else {
    // ── Secondary nav link ──
    element = (
      <NavLink
        to={item.href}
        end={item.exact}
        onClick={onClick}
        className={({ isActive }) =>
          `${baseClasses} font-medium ${
            isActive || item.isActive 
              ? "bg-indigo-50 text-indigo-700" 
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
          }`
        }
      >
        {({ isActive }) => (
          <>
            {renderIcon(isActive)}
            {renderLabel()}
          </>
        )}
      </NavLink>
    );
  }

  // ── Wrap with tooltip when collapsed ──
  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {element}
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          sideOffset={12}
          className="font-medium text-xs"
        >
          {item.title}
        </TooltipContent>
      </Tooltip>
    );
  }

  return element;
};

export default SidebarItem;
