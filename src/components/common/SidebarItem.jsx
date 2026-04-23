import { NavLink } from "react-router-dom";

const SidebarItem = ({ item, variant = "primary" }) => {
  const Icon = item.icon;

  if (item.isAction) {
    return (
      <button
        onClick={item.onClick}
        className={`flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all w-full text-left`}
      >
        <Icon className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
        {item.title}
      </button>
    );
  }

  if (variant === "primary") {
    return (
      <NavLink
        to={item.href}
        className={({ isActive }) =>
          `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
            isActive || item.isActive
              ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Icon className={`w-5 h-5 transition-colors ${isActive || item.isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500"}`} />
            {item.title}
          </>
        )}
      </NavLink>
    );
  }

  return (
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
          isActive || item.isActive ? "text-indigo-700 bg-indigo-50" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={`w-5 h-5 transition-colors ${isActive || item.isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`} />
          {item.title}
        </>
      )}
    </NavLink>
  );
};

export default SidebarItem;
