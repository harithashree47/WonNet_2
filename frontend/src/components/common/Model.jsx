import { useEffect } from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  // close on ESC key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal box */}
      <div
        className={`relative w-full ${sizes[size]} bg-white rounded-xl shadow-2xl overflow-hidden animate-fade-up`}
        data-aos="fade-up"
      >
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-accent" />

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-primary">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-primary transition"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Close button (when no title) */}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-primary transition z-10"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        )}

        {/* Body */}
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;