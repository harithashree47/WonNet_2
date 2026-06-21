import React, { useState } from "react";
import { Menu, X, Globe2 } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // ✅ Check token
  const token = localStorage.getItem("access_token");

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Jobs", href: "/jobs" },
    { label: "My Applications", href: "/my-applications" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-gray-50/95 backdrop-blur shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-18 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-3">
            <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-primary text-accent border border-accent/60">
              <Globe2 size={22} />
            </div>
            <div className="leading-tight">
              <span className="block text-lg md:text-xl font-semibold text-primary">
                Won<span className="text-accent">Net!</span>
              </span>
              <span className="hidden md:block text-[11px] text-gray-500">
                Smart Job & Talent Network
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative pb-1 font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-accent"
                    : "text-gray-700 hover:text-accent"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] bg-accent rounded-full transition-all duration-300 ${
                    isActive(link.href) ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            ))}

            {/* ✅ Login / Logout */}
            {token ? (
              <button
                onClick={handleLogout}
                className="ml-2 inline-flex items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="ml-2 inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-primary hover:bg-yellow-300 transition"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center text-primary"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-gray-50 border-t border-gray-200 px-4 pb-4 pt-2 space-y-2 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`block rounded-md px-2 py-2 font-medium ${
                  isActive(link.href)
                    ? "bg-accent/10 text-accent"
                    : "text-gray-700 hover:bg-gray-100 hover:text-accent"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* ✅ Mobile Login / Logout */}
            {token ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="mt-2 block w-full rounded-md bg-red-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-red-600"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="mt-2 block rounded-md bg-accent px-3 py-2 text-center text-sm font-semibold text-primary hover:bg-yellow-300"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;