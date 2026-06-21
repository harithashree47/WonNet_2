import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  Clock,
  Filter,
  Info,
  ListFilter,
  MapPin,
  Send,
  TrendingUp,
  Users,
  FileText,
  Loader2,
} from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import {
  getUserApplications,
  withdrawApplication,
  getUserApplicationStats,
  checkApplication,
} from "../api/application";

const ApplicationStatus = {
  APPLIED: "applied",
  PENDING: "pending",
  REVIEWING: "reviewing",
  SHORTLISTED: "shortlisted",
  INTERVIEW: "interview",
  OFFERED: "offered",
  REJECTED: "rejected",
  WITHDRAWN: "withdrawn",
};

const statusConfig = {
  [ApplicationStatus.APPLIED]: {
    label: "APPLIED",
    pill: "bg-yellow-100/70 text-yellow-800 border border-yellow-200",
  },
  [ApplicationStatus.PENDING]: {
    label: "PENDING",
    pill: "bg-yellow-100/70 text-yellow-800 border border-yellow-200",
  },
  [ApplicationStatus.REVIEWING]: {
    label: "IN REVIEW",
    pill: "bg-gray-100 text-gray-700 border border-gray-200",
  },
  [ApplicationStatus.SHORTLISTED]: {
    label: "SHORTLISTED",
    pill: "bg-purple-100/70 text-purple-800 border border-purple-200",
  },
  [ApplicationStatus.INTERVIEW]: {
    label: "INTERVIEWING",
    pill: "bg-accent/20 text-[#7a5b00] border border-accent",
  },
  [ApplicationStatus.OFFERED]: {
    label: "SELECTED",
    pill: "bg-emerald-100/80 text-emerald-800 border border-emerald-200",
  },
  [ApplicationStatus.REJECTED]: {
    label: "DECLINED",
    pill: "bg-red-100/80 text-red-700 border border-red-200",
  },
  [ApplicationStatus.WITHDRAWN]: {
    label: "WITHDRAWN",
    pill: "bg-gray-100 text-gray-700 border border-gray-200",
  },
};

const APPLICATIONS_PER_PAGE = 5;

