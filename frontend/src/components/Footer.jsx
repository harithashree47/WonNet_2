// src/components/Footer.jsx
import { Globe2, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary mt-12">
      {/* Top */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-accent border border-accent/70">
              <Globe2 size={20} />
            </div>
            <span className="text-lg font-semibold text-white">
              Won<span className="text-accent">Net</span>
            </span>
          </div>
          <p className="text-sm text-gray-400">
            WonNet connects talented candidates with top employers around the
            world. Discover jobs, manage applications, and grow your career in
            one place.
          </p>
        </div>

        {/* Company links */}
        <div>
          <h4 className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">
            Company
          </h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <a href="/about" className="hover:text-accent transition">
                About Us
              </a>
            </li>
            <li>
              <a href="/employers" className="hover:text-accent transition">
                For Employers
              </a>
            </li>
            <li>
              <a href="/pricing" className="hover:text-accent transition">
                Pricing
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-accent transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Job seekers */}
        <div>
          <h4 className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">
            Job Seekers
          </h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <a href="/jobs" className="hover:text-accent transition">
                Browse Jobs
              </a>
            </li>
            <li>
              <a href="/categories" className="hover:text-accent transition">
                Job Categories
              </a>
            </li>
            <li>
              <a href="/profile" className="hover:text-accent transition">
                My Profile
              </a>
            </li>
            <li>
              <a href="/applications" className="hover:text-accent transition">
                My Applications
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">
            Contact
          </h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-accent" />
              <span>+1 (123) 456‑7890</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-accent" />
              <span>support@wonnet.com</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-accent" />
              <span>Remote • Global</span>
            </li>
          </ul>
        </div>
      </div>

    {/* Bottom bar */}
<div className="border-t border-slate-800">
  <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-center text-xs text-gray-500">
    <span>
      © {new Date().getFullYear()} WonNet. All rights reserved.
    </span>
  </div>
</div>
    </footer>
  );
};

export default Footer;