// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { Globe2, Mail, MapPin, Phone, Share2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-primary via-slate-900 to-primary mt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10">
          {/* Brand - Modern Left Side */}
          <div className="md:w-1/3 space-y-6">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-accent border border-accent/60">
                <Globe2 size={22} />
              </div>
              <span className="text-xl font-bold text-white">
                Won<span className="text-accent">Net!</span>
              </span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed max-w-xs">
              Your trusted partner in finding the perfect job. We connect talented professionals with leading companies worldwide.
            </p>
            <div className="flex gap-2">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent/20 flex items-center justify-center text-gray-300 hover:text-accent transition-all hover:scale-110">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent/20 flex items-center justify-center text-gray-300 hover:text-accent transition-all hover:scale-110">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent/20 flex items-center justify-center text-gray-300 hover:text-accent transition-all hover:scale-110">
                <Share2 size={16} />
              </a>
            </div>
          </div>

          {/* Links - Modern Center Section */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-accent uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li>
                  <Link to="/" className="hover:text-accent transition-colors inline-flex items-center gap-2 group">
                    <span className="w-0 h-0 group-hover:w-1 group-hover:h-1 rounded-full bg-accent transition-all" />
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/jobs" className="hover:text-accent transition-colors inline-flex items-center gap-2 group">
                    <span className="w-0 h-0 group-hover:w-1 group-hover:h-1 rounded-full bg-accent transition-all" />
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-accent transition-colors inline-flex items-center gap-2 group">
                    <span className="w-0 h-0 group-hover:w-1 group-hover:h-1 rounded-full bg-accent transition-all" />
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-accent transition-colors inline-flex items-center gap-2 group">
                    <span className="w-0 h-0 group-hover:w-1 group-hover:h-1 rounded-full bg-accent transition-all" />
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-accent transition-colors inline-flex items-center gap-2 group">
                    <span className="w-0 h-0 group-hover:w-1 group-hover:h-1 rounded-full bg-accent transition-all" />
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-accent uppercase tracking-wider">
                Contact Us
              </h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <Phone size={16} className="text-accent mt-0.5 flex-shrink-0" />
                  <span>+1 (123) 456‑7890</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail size={16} className="text-accent mt-0.5 flex-shrink-0" />
                  <span>support@wonnet.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="text-accent mt-0.5 flex-shrink-0" />
                  <span>Remote • Global</span>
                </li>
              </ul>
            </div>

            {/* Social Share */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-accent uppercase tracking-wider">
                Follow Us
              </h4>
              <div className="flex gap-2">
                <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent/20 flex items-center justify-center text-gray-300 hover:text-accent transition-all hover:scale-110" aria-label="LinkedIn">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent/20 flex items-center justify-center text-gray-300 hover:text-accent transition-all hover:scale-110" aria-label="Twitter">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent/20 flex items-center justify-center text-gray-300 hover:text-accent transition-all hover:scale-110" aria-label="Share">
                  <Share2 size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar with modern gradient line */}
        <div className="relative mt-12 pt-8">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} WonNet. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-gray-400">
              <Link to="/terms" className="hover:text-accent transition-colors">Terms</Link>
              <Link to="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
              <a href="#" className="hover:text-accent transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;