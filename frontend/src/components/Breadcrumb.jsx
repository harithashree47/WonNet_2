import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumb = ({ items }) => {
  return (
    <div
      className="relative py-14 px-4 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-primary/80" />

      <div className="relative max-w-7xl mx-auto">
        {/* Page title */}
        <h1
          className="text-2xl md:text-3xl font-bold text-white mb-3"
          data-aos="fade-up"
        >
          {items[items.length - 1].label}
        </h1>

        {/* Breadcrumb trail */}
        <nav
          className="flex items-center flex-wrap gap-1 text-sm"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <Link
            to="/"
            className="flex items-center gap-1 text-gray-300 hover:text-accent transition"
          >
            <Home size={14} />
            Home
          </Link>

          {items.map((item, index) => (
            <span key={index} className="flex items-center gap-1">
              <ChevronRight size={14} className="text-gray-400" />
              {item.href && index !== items.length - 1 ? (
                <Link
                  to={item.href}
                  className="text-gray-300 hover:text-accent transition"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-accent font-medium">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;