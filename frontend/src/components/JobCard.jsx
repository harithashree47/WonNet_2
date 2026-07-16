import {
  MapPin,
  Clock3,
  Clock,
  IndianRupee,
  DollarSign,
  Calendar,
  Heart,
  CheckCircle,
  ArrowRight,
  Building2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const JobCard = ({
  job,
  liked,
  toggleLike,
  isApplied,
  formatSalary,
  formatDeadline,
  formatLocation,
}) => {
  const navigate = useNavigate();

  // Helper to safely render values that might be objects
  const safeString = (val) => {
    if (typeof val === 'string') return val;
    if (typeof val === 'object' && val !== null) {
      if (typeof val.name === 'string') return val.name;
      if (typeof val.city === 'string') return val.city;
      if (typeof val.skill === 'string') return val.skill;
      if (typeof val.title === 'string') return val.title;
      return "N/A";
    }
    return String(val);
  };

  return (
    <div
      className="bg-white rounded-md shadow-sm border border-gray-200 px-4 py-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center gap-4"
    >
      {/* Logo */}
      <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden bg-gray-50">
        <img
          src={
            job.company?.logo ||
            `https://dummyimage.com/80x80/facc15/111827.png&text=${(
              job.company?.name || "C"
            )[0]}`
          }
          alt={safeString(job.company?.name) || "Company"}
          className="w-12 h-12 object-contain"
          onError={(e) =>
            (e.currentTarget.src = `https://dummyimage.com/80x80/facc15/111827.png&text=${(
              job.company?.name || "C"
            )[0]}`)
          }
        />
      </div>

      {/* Info */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-base md:text-lg font-bold text-primary">
            {safeString(job.title)}
          </h3>
          {isApplied && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <CheckCircle size={10} />
              Applied
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs md:text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin size={13} className="text-accent" />
            {formatLocation(job)}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} className="text-accent" />
            {safeString(job.jobType?.name || job.jobType)}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign size={13} className="text-accent" />
            {formatSalary(job)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:items-end gap-2">
        <div className="flex items-center gap-3">
          {/* Like */}
          <button
            onClick={() => toggleLike(job.id)}
            className="text-gray-400 hover:text-red-500 transition"
          >
            <Heart
              size={20}
              fill={liked[job.id] ? "#ef4444" : "none"}
              className={liked[job.id] ? "text-red-500" : ""}
            />
          </button>

          {/* View More */}
          <Link
            to={`/jobs/${job.id}`}
            className="bg-accent text-primary text-xs md:text-sm px-4 py-2 rounded-md font-semibold hover:bg-yellow-300 transition text-center"
          >
            View More
          </Link>

          {/* Apply */}
          {isApplied ? (
            <button
              onClick={() => navigate("/my-applications")}
              className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs md:text-sm px-4 py-2 rounded-md font-semibold hover:bg-emerald-100 transition inline-flex items-center gap-1"
            >
              <CheckCircle size={14} />
              Applied
            </button>
          ) : (
            <button
              onClick={() => navigate(`/apply/${job.id}`)}
              className="bg-primary text-white text-xs md:text-sm px-4 py-2 rounded-md font-semibold hover:bg-accent hover:text-primary transition"
            >
              Apply Now
            </button>
          )}
        </div>

        {/* Deadline */}
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <Calendar size={12} className="text-accent" />
          Date Line: {formatDeadline(job.applyDeadline)}
        </span>
      </div>
    </div>
  );
};

export default JobCard;