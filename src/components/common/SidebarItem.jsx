import { NavLink } from "react-router-dom";

const SidebarItem = ({ item, variant = "primary" }) => {
  const Icon = item.icon;

  if (item.isAction) {
    return (
      <button
        onClick={item.onClick}
        className={`flex items-center gap-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors w-full text-left ${variant === "primary" ? "px-6" : ""}`}
      >
        <Icon className="w-5 h-5" />
        {item.title}
      </button>
    );
  }

  if (variant === "primary") {
    return (
      <NavLink
        to={item.href}
        className={({ isActive }) =>
          `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
            isActive
              ? "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`
        }
      >
        <Icon className="w-5 h-5" />
        {item.title}
      </NavLink>
    );
  }

  return (
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        `flex items-center gap-3 py-2 text-sm font-medium transition-colors ${
          isActive ? "text-indigo-700" : "text-slate-600 hover:text-slate-900"
        }`
      }
    >
      <Icon className="w-5 h-5" />
      {item.title}
    </NavLink>
  );
};

export default SidebarItem;
