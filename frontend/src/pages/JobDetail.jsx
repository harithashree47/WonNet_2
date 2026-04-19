import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Building2,
  CheckCircle2,
  ArrowLeft,
  Briefcase,
} from "lucide-react";
import { jobs } from "../data/jobs";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = jobs.find((j) => j.id === Number(id));

  // Job not found
  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-primary mb-2">Job Not Found</h2>
        <p className="text-gray-500 mb-6">
          The job you are looking for does not exist.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-accent text-primary px-6 py-2 rounded-md font-semibold hover:bg-yellow-300 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero banner */}
      <div className="bg-primary py-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-accent transition mb-6"
          >
            <ArrowLeft size={16} />
            Back to Jobs
          </button>

          {/* Job header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-md flex items-center justify-center border border-accent/40 overflow-hidden flex-shrink-0">
              <img
                src={job.logo}
                alt={job.company}
                className="w-12 h-12 object-contain"
                onError={(e) =>
                  (e.currentTarget.src = `https://dummyimage.com/80x80/facc15/111827.png&text=${job.company[0]}`)
                }
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {job.title}
              </h1>
              <p className="text-accent font-medium mt-1">{job.company}</p>
            </div>
          </div>

          {/* Meta tags */}
          <div className="flex flex-wrap gap-3 mt-6">
            <span className="flex items-center gap-1.5 text-xs bg-white/10 text-gray-200 px-3 py-1.5 rounded-full">
              <MapPin size={13} className="text-accent" />
              {job.location}
            </span>
            <span className="flex items-center gap-1.5 text-xs bg-white/10 text-gray-200 px-3 py-1.5 rounded-full">
              <Briefcase size={13} className="text-accent" />
              {job.type}
            </span>
            <span className="flex items-center gap-1.5 text-xs bg-white/10 text-gray-200 px-3 py-1.5 rounded-full">
              <DollarSign size={13} className="text-accent" />
              {job.salary}
            </span>
            <span className="flex items-center gap-1.5 text-xs bg-white/10 text-gray-200 px-3 py-1.5 rounded-full">
              <Calendar size={13} className="text-accent" />
              Deadline: {job.deadline}
            </span>
            <span className="flex items-center gap-1.5 text-xs bg-white/10 text-gray-200 px-3 py-1.5 rounded-full">
              <Building2 size={13} className="text-accent" />
              {job.company}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: main detail */}
        <div className="md:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-white rounded-md border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-accent rounded-full inline-block" />
              Job Description
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Responsibilities */}
          <div className="bg-white rounded-md border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-accent rounded-full inline-block" />
              Responsibilities
            </h2>
            <ul className="space-y-2">
              {job.responsibilities.map((r, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <CheckCircle2
                    size={16}
                    className="text-accent mt-0.5 flex-shrink-0"
                  />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-md border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-accent rounded-full inline-block" />
              Requirements
            </h2>
            <ul className="space-y-2">
              {job.requirements.map((r, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <CheckCircle2
                    size={16}
                    className="text-accent mt-0.5 flex-shrink-0"
                  />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: apply card */}
        <div className="space-y-4">
          <div className="bg-white rounded-md border border-gray-200 p-6 sticky top-24">
            <h3 className="text-base font-semibold text-primary mb-4">
              Job Overview
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 mb-6">
              <li className="flex items-center gap-2">
                <MapPin size={15} className="text-accent flex-shrink-0" />
                <span>{job.location}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={15} className="text-accent flex-shrink-0" />
                <span>{job.type}</span>
              </li>
              <li className="flex items-center gap-2">
                <DollarSign size={15} className="text-accent flex-shrink-0" />
                <span>{job.salary}</span>
              </li>
              <li className="flex items-center gap-2">
                <Calendar size={15} className="text-accent flex-shrink-0" />
                <span>Deadline: {job.deadline}</span>
              </li>
              <li className="flex items-center gap-2">
                <Building2 size={15} className="text-accent flex-shrink-0" />
                <span>{job.company}</span>
              </li>
            </ul>
            <button className="w-full bg-accent text-primary font-semibold py-3 rounded-md hover:bg-yellow-300 transition text-sm">
              Apply Now
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full mt-3 border border-primary text-primary font-semibold py-3 rounded-md hover:bg-primary hover:text-white transition text-sm"
            >
              Back to Listings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;