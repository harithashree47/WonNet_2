import React, { useState } from "react";
import { Phone, Mail, MapPin, Menu, X } from "lucide-react";
import logo from "../assets/logo.jfif";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50">

    {/* ✅ Top Bar */}
<div className="bg-white text-sm shadow-sm">
  <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
    
    <div className="flex items-center space-x-2">
      <Phone size={16} className="text-accent" />
      <span className="text-primary">
        Hotline: 0123-456-789
      </span>
    </div>

    <div className="flex items-center space-x-4">
      <Mail
        size={16}
        className="text-accent cursor-pointer hover:opacity-70 transition"
      />
      <MapPin
        size={16}
        className="text-accent cursor-pointer hover:opacity-70 transition"
      />
    </div>
  </div>
</div>

      {/* ✅ Main Navbar */}
      <header className="bg-primary shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-white">
          
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="WonNet Logo"
              className="h-10 w-10 object-contain"
            />
            <h1 className="text-2xl font-bold">
              Won
              <span className="text-accent">Net!</span>
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="hover:text-accent transition">Home</a>
            <a href="/jobs" className="hover:text-accent transition">Jobs</a>
            <a href="/applications" className="hover:text-accent transition">
              My Applications
            </a>
            <a
              href="/login"
              className="bg-accent text-black px-4 py-2 rounded-md font-semibold hover:opacity-90 transition"
            >
              Login
            </a>
          </nav>

          <div className="md:hidden text-white">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-primary px-6 py-4 space-y-4 text-white">
            <a href="/" className="block hover:text-accent">Home</a>
            <a href="/jobs" className="block hover:text-accent">Jobs</a>
            <a href="/applications" className="block hover:text-accent">
              My Applications
            </a>
            <a
              href="/login"
              className="block bg-accent text-black px-4 py-2 rounded-md font-semibold text-center"
            >
              Login
            </a>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;