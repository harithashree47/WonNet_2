import { Link } from "react-router-dom";
import { Globe2, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="text-center max-w-lg">
        {/* Premium 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[180px] font-bold bg-gradient-to-br from-primary via-slate-700 to-slate-900 bg-clip-text text-transparent leading-none tracking-tighter">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-accent to-yellow-300 rounded-full opacity-20 blur-2xl animate-pulse" />
          </div>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent to-yellow-300 rounded-full blur-lg opacity-40" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-slate-800 text-accent shadow-2xl">
              <Globe2 size={40} strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-500 text-lg mb-10 leading-relaxed">
          Oops! The page you're looking for seems to have wandered off. 
          Let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent text-primary font-bold rounded-xl hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Home size={18} />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-primary font-bold rounded-xl border-2 border-gray-200 hover:border-accent hover:bg-accent/5 transition-all"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        {/* Bottom decoration */}
        <div className="mt-16 flex items-center justify-center gap-2 text-sm text-gray-400">
          <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
};

export default NotFound;