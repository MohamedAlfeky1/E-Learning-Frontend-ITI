import { NavLink as RouterNavLink } from "react-router-dom";

const NavLink = ({ to, children, end = false, onClick, className = "" }) => {
  return (
    <RouterNavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `text-sm font-medium transition-colors duration-200 ${
          isActive
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        } ${className}`
      }
    >
      {children}
    </RouterNavLink>
  );
};

export default NavLink;
