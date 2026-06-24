import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Heart,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { getPublishedJobs } from "../api/job";
import { checkApplication } from "../api/application";
import { getActiveJobTypes } from "../api/jobtype";
import { addToWishlist, removeFromWishlist, getMyWishlist } from "../api/wishlist";

const JobListing = () => {
  const [activeTab, setActiveTab] = useState("Featured");
  const [liked, setLiked] = useState({});
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState({});
  const [jobTypes, setJobTypes] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await getPublishedJobs();
      if (res.success) {
        setJobs(res.data);
        // Check application status for each job
        const token = localStorage.getItem('access_token');
        if (token) {
          const checkPromises = res.data.map(async (job) => {
            const checkRes = await checkApplication(job.id);
            if (checkRes.success) {
              return { jobId: job.id, hasApplied: checkRes.data.hasApplied };
            }
            return { jobId: job.id, hasApplied: false };
          });
          const results = await Promise.all(checkPromises);
          const appliedMap = {};
          results.forEach(({ jobId, hasApplied }) => {
            appliedMap[jobId] = hasApplied;
          });
          setAppliedJobs(appliedMap);
        }
      }
    };
    fetchJobs();

    const fetchJobTypes = async () => {
      const res = await getActiveJobTypes();
      if (res.success && res.data) {
        setJobTypes(res.data);
      }
    };
    fetchJobTypes();
  }, []);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      const token = localStorage.getItem('access_token');
      if (!token || jobs.length === 0) return;
      
      // Use single API call instead of per-job requests
      const res = await getMyWishlist(1, 1000);
      if (res.success && res.data?.data) {
        const wishlistMap = {};
        res.data.data.forEach((item) => {
          wishlistMap[item.jobId] = true;
        });
        setLiked(wishlistMap);
      }
    };

    checkWishlistStatus();
  }, [jobs]);

  const filtered =
    activeTab === "Featured"
      ? jobs
      : jobs.filter((j) => j.jobType?.name === activeTab);

  const tabsToDisplay = ["Featured", ...jobTypes.map((jt) => jt.name)];

  const toggleLike = async (id) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error("Please login to save jobs to wishlist");
      return;
    }

    setWishlistLoading(prev => ({ ...prev, [id]: true }));
    try {
      if (liked[id]) {
        const res = await removeFromWishlist(id);
        if (res.success) {
          setLiked(prev => ({ ...prev, [id]: false }));
          window.dispatchEvent(new Event('wishlist-updated'));
          toast.success("Removed from wishlist");
        }
      } else {
        const res = await addToWishlist(id);
        if (res.success) {
          setLiked(prev => ({ ...prev, [id]: true }));
          window.dispatchEvent(new Event('wishlist-updated'));
          toast.success("Added to wishlist!");
        }
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    } finally {
      setWishlistLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const formatSalary = (job) => {
    const currency = job.currency || "INR";
    const toLakhs = (val) => {
      if (!val) return null;
      return val <= 1000 ? Number(val).toFixed(1) : (val / 100000).toFixed(1);
    };
    const min = toLakhs(job.salaryMin);
    const max = toLakhs(job.salaryMax);
    if (min && max) return `${currency} ${min} - ${max} LPA`;
    if (min) return `${currency} ${min}+ LPA`;
    if (max) return `Up to ${currency} ${max} LPA`;
    return "Negotiable";
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return "No deadline";
    return new Date(deadline).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatLocation = (job) => {
    if (job.location) return `${job.location.city}, ${job.location.state}`;
    return "Location not specified";
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-8" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            Job <span className="text-accent">Listing</span>
          </h2>
        </div>

        {/* Tabs */}
        <div
          className="flex justify-center gap-6 mb-8"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {tabsToDisplay.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-2 text-sm md:text-base font-semibold transition-colors ${
                activeTab === tab
                  ? "text-primary"
                  : "text-gray-400 hover:text-primary"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-accent rounded-full" />
              )}
            </button>
          ))}
         </div>

        {/* Job cards */}
        <div className="flex flex-col gap-4">
          {filtered.map((job, index) => (
            <div
              key={job.id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="bg-white rounded-md shadow-sm border border-gray-200
                         px-4 py-4 md:px-6 md:py-5
                         flex flex-col md:flex-row md:items-center gap-4"
            >
              {/* Logo */}
              <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden bg-gray-50">
                <img
                  src={
                    job.company?.logo ||
                    `https://dummyimage.com/80x80/facc15/111827.png&text=${(job.company?.name || "C")[0]}`
                  }
                  alt={job.company?.name || "Company"}
                  className="w-12 h-12 object-contain"
                  onError={(e) =>
                    (e.currentTarget.src =
                      `https://dummyimage.com/80x80/facc15/111827.png&text=${(job.company?.name || "C")[0]}`)
                  }
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-base md:text-lg font-bold text-primary">
                  {job.title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs md:text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-accent" />
                    {formatLocation(job)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-accent" />
                    {job.jobType?.name || job.type || "N/A"}
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
                    disabled={wishlistLoading[job.id]}
                    className="text-gray-400 hover:text-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed relative"
                  >
                    <Heart
                      size={20}
                      fill={liked[job.id] ? "#ef4444" : "none"}
                      className={liked[job.id] ? "text-red-500" : ""}
                    />
                    {wishlistLoading[job.id] && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                      </span>
                    )}
                  </button>

                  {/* View More */}
                  <Link
                    to={`/jobs/${job.id}`}
                    className="bg-accent text-primary text-xs md:text-sm px-4 py-2 rounded-md font-semibold hover:bg-yellow-300 transition text-center"
                  >
                    View More
                  </Link>

                  {/* Apply */}
                  {appliedJobs[job.id] ? (
                    <button
                      onClick={() => navigate(`/my-applications`)}
                      className="bg-green-50 text-green-700 text-xs md:text-sm px-4 py-2 rounded-md font-semibold border border-green-200 inline-flex items-center gap-1"
                    >
                      <CheckCircle size={14} />
                      Applied
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/apply/${job.id}`)}
                      className="bg-gray-900 text-white text-xs md:text-sm px-4 py-2 rounded-md font-semibold hover:bg-gray-800 transition"
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobListing;