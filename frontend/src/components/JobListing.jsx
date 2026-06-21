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
import { getPublishedJobs } from "../api/job";
import { checkApplication } from "../api/application";

const tabs = ["Featured", "Full Time", "Part Time"];

const JobListing = () => {
  const [activeTab, setActiveTab] = useState("Featured");
  const [liked, setLiked] = useState({});
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState({});
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
  }, []);

  const filtered =
    activeTab === "Featured"
      ? jobs
      : jobs.filter((j) => j.jobType?.name === activeTab);

  const toggleLike = (id) =>
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));

  const formatSalary = (job) => {
    if (job.salaryMin && job.salaryMax)
      return `${job.currency || ""} ${job.salaryMin} - ${job.salaryMax}`;
    if (job.salaryMin) return `${job.currency || ""} ${job.salaryMin}+`;
    if (job.salaryMax) return `Up to ${job.currency || ""} ${job.salaryMax}`;
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
          {tabs.map((tab) => (
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