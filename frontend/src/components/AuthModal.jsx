import { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

export const AuthModal = ({ open, onClose, initialMode = "login" }) => {
  const [mode, setMode] = useState(initialMode);

  if (!open) return null;

  const switchToSignup = () => setMode("signup");
  const switchToLogin = () => setMode("login");

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Subtle glassmorphism backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Clean glassmorphism modal card */}
      <div className="relative w-full max-w-[420px] bg-white/90 rounded-[1.5rem] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden border border-white/50">
        {/* Minimal top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-accent to-yellow-200" />
        
        {/* Elegant close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-10 w-11 h-11 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100 transition-all duration-300 hover:rotate-90 hover:scale-110 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-red-500 transition-colors">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 py-6">
          {mode === "login" ? (
            <Login onSwitchToSignup={switchToSignup} onClose={onClose} />
          ) : (
            <Signup onSwitchToLogin={switchToLogin} onClose={onClose} />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AuthModal;