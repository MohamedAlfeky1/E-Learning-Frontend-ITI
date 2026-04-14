import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Settings, Menu, X } from "lucide-react";
import { useUserQuery } from "@/queries/authQueries";
import { useLogout } from "@/hooks/useLogout";
import Logo from "@/components/common/Logo";
import NavLink from "@/components/common/NavLink";
import SearchBar from "@/components/common/SearchBar";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/courses", label: "Courses" },
  { to: "/about", label: "About" },
];

const ROLE_DASHBOARD = {
  admin: "/admin/dashboard",
  teacher: "/teacher/dashboard",
  student: "/dashboard",
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: user } = useUserQuery();
  const handleLogout = useLogout();

  const dashboardPath = user ? ROLE_DASHBOARD[user.role] || "/" : "/";

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* ── Left: Logo + Nav ── */}
        <div className="flex items-center gap-8">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* ── Center: Search ── */}
        <SearchBar className="hidden sm:flex w-full max-w-xs" />

        {/* ── Right: Actions ── */}
        <div className="flex items-center gap-1">
          {user && (
            <Link
              to="/cart"
              title="Cart"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200"
            >
              <ShoppingCart size={18} />
            </Link>
          )}

          {/* Auth Area */}
          {user ? (
            <div className="hidden md:flex items-center gap-2 ml-2">
              <Link
                to={dashboardPath}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                title="Go to Dashboard"
              >
                {user.name?.[0]?.toUpperCase() || "U"}
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 text-sm font-medium rounded-full border border-border text-foreground hover:bg-accent transition-colors duration-200 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 ml-2">
              <Link
                to="/login"
                className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-5 py-1.5 text-sm font-medium rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity duration-200 shadow-sm shadow-primary/25"
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200"
            title="Toggle menu"
            type="button"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Dropdown ── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
            {/* Mobile search */}
            <SearchBar className="sm:hidden flex" />

            {/* Mobile nav links */}
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-accent"
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Mobile auth */}
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              {user ? (
                <>
                  <Link
                    to={dashboardPath}
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center px-4 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-accent transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center px-4 py-2.5 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-accent transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center px-4 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
