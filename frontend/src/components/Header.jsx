import React, { useState, useEffect } from "react";
import { Menu, X, Globe2, Heart } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { getMyWishlist } from "../api/wishlist";
import { getUserProfile } from "../api/auth";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("user@example.com");

  // ✅ Check token
  const token = localStorage.getItem("access_token");

  // Listen for wishlist updates from other components
  useEffect(() => {
    const handleWishlistUpdate = () => {
      if (!token) return;
      getMyWishlist().then((wishlistResult) => {
        if (wishlistResult.success) {
          setWishlistCount(wishlistResult.data.data?.length || 0);
        }
      }).catch(() => {});
    };

    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlist-updated', handleWishlistUpdate);
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      
      try {
        // Fetch wishlist count
        const wishlistResult = await getMyWishlist();
        if (wishlistResult.success) {
          setWishlistCount(wishlistResult.data.data?.length || 0);
        }

        // Fetch user profile
        const profileResult = await getUserProfile();
        if (profileResult && profileResult.name) {
          setUserName(profileResult.name || "User");
          setUserEmail(profileResult.email || "user@example.com");
        }
      } catch (error) {
        // Silently fail
      }
    };
    fetchData();
  }, [token, pathname]);

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
    { label: "My Wishlist", href: "/my-wishlist", icon: Heart },
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
            {navLinks.map((link) => {
              const isWishlistLink = link.href === "/my-wishlist";
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative flex items-center gap-1.5 pb-1 font-medium transition-all duration-300 ${
                    isWishlistLink
                      ? isActive(link.href)
                        ? "text-accent"
                        : "text-gray-700 hover:text-accent"
                      : isActive(link.href)
                        ? "text-accent"
                        : "text-gray-700 hover:text-accent"
                  }`}
                >
                  {link.icon && (
                    <span className="relative">
                      <link.icon 
                        size={18} 
                        className={isWishlistLink 
                          ? isActive(link.href) 
                            ? "text-accent" 
                            : "text-gray-500"
                          : isActive(link.href) 
                            ? "text-accent" 
                            : "text-gray-500"
                        } 
                        strokeWidth={isWishlistLink && isActive(link.href) ? 2.5 : 2}
                      />
                      {isWishlistLink && wishlistCount > 0 && (
                        <span className="absolute -top-1.5 -right-2 bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center border-2 border-white shadow-lg">
                          {wishlistCount > 99 ? '99+' : wishlistCount}
                        </span>
                      )}
                    </span>
                  )}
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] rounded-full transition-all duration-300 ${
                      isActive(link.href) 
                        ? "w-full bg-accent" 
                        : "w-0"
                    }`}
                  />
                </Link>
              );
            })}

            {/* ✅ Login / Logout */}
            {token ? (
              <button
                onClick={handleLogout}
                className="ml-2 inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-primary hover:bg-yellow-300 transition"
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
      </div>

      {/* Mobile Menu - Right Side Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/40 z-40 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="md:hidden fixed right-0 top-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300">
            <div className="flex flex-col h-full">
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-accent/5 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-accent border border-accent/60">
                    <Globe2 size={20} />
                  </div>
                  <div className="leading-tight">
                    <span className="block text-base font-bold text-primary">
                      Won<span className="text-accent">Net!</span>
                    </span>
                    
                  </div>
                </div>
                <button
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto px-4 py-5">
                {/* User Info Section */}
                <div className="mb-5 pb-5 border-b border-gray-100">
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">
                        {token ? userName.charAt(0).toUpperCase() : "G"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-primary truncate">
                        {token ? userName : "Guest"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {token ? userEmail : "Not logged in"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-2">
                  {navLinks.map((link) => {
                    const isActiveLink = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                          isActiveLink
                            ? "bg-accent text-primary shadow-md"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.icon && (
                          <link.icon 
                            size={20} 
                            className={isActiveLink 
                              ? "text-primary" 
                              : "text-gray-400"
                            } 
                          />
                        )}
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Footer */}
              <div className="px-4 py-4 border-t border-gray-100 bg-gradient-to-t from-accent/5 to-transparent">
                {token ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full bg-accent text-primary text-sm font-bold px-4 py-3 rounded-xl hover:bg-yellow-300 transition shadow-sm"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="block w-full text-center bg-accent text-primary text-sm font-bold px-4 py-3 rounded-xl hover:bg-yellow-300 transition shadow-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;