function formatApplied(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalSent: 0,
    interviews: 0,
    inReview: 0,
    responseRate: 0,
  });
  const [withdrawing, setWithdrawing] = useState(null);

  // Fetch applications
  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const result = await getUserApplications({
        status: statusFilter || undefined,
        page: currentPage,
        limit: APPLICATIONS_PER_PAGE,
      });
      
      if (result.success) {
        setApplications(result.data.data || []);
      } else {
        console.error("Failed to fetch applications:", result.error);
        setApplications([]);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const result = await getUserApplicationStats();
      
      if (result.success) {
        const statsData = result.data;
        setStats({
          totalSent: statsData.total || 0,
          interviews: statsData.statuses?.interview || 0,
          inReview: statsData.statuses?.reviewing || 0,
          responseRate: statsData.total > 0 
            ? Math.round(((statsData.statuses?.offered || 0) / statsData.total) * 100) 
            : 0,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleWithdraw = async (id) => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) {
      return;
    }

    setWithdrawing(id);
    try {
      const result = await withdrawApplication(id);
      if (result.success) {
        // Refresh applications
        await fetchApplications();
        await fetchStats();
      } else {
        alert(result.error?.message || "Failed to withdraw application");
      }
    } catch (error) {
      alert("Error withdrawing application");
    } finally {
      setWithdrawing(null);
    }
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
    fetchApplications();
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    // You can implement search logic here if needed
  };

  const activeCount = useMemo(() => {
    return applications.filter(
      (a) =>
        a.status !== ApplicationStatus.REJECTED &&
        a.status !== ApplicationStatus.WITHDRAWN
    ).length;
  }, [applications]);

  const sortedApps = useMemo(() => {
    return [...applications].sort(
      (a, b) => new Date(b.appliedDate || b.createdAt) - new Date(a.appliedDate || a.createdAt)
    );
  }, [applications]);

  const totalPages = Math.ceil(sortedApps.length / APPLICATIONS_PER_PAGE);
  const paginated = sortedApps.slice(
    (currentPage - 1) * APPLICATIONS_PER_PAGE,
    currentPage * APPLICATIONS_PER_PAGE
  );

  const topStatsItems = [
  {
    key: "totalSent",
    label: "Total Sent",
    value: String(stats.totalSent || 0),
    icon: Send,
  },
  {
    key: "interviews",
    label: "Interviews",
    value: String(stats.interviews || 0),
    icon: Users,
  },
  {
    key: "inReview",
    label: "In Review",
    value: String(stats.inReview || 0),
    icon: Clock,
  },
  {
    key: "responseRate",
    label: "Response Rate",
    value: `${stats.responseRate || 0}%`,
    icon: TrendingUp,
  },
];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ===================== BREADCRUMB ===================== */}
      <Breadcrumb items={[{ label: "My Applications", href: "/applications" }]} />

      {/* ===================== STATS STRIP ===================== */}
      <section className="relative overflow-hidden bg-white">
        <div
          className="relative border-b border-gray-200 pb-8"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          <div className="max-w-6xl mx-auto px-4 py-6 sm:py-7">
            {statsLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 text-accent animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-y-6 gap-x-6">
                {topStatsItems.map((item, idx) => (
                  <div key={item.key} className="flex items-center sm:contents">
                    {idx > 0 && (
                      <div className="hidden sm:block w-px h-10 bg-gray-200 flex-shrink-0" />
                    )}
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-primary" strokeWidth={2.25} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xl sm:text-2xl font-bold text-primary tabular-nums leading-tight">
                          {item.value}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                          {item.label}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===================== RECENT APPLICATIONS ===================== */}
      <section className="py-10 sm:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8" data-aos="fade-up">
            <div className="flex items-center gap-3 sm:gap-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                Recent <span className="text-accent">Applications</span>
              </h2>
              <span className="bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap border border-accent/30">
                {activeCount} Active
              </span>
            </div>

            <div className="flex items-center gap-4 sm:gap-5 text-sm text-gray-600">
              <button
                onClick={() => setFilterOpen((v) => !v)}
                className="inline-flex items-center gap-2 hover:text-accent transition duration-200"
              >
                <Filter className="w-4 h-4" /> Filter
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => setSortOpen((v) => !v)}
                className="inline-flex items-center gap-2 hover:text-accent transition duration-200"
              >
                <ListFilter className="w-4 h-4" /> Sort by Date
              </button>
            </div>
          </div>

          {/* Filter dropdown */}
          {filterOpen && (
            <div className="mb-6 bg-white border border-gray-200 rounded-md p-4" data-aos="fade-in">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleStatusFilter("")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    statusFilter === "" 
                      ? "bg-accent text-primary" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => handleStatusFilter(key)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      statusFilter === key 
                        ? "bg-accent text-primary" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {config.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
              <p className="text-sm text-gray-500">Loading applications...</p>
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Found</h3>
              <p className="text-sm text-gray-500 mb-6">
                You haven't applied to any jobs yet.
              </p>
              <Link
                to="/jobs"
                className="inline-block bg-accent text-primary font-semibold px-6 py-2.5 rounded-md hover:bg-yellow-300 transition text-sm"
              >
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {paginated.map((app, index) => {
                const cfg = statusConfig[app.status] || statusConfig[ApplicationStatus.PENDING];
                const isOffered = app.status === ApplicationStatus.OFFERED;
                const isDeclined = app.status === ApplicationStatus.REJECTED;
                const isWithdrawn = app.status === ApplicationStatus.WITHDRAWN;
                const isWithdrawable = !isOffered && !isDeclined && !isWithdrawn;

                return (
                  <div
                    key={app.id}
                    data-aos="fade-up"
                    data-aos-delay={index * 80}
                    className="bg-white border border-gray-200 rounded-md p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 group hover:border-accent transition duration-300"
                  >
                    {/* Left */}
                    <div className="flex items-start sm:items-center gap-4 min-w-0">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition duration-300">
                        <FileText className="w-5 h-5 text-accent" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-primary font-semibold text-sm sm:text-base">
                          {app.job?.title || "Unknown Job"}
                        </h3>
                        <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4 text-gray-400" />
                            {app.job?.company?.name || "Unknown Company"}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {app.job?.location?.city || "N/A"}, {app.job?.location?.state || "N/A"} (
                            {app.job?.jobType?.name || "N/A"})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center justify-between lg:justify-end gap-4 sm:gap-8 pl-0 sm:pl-16 lg:pl-0">
                      <div className="text-left sm:text-center">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide ${cfg.pill}`}
                        >
                          {cfg.label}
                        </span>
                        <div className="text-[11px] sm:text-xs text-gray-400 mt-1.5 sm:mt-2">
                          Applied: {formatApplied(app.createdAt || app.appliedDate)}
                        </div>
                      </div>

                      {isWithdrawable && (
                        <button
                          onClick={() => handleWithdraw(app.id)}
                          disabled={withdrawing === app.id}
                          className="inline-flex items-center gap-1 text-sm text-red-500 font-medium hover:text-red-700 transition whitespace-nowrap"
                        >
                          {withdrawing === app.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Withdraw"
                          )}
                        </button>
                      )}

                      {!isOffered && !isDeclined && !isWithdrawn && (
                        <Link
                          to={`/jobs/${app.job?.id}`}
                          className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:text-accent transition whitespace-nowrap"
                        >
                          View Details <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}

                      {isOffered && (
                        <button className="bg-accent hover:bg-yellow-300 text-primary font-semibold px-4 py-2 rounded-md text-xs sm:text-sm whitespace-nowrap transition">
                          Accept Offer →
                        </button>
                      )}

                      {isDeclined && (
                        <span className="text-xs text-gray-400">
                          Declined
                        </span>
                      )}

                      {isWithdrawn && (
                        <span className="text-xs text-gray-400">
                          Withdrawn
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
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

          {/* Bottom CTA */}
          <div className="mt-12 border-2 border-dashed border-accent bg-accent/10 rounded-md py-8 sm:py-10 px-4 text-center" data-aos="zoom-in" data-aos-delay="100">
            <p className="text-primary font-medium mb-4 text-sm sm:text-base">
              Looking for more opportunities that match your profile?
            </p>
            <Link
              to="/jobs"
              className="inline-block bg-accent text-primary font-semibold px-6 sm:px-8 py-3 rounded-md hover:bg-yellow-300 transition text-sm"
            >
              Browse New Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section className="py-14 px-4 bg-primary">
        <div className="max-w-3xl mx-auto text-center" data-aos="fade-up">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Find Your <span className="text-accent">Dream Job?</span>
          </h2>
          <p className="text-gray-300 text-sm md:text-base mb-6">
            Join thousands of professionals who found their perfect career
            match on WonNet. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/jobs"
              className="bg-accent text-primary font-semibold px-6 py-3 rounded-md hover:bg-yellow-300 transition text-sm"
            >
              Browse Jobs
            </Link>
            <Link
              to="/login"
              className="border border-white text-white font-semibold px-6 py-3 rounded-md hover:bg-white hover:text-primary transition text-sm"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}