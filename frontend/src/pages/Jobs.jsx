import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { getJobs, searchJobs } from "../api/job";
import { getActiveCategories } from "../api/category";
import { getLocations } from "../api/location";
import { checkApplication } from "../api/application";
import { getMyWishlist, addToWishlist, removeFromWishlist } from "../api/wishlist";
import JobCard from "../components/JobCard";
import JobFilter from "../components/JobFilter";
import Breadcrumb from "../components/Breadcrumb";

const JOBS_PER_PAGE = 3;

const Jobs = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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
  const jobsRef = useRef(jobs);
  jobsRef.current = jobs;

  const handleReset = () => {
    setKeyword("");
    setLocation("");
    setCategory("");
    setFiltered(jobs);
    setCurrentPage(1);
  };

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

  // Store handleSearch in ref to avoid circular dependency
  const handleSearchRef = useRef(handleSearch);
  handleSearchRef.current = handleSearch;

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
  }, [searchParams]);

  // Auto-apply filters when URL params are present after jobs are loaded
  useEffect(() => {
    const urlKeyword = searchParams.get("keyword");
    const urlLocation = searchParams.get("location");
    const urlCategory = searchParams.get("category");

    if ((urlKeyword || urlLocation || urlCategory) && jobs.length > 0) {
      // Update state from URL params
      setKeyword(urlKeyword || "");
      setLocation(urlLocation || "");
      setCategory(urlCategory || "");

      // Perform search with a small delay to let state update
      const timer = setTimeout(async () => {
        await handleSearchRef.current();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [searchParams, jobs]);


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
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: "Jobs", href: "/jobs" }]} />

      {/* ── Job Listing + Sidebar ── */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <JobFilter
                keyword={keyword}
                setKeyword={setKeyword}
                location={location}
                setLocation={setLocation}
                category={category}
                setCategory={setCategory}
                locations={locations}
                categories={categories}
                handleSearch={handleSearch}
                onReset={handleReset}
              />
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Result count */}
            <div
              className="flex items-center justify-between mb-6"
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
              <div className="flex flex-col gap-5">
                {paginated.map((job) => {
                  const isApplied = appliedJobs[job.id];
                  return (
                    <JobCard
                      key={job.id}
                      job={job}
                      liked={liked}
                      toggleLike={toggleLike}
                      isApplied={isApplied}
                      formatSalary={formatSalary}
                      formatDeadline={formatDeadline}
                      formatLocation={formatLocation}
                    />
                  );
                })}
              </div>
            )}

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div
                className="flex items-center justify-center gap-2 mt-10"
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
        </div>
      </section>
    </div>
  );
};

export default Jobs;