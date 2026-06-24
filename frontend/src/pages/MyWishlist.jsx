import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Briefcase,
  Users,
  Trash2,
  Loader2,
  Search,
  X,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import Breadcrumb from "../components/Breadcrumb";
import { getMyWishlist, removeFromWishlist } from "../api/wishlist";

const ITEMS_PER_PAGE = 9;

// ✅ LocalStorage key for wishlist heart states
const WISHLIST_HEARTS_KEY = "wishlist_hearts";

function formatSalary(job) {
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
}

function formatDeadline(deadline) {
  if (!deadline) return "No deadline";
  return new Date(deadline).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatLocation(job) {
  if (job.location) return `${job.location.city}, ${job.location.state}`;
  return "Location not specified";
}

export default function MyWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // ✅ Track heart fill states (all wishlist items start filled = true)
  const [heartStates, setHeartStates] = useState(() => {
    const saved = localStorage.getItem(WISHLIST_HEARTS_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const result = await getMyWishlist();
      if (result.success) {
        const jobs = result.data.data.map(item => item.job);
        setWishlist(jobs);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (jobId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm("Remove this job from your wishlist?")) return;
    
    setRemoving(jobId);
    try {
      const result = await removeFromWishlist(jobId);
      if (result.success) {
        // ✅ Update heart state to unfilled
        const newHearts = { ...heartStates };
        delete newHearts[jobId];
        setHeartStates(newHearts);
        localStorage.setItem(WISHLIST_HEARTS_KEY, JSON.stringify(newHearts));
        
        setWishlist(prev => prev.filter(item => item.id !== jobId));
        toast.success("Removed from wishlist");
      } else {
        setWishlist(prev => prev.filter(item => item.id !== jobId));
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      setWishlist(prev => prev.filter(item => item.id !== jobId));
      toast.error("Failed to remove from wishlist");
    } finally {
      setRemoving(null);
    }
  };

  // ✅ Initialize all wishlist items as filled hearts
  useEffect(() => {
    if (wishlist.length > 0) {
      setHeartStates(prev => {
        const newHearts = { ...prev };
        let changed = false;
        wishlist.forEach(job => {
          if (!(job.id in newHearts)) {
            newHearts[job.id] = true;
            changed = true;
          }
        });
        if (changed) {
          localStorage.setItem(WISHLIST_HEARTS_KEY, JSON.stringify(newHearts));
        }
        return changed ? newHearts : prev;
      });
    }
  }, [wishlist]);

  const filteredWishlist = wishlist.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (item.title || "").toLowerCase().includes(term) ||
      (item.company?.name || "").toLowerCase().includes(term) ||
      (item.location?.city || "").toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredWishlist.length / ITEMS_PER_PAGE);
  const paginated = filteredWishlist.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Breadcrumb items={[{ label: "My Wishlist", href: "/my-wishlist" }]} />

      <section className="relative overflow-hidden bg-white">
        <div
          className="relative border-b border-gray-200 pb-8"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          <div className="max-w-6xl mx-auto px-4 py-6 sm:py-7">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-primary" fill="currentColor" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
                  My <span className="text-accent">Wishlist</span>
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {filteredWishlist.length} {filteredWishlist.length === 1 ? "Job" : "Jobs"} Saved
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {wishlist.length > 0 && (
            <div className="mb-6" data-aos="fade-up">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search saved jobs..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
              <p className="text-sm text-gray-500">Loading your wishlist...</p>
            </div>
          ) : filteredWishlist.length === 0 ? (
            <div className="text-center py-20" data-aos="fade-up">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? "No Matching Jobs" : "No Saved Jobs Yet"}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "Start saving jobs you're interested in and they'll appear here."}
              </p>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 rounded-md hover:bg-yellow-300 transition text-sm"
              >
                <ArrowLeft size={16} />
                Browse Jobs
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map((job, index) => (
                  <div
                    key={job.id}
                    data-aos="fade-up"
                    data-aos-delay={index * 80}
                    className="bg-white rounded-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                  >
                    <Link to={`/jobs/${job.id}`} className="block p-5">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden bg-gray-50 flex-shrink-0">
                          <img
                            src={
                              job.company?.logo ||
                              `https://dummyimage.com/80x80/facc15/111827.png&text=${(job.company?.name || "C")[0]}`
                            }
                            alt={job.company?.name || "Company"}
                            className="w-10 h-10 object-contain"
                            onError={(e) =>
                              (e.currentTarget.src = `https://dummyimage.com/80x80/facc15/111827.png&text=${(job.company?.name || "C")[0]}`)
                            }
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-primary truncate group-hover:text-accent transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {job.company?.name || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-accent flex-shrink-0" />
                          <span className="truncate">{formatLocation(job)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Briefcase size={13} className="text-accent flex-shrink-0" />
                          <span>{job.jobType?.name || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign size={13} className="text-accent flex-shrink-0" />
                          <span className="font-medium">{formatSalary(job)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-accent flex-shrink-0" />
                          <span>Deadline: {formatDeadline(job.applyDeadline)}</span>
                        </div>
                        {job.vacancies && (
                          <div className="flex items-center gap-1.5">
                            <Users size={13} className="text-accent flex-shrink-0" />
                            <span>{job.vacancies} Open Vacancies</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          Saved recently
                        </span>
                        <Heart 
                          size={18} 
                          className="text-red-500" 
                          fill="currentColor" 
                        />
                      </div>
                    </Link>

                    <div className="px-5 pb-5">
                      <button
                        onClick={(e) => handleRemove(job.id, e)}
                        disabled={removing === job.id}
                        className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-red-500 border border-red-200 rounded-md py-2 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {removing === job.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10" data-aos="fade-up">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-md text-sm font-semibold border border-gray-200 text-gray-700 hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`px-3 sm:px-4 py-2 rounded-md text-sm font-semibold border transition ${
                        currentPage === p
                          ? "bg-accent text-primary border-accent"
                          : "bg-white border-gray-200 text-gray-700 hover:border-accent"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-md text-sm font-semibold border border-gray-200 text-gray-700 hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}