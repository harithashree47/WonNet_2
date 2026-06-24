import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Heart,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { getJobs, searchJobs } from "../api/job";
import { getActiveCategories } from "../api/category";
import { getLocations } from "../api/location";
import { checkApplication } from "../api/application";
import { getMyWishlist, addToWishlist, removeFromWishlist } from "../api/wishlist";

const JOBS_PER_PAGE = 3;

const Jobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [liked, setLiked] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedJobs, setAppliedJobs] = useState({});

  useEffect(() => {
    const fetchInitialData = async () => {
      const [jobsRes, catRes, locRes] = await Promise.all([
        getJobs(),
        getActiveCategories(),
        getLocations(),
      ]);
      let fetchedJobs = [];
      if (jobsRes.success) {
        fetchedJobs = jobsRes.data;
        setJobs(fetchedJobs);
        setFiltered(fetchedJobs);
      }
      if (catRes.success) setCategories(catRes.data);
      if (locRes.success) setLocations(locRes.data);

      // Check which jobs the user has already applied to
      const token = localStorage.getItem('access_token');
      if (token && fetchedJobs.length > 0) {
        const appliedMap = {};
        await Promise.all(
          fetchedJobs.map(async (job) => {
            const res = await checkApplication(job.id);
            if (res.success && res.data.hasApplied) {
              appliedMap[job.id] = true;
            }
          })
        );
        setAppliedJobs(appliedMap);

        // Fetch wishlist to restore liked state after refresh
        const wishlistRes = await getMyWishlist(1, 1000);
        if (wishlistRes.success && wishlistRes.data?.data) {
          const likedMap = {};
          wishlistRes.data.data.forEach((item) => {
            likedMap[item.jobId] = true;
          });
          setLiked(likedMap);
        }
      }
    };
    fetchInitialData();
  }, []);

  const handleSearch = async () => {
    if (keyword) {
      const res = await searchJobs(keyword);
      if (res.success) {
        let results = res.data;
        if (location) {
          results = results.filter(
            (job) => job.locationId === Number(location)
          );
        }
        if (category) {
          results = results.filter(
            (job) => job.categoryId === Number(category)
          );
        }
        setFiltered(results);
        setCurrentPage(1);
        return;
      }
    }

    // fallback: client-side filter
    let results = jobs;
    if (keyword) {
      results = results.filter(
        (job) =>
          job.title.toLowerCase().includes(keyword.toLowerCase()) ||
          (job.company?.name || "").toLowerCase().includes(keyword.toLowerCase())
      );
    }
    if (location) {
      results = results.filter((job) => job.locationId === Number(location));
    }
    if (category) {
      results = results.filter((job) => job.categoryId === Number(category));
    }
    setFiltered(results);
    setCurrentPage(1);
  };

  const toggleLike = async (id) => {
    const isCurrentlyLiked = liked[id];

    // Optimistic update
    setLiked((prev) => ({ ...prev, [id]: !isCurrentlyLiked }));

    // Call API
    const res = isCurrentlyLiked
      ? await removeFromWishlist(id)
      : await addToWishlist(id);

    // Revert on failure
    if (!res.success) {
      setLiked((prev) => ({ ...prev, [id]: isCurrentlyLiked }));
    } else {
      // Notify Header to update the wishlist count badge
      window.dispatchEvent(new Event('wishlist-updated'));
    }
  };

  const totalPages = Math.ceil(filtered.length / JOBS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE
  );

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
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero Banner ── */}
      <div
        className="relative py-16 md:py-20 px-4 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg?auto=compress&cs=tinysrgb&w=1600')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/65" />

        <div className="relative max-w-6xl mx-auto">
          {/* Title */}
          <h1
            className="text-3xl md:text-5xl font-bold text-white text-center mb-10"
            data-aos="fade-up"
          >
            Jobs
          </h1>

          {/* Search filters */}
          <div
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {/* Keyword */}
            <div className="md:col-span-1">
              <label className="block text-white text-sm font-semibold mb-2">
                Search Job Now:
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Enter keywords..."
                className="w-full px-4 py-2.5 rounded-sm bg-white text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Job Locations
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-sm bg-white text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">Job Locations</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.city}, {loc.state}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Job Categories
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-sm bg-white text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">Job Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search button */}
            <div>
              <button
                onClick={handleSearch}
                className="w-full flex items-center justify-center gap-2 bg-accent text-primary font-semibold px-6 py-2.5 rounded-sm hover:bg-yellow-300 transition text-sm"
              >
                <Search size={16} />
                Search
              </button>
            </div>
          </div>

          {/* Keywords hint */}
          <p
            className="mt-4 text-gray-300 text-xs"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            <span className="font-semibold text-white">Keywords: </span>
            <span className="italic">Html, Css, WordPress</span>
          </p>
        </div>
      </div>

      {/* ── Job Listing ── */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Result count */}
          <div
            className="flex items-center justify-between mb-6"
            data-aos="fade-up"
          >
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-primary">
                {filtered.length}
              </span>{" "}
              jobs found
            </p>
            <p className="text-xs text-gray-400">
              {Object.keys(appliedJobs).length} applied
            </p>
          </div>

          {/* Job cards */}
          {paginated.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-sm">
              No jobs found. Try different keywords or filters.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {paginated.map((job, index) => {
                const isApplied = appliedJobs[job.id];
                return (
                  <div
                    key={job.id}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    className={`bg-white rounded-md shadow-sm border ${
                      isApplied ? "border-accent/50" : "border-gray-200"
                    } px-4 py-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center gap-4 transition`}
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
                          (e.currentTarget.src = `https://dummyimage.com/80x80/facc15/111827.png&text=${(job.company?.name || "C")[0]}`)
                        }
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base md:text-lg font-bold text-primary">
                          {job.title}
                        </h3>
                        {isApplied && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <CheckCircle size={10} />
                            Applied
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mb-1">
                        {job.company?.name || "N/A"}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin size={13} className="text-accent" />
                          {formatLocation(job)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={13} className="text-accent" />
                          {job.jobType?.name || "N/A"}
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
                          className="bg-accent text-n text-xs md:text-sm px-4 py-2 rounded-md font-semibold hover:bg-yellow-300 transition text-center"
                        >
                          View More
                        </Link>

                        {/* Apply / Applied toggle */}
                        {isApplied ? (
                          <button
                            onClick={() => navigate(`/my-applications`)}
                            className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs md:text-sm px-4 py-2 rounded-md font-semibold hover:bg-emerald-100 transition inline-flex items-center gap-1.5"
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
              })}
            </div>
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div
              className="flex items-center justify-center gap-2 mt-10"
              data-aos="fade-up"
            >
              {/* Prev */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 text-gray-500 hover:border-accent hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-semibold border transition ${
                      currentPage === page
                        ? "bg-accent text-primary border-accent"
                        : "border-gray-300 text-gray-600 hover:border-accent hover:text-accent"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next */}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 text-gray-500 hover:border-accent hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Jobs;