import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, UserRound, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getCurrentUser,
  isAuthenticated,
  logoutUser,
} from "../services/authService";
import ThemeToggle from "./ThemeToggle.jsx";

const navigation = [
  { name: "Home", path: "/" },
  { name: "Report Complaint", path: "/report" },
  { name: "Track Complaint", path: "/track" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "About Us", path: "/about" },
  { name: "Contact Us", path: "/contact" },
];

function Navbar() {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const loggedIn = isAuthenticated();
  const user = getCurrentUser();

  const isAdminUser = user?.role === "admin" || user?.role === "officer";

  const visibleNavigation = navigation.filter((item) => {
    if (isAdminUser && item.path === "/report") {
      return false;
    }

    return true;
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-shadow dark:border-zinc-800 dark:bg-zinc-950/95 ${scrolled ? "shadow-sm" : ""
        }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="shrink-0 leading-none"
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="block text-xl font-extrabold tracking-tight text-navy dark:text-white sm:text-2xl">
            CityPulse <span className="text-orange dark:text-teal-300">AI</span>
          </span>

          <span className="mt-1 hidden text-[10px] font-medium tracking-[0.18em] text-slate-500 dark:text-zinc-400 sm:block">
            SMART CITIES. SMARTER FUTURE.
          </span>
        </Link>

        <nav className="hidden items-center gap-5 xl:flex">
          {visibleNavigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative whitespace-nowrap py-7 text-sm font-medium transition-colors ${isActive
                  ? "text-navy dark:text-white"
                  : "text-slate-600 hover:text-navy dark:text-zinc-300 dark:hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-orange transition-all duration-200 dark:bg-teal-300 ${isActive ? "w-full" : "w-0"
                      }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <ThemeToggle />

          {loggedIn ? (
            <>
              <span className="max-w-36 truncate text-sm font-semibold text-slate-600 dark:text-zinc-300">
                {user?.fullName || "Citizen"}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-950/40"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-lg border border-navy/30 px-4 py-2.5 text-sm font-semibold text-navy transition-all hover:bg-navy hover:text-white dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-blue-700"
            >
              <UserRound size={18} />
              Login
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <ThemeToggle />

          <button
            type="button"
            className="rounded-lg p-2 text-navy transition hover:bg-slate-100 dark:text-white dark:hover:bg-zinc-800"
            onClick={() => setMobileMenuOpen((previous) => !previous)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-slate-200 bg-white transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-950 xl:hidden ${mobileMenuOpen ? "max-h-[650px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <nav className="flex flex-col gap-1 px-4 py-4 sm:px-6">
          {visibleNavigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-4 py-3 text-sm font-medium transition ${isActive
                  ? "bg-blue-50 font-semibold text-navy dark:bg-teal-950/40 dark:text-white"
                  : "text-slate-600 hover:bg-slate-50 hover:text-navy dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          {loggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <LogOut size={18} />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              <UserRound size={18} />
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;