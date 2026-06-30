import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthModal } from "../contexts/AuthModalContext";
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
  Calendar,
  Heart,
  Search,
  X,
  Eye,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageCircle,
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
    icon: Send,
    color: "text-yellow-600",
  },
  [ApplicationStatus.PENDING]: {
    label: "PENDING",
    pill: "bg-yellow-100/70 text-yellow-800 border border-yellow-200",
    icon: Clock,
    color: "text-yellow-600",
  },
  [ApplicationStatus.REVIEWING]: {
    label: "IN REVIEW",
    pill: "bg-gray-100 text-gray-700 border border-gray-200",
    icon: Eye,
    color: "text-gray-600",
  },
  [ApplicationStatus.SHORTLISTED]: {
    label: "SHORTLISTED",
    pill: "bg-purple-100/70 text-purple-800 border border-purple-200",
    icon: CheckCircle,
    color: "text-purple-600",
  },
  [ApplicationStatus.INTERVIEW]: {
    label: "INTERVIEWING",
    pill: "bg-accent/20 text-[#7a5b00] border border-accent",
    icon: MessageCircle,
    color: "text-[#7a5b00]",
  },
  [ApplicationStatus.OFFERED]: {
    label: "SELECTED",
    pill: "bg-emerald-100/80 text-emerald-800 border border-emerald-200",
    icon: CheckCircle,
    color: "text-emerald-600",
  },
  [ApplicationStatus.REJECTED]: {
    label: "DECLINED",
    pill: "bg-red-100/80 text-red-700 border border-red-200",
    icon: XCircle,
    color: "text-red-600",
  },
  [ApplicationStatus.WITHDRAWN]: {
    label: "WITHDRAWN",
    pill: "bg-gray-100 text-gray-700 border border-gray-200",
    icon: XCircle,
    color: "text-gray-500",
  },
};

const statusTimeline = [
  ApplicationStatus.APPLIED,
  ApplicationStatus.REVIEWING,
  ApplicationStatus.SHORTLISTED,
  ApplicationStatus.INTERVIEW,
  ApplicationStatus.OFFERED,
];

const APPLICATIONS_PER_PAGE = 5;

function formatApplied(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function daysSince(dateString) {
  const now = new Date();
  const then = new Date(dateString);
  const diff = Math.floor((now - then) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff} days ago`;
}

export default function Applications() {
  const navigate = useNavigate();
  const { setAuthModalOpen } = useAuthModal();
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
  const [expandedApp, setExpandedApp] = useState(null);

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
        await fetchApplications();
        await fetchStats();
        setExpandedApp(null);
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
  };

  const activeCount = useMemo(() => {
    return applications.filter(
      (a) =>
        a.status !== ApplicationStatus.REJECTED &&
        a.status !== ApplicationStatus.WITHDRAWN
    ).length;
  }, [applications]);

  const sortedApps = useMemo(() => {
    let filtered = [...applications];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          (a.job?.title || "").toLowerCase().includes(term) ||
          (a.job?.company?.name || "").toLowerCase().includes(term) ||
          (a.job?.location?.city || "").toLowerCase().includes(term) ||
          (a.job?.location?.state || "").toLowerCase().includes(term)
      );
    }
    
    return filtered.sort(
      (a, b) => new Date(b.appliedDate || b.createdAt) - new Date(a.appliedDate || a.createdAt)
    );
  }, [applications, searchTerm]);

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
      <Breadcrumb items={[{ label: "My Applications", href: "/applications" }]} />

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

      <section className="py-10 sm:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6" data-aos="fade-up">
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

          <div className="mb-4" data-aos="fade-up">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by job title, company, or location..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm || statusFilter ? "No Matching Applications" : "No Applications Found"}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {searchTerm || statusFilter
                  ? "Try adjusting your search or filter criteria."
                  : "You haven't applied to any jobs yet."}
              </p>
              <Link
                to="/jobs"
                className="inline-block bg-accent text-primary font-semibold px-6 py-2.5 rounded-md hover:bg-yellow-300 transition text-sm"
              >
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {paginated.map((app, index) => {
                const cfg = statusConfig[app.status] || statusConfig[ApplicationStatus.PENDING];
                const isOffered = app.status === ApplicationStatus.OFFERED;
                const isDeclined = app.status === ApplicationStatus.REJECTED;
                const isWithdrawn = app.status === ApplicationStatus.WITHDRAWN;
                const isWithdrawable = !isOffered && !isDeclined && !isWithdrawn;
                const isExpanded = expandedApp === app.id;
                const showTimeline = !isDeclined && !isWithdrawn;
                const currentStep = statusTimeline.indexOf(app.status);

                return (
                  <div
                    key={app.id}
                    data-aos="fade-up"
                    data-aos-delay={index * 80}
                    className={`bg-white rounded-md shadow-sm border ${
                      isExpanded ? "border-accent" : "border-gray-200"
                    } transition-all duration-300`}
                  >
                    <div className="px-4 py-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden bg-gray-50">
                        <img
                          src={
                            app.job?.company?.logo ||
                            `https://dummyimage.com/80x80/facc15/111827.png&text=${(app.job?.company?.name || "C")[0]}`
                          }
                          alt={app.job?.company?.name || "Company Logo"}
                          className="w-12 h-12 object-contain"
                          onError={(e) =>
                            (e.currentTarget.src =
                              `https://dummyimage.com/80x80/facc15/111827.png&text=${(app.job?.company?.name || "C")[0]}`)
                          }
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base md:text-lg font-bold text-primary truncate">
                            {app.job?.title || "Unknown Job"}
                          </h3>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.pill}`}>
                            {cfg.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs md:text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Briefcase size={13} className="text-accent" />
                            {app.job?.company?.name || "Unknown Company"}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={13} className="text-accent" />
                            {app.job?.location?.city || "N/A"}, {app.job?.location?.state || "N/A"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={13} className="text-accent" />
                            {app.job?.jobType?.name || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
                            <Calendar size={11} className="text-accent" />
                            Applied {formatApplied(app.createdAt || app.appliedDate)}
                          </span>
                          <span className="text-[11px] text-gray-300">•</span>
                          <span className="text-[11px] text-gray-400">
                            {daysSince(app.createdAt || app.appliedDate)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col md:items-end gap-2">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                            className="text-xs md:text-sm px-3 py-2 rounded-md font-semibold border border-gray-200 text-gray-600 hover:border-accent hover:text-accent transition inline-flex items-center gap-1"
                          >
                            {isExpanded ? (
                              <>Less <ChevronUp size={14} /></>
                            ) : (
                              <>Details <ChevronDown size={14} /></>
                            )}
                          </button>

                          {isOffered && (
                            <button className="bg-accent text-primary text-xs md:text-sm px-4 py-2 rounded-md font-semibold hover:bg-yellow-300 transition whitespace-nowrap">
                              Accept Offer →
                            </button>
                          )}

                          {!isOffered && !isDeclined && !isWithdrawn && (
                            <Link
                              to={`/jobs/${app.job?.id}`}
                              className="bg-primary text-white text-xs md:text-sm px-4 py-2 rounded-md font-semibold hover:bg-accent hover:text-primary transition whitespace-nowrap"
                            >
                              View Job
                            </Link>
                          )}

                          {isWithdrawable && (
                            <button
                              onClick={() => handleWithdraw(app.id)}
                              disabled={withdrawing === app.id}
                              className="text-xs md:text-sm px-3 py-2 rounded-md font-semibold border border-red-200 text-red-500 hover:bg-red-50 transition whitespace-nowrap"
                            >
                              {withdrawing === app.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                "Withdraw"
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-gray-100 px-4 md:px-6 py-4 bg-gray-50/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-semibold text-primary mb-3">Application Details</h4>
                            <div className="space-y-2.5">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Job Title</span>
                                <span className="font-medium text-primary">{app.job?.title || "N/A"}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Company</span>
                                <span className="font-medium text-primary">{app.job?.company?.name || "N/A"}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Location</span>
                                <span className="font-medium text-primary">
                                  {app.job?.location?.city || "N/A"}, {app.job?.location?.state || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Job Type</span>
                                <span className="font-medium text-primary">{app.job?.jobType?.name || "N/A"}</span>
                              </div>
                              {app.job?.category && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-500">Category</span>
                                  <span className="font-medium text-primary">{app.job.category.name}</span>
                                </div>
                              )}
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Status</span>
                                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.pill}`}>
                                  {cfg.label}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Applied On</span>
                                <span className="font-medium text-primary">
                                  {formatApplied(app.createdAt || app.appliedDate)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-primary mb-3">Application Progress</h4>
                            {showTimeline ? (
                              <div className="space-y-0">
                                {statusTimeline.map((step, idx) => {
                                  const stepConfig = statusConfig[step];
                                  const isCompleted = currentStep >= idx;
                                  const isCurrent = currentStep === idx;
                                  const isFuture = currentStep < idx;
                                  const StatusIcon = stepConfig.icon;
                                  
                                  return (
                                    <div key={step} className="flex items-start gap-3">
                                      <div className="flex flex-col items-center">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                                          isCompleted 
                                            ? "bg-accent border-accent text-primary" 
                                            : isCurrent 
                                              ? "bg-accent/20 border-accent text-accent" 
                                              : "bg-gray-100 border-gray-200 text-gray-400"
                                        }`}>
                                          <StatusIcon size={14} />
                                        </div>
                                        {idx < statusTimeline.length - 1 && (
                                          <div className={`w-0.5 h-8 ${
                                            currentStep > idx ? "bg-accent" : "bg-gray-200"
                                          }`} />
                                        )}
                                      </div>
                                      <div className={`pb-6 ${isFuture ? "opacity-40" : ""}`}>
                                        <p className={`text-sm font-semibold ${
                                          isCompleted ? "text-primary" : isCurrent ? "text-accent" : "text-gray-400"
                                        }`}>
                                          {stepConfig.label}
                                          {isCurrent && !isCompleted && (
                                            <span className="ml-2 inline-block w-2 h-2 bg-accent rounded-full animate-pulse" />
                                          )}
                                        </p>
                                        {isCurrent && (
                                          <p className="text-xs text-gray-400 mt-0.5">Current status</p>
                                        )}
                                        {isCompleted && idx === statusTimeline.length - 1 && (
                                          <p className="text-xs text-emerald-600 mt-0.5 font-medium">🎉 Congratulations!</p>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : isDeclined ? (
                              <div className="flex flex-col items-center justify-center py-6 text-center">
                                <XCircle className="w-10 h-10 text-red-300 mb-2" />
                                <p className="text-sm font-medium text-red-600">Application Declined</p>
                                <p className="text-xs text-gray-400 mt-1">Don't give up! Keep applying to other positions.</p>
                                <Link
                                  to="/jobs"
                                  className="mt-3 text-xs font-semibold text-accent hover:text-yellow-600 transition"
                                >
                                  Browse More Jobs →
                                </Link>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-6 text-center">
                                <XCircle className="w-10 h-10 text-gray-300 mb-2" />
                                <p className="text-sm font-medium text-gray-500">Application Withdrawn</p>
                                <p className="text-xs text-gray-400 mt-1">You withdrew this application.</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap items-center gap-3">
                          {!isOffered && !isDeclined && !isWithdrawn && (
                            <>
                              <Link
                                to={`/jobs/${app.job?.id}`}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-primary text-white px-4 py-2 rounded-md hover:bg-accent hover:text-primary transition"
                              >
                                <Eye size={14} />
                                View Full Job Details
                              </Link>
                              {isWithdrawable && (
                                <button
                                  onClick={() => handleWithdraw(app.id)}
                                  disabled={withdrawing === app.id}
                                  className="inline-flex items-center gap-1.5 text-xs font-semibold border border-red-200 text-red-500 px-4 py-2 rounded-md hover:bg-red-50 transition"
                                >
                                  {withdrawing === app.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    "Withdraw Application"
                                  )}
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

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
            <button
              onClick={() => setAuthModalOpen(true)}
              className="border border-white text-white font-semibold px-6 py-3 rounded-md hover:bg-white hover:text-primary transition text-sm"
            >
              Create Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}