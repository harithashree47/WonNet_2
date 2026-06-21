import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Link as LinkIcon,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Users,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  FileText,
  Building2,
  Calendar,
  Award,
  Globe,
  Mail,
  Phone,
  ExternalLink,
  X,
} from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";

const ApplyPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    resume: null,
    linkedin: "",
    portfolio: "",
    motivation: "",
    expectedSalary: "",
    coverLetter: "",
  });
  const [expanded, setExpanded] = useState(true);

  // Mock job data
  const jobData = {
    title: "Senior Frontend Developer",
    company: "Avian Technologies",
    location: "San Francisco, CA (Remote Friendly)",
    salary: "$140k – $180k per year",
    jobType: "Full-Time, Remote",
    seniority: "Senior Level (5+ yrs)",
    benefits: [
      "4-City-Work-Work-Office",
      "$36000 Counting Reimbursed",
      "Subsidized PTO policy",
    ],
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, resume: file });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle application submission
    console.log("Application submitted:", formData);
    // Navigate to success page or show success message
    alert("Application submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Jobs", href: "/jobs" },
          { label: jobData.title, href: `/jobs/1` },
          { label: "Apply", href: "#" },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Application Form */}
          <div className="lg:col-span-2">
            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-500 hover:text-accent transition-colors mb-6"
            >
              <ArrowLeft size={18} />
              Back to Job
            </button>

            {/* Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h1 className="text-2xl font-bold text-primary">Apply for Position</h1>
              <p className="text-gray-500 text-sm mt-1">
                Complete the form below to submit your application
              </p>
            </div>

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Personal Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-accent rounded-full"></span>
                  Personal Details
                </h2>

                {/* Resume Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume / CV <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-accent transition-colors cursor-pointer">
                    <input
                      type="file"
                      id="resume"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label htmlFor="resume" className="cursor-pointer block">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-600">
                        {formData.resume ? formData.resume.name : "Upload Resume"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Drag and drop your resume or click to browse
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        PDF, DOCX, or TXT only
                      </p>
                    </label>
                  </div>
                  {formData.resume && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle size={16} />
                      <span>Resume uploaded successfully</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, resume: null })}
                        className="text-red-500 hover:text-red-700 ml-auto"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* LinkedIn Profile */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Profile
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="url"
                      placeholder="linkedin.com/in/username"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Portfolio Links */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio Links (Optional)
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="url"
                      placeholder="yourportfolio.com"
                      value={formData.portfolio}
                      onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Motivation */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-accent rounded-full"></span>
                  Motivation
                </h2>
                <textarea
                  placeholder="Why do you want to work with us? Share your motivation and what makes you a great fit..."
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                />
              </div>

              {/* Step 3: Role Summary */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-accent rounded-full"></span>
                  Role Summary
                </h2>

                {/* Expected Salary */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Salary
                  </label>
                  <input
                    type="text"
                    placeholder="$140k – $180k per year"
                    value={formData.expectedSalary}
                    onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>

                {/* Job Details Preview */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase size={16} className="text-accent" />
                    <span className="text-gray-600">Job Type:</span>
                    <span className="font-medium text-gray-800">Full-Time, Remote</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users size={16} className="text-accent" />
                    <span className="text-gray-600">Seniority:</span>
                    <span className="font-medium text-gray-800">Senior Level (5+ yrs)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award size={16} className="text-accent" />
                    <span className="text-gray-600">Benefits:</span>
                    <div className="flex flex-wrap gap-1">
                      {jobData.benefits.map((benefit, idx) => (
                        <span key={idx} className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat with Recruiters */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <button
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                  className="w-full flex items-center justify-between"
                >
                  <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
                    <MessageCircle size={20} className="text-accent" />
                    Chat with Recruiters
                  </h2>
                  {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expanded && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-3">
                      Have questions about the role? Chat with our recruiters directly.
                    </p>
                    <button
                      type="button"
                      className="flex items-center gap-2 text-accent font-medium hover:text-yellow-600 transition"
                    >
                      <MessageCircle size={18} />
                      Start Chat
                    </button>
                  </div>
                )}
              </div>

              {/* Next Step */}
              <div className="flex items-center justify-between gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition text-sm"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-8 py-2.5 bg-accent text-primary font-semibold rounded-lg hover:bg-yellow-300 transition text-sm"
                >
                  Submit Application
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Job Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-primary mb-2">
                {jobData.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                <Building2 className="inline-block w-4 h-4 mr-1 text-accent" />
                {jobData.company}
              </p>
              <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-accent" />
                {jobData.location}
              </p>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign size={16} className="text-accent" />
                  <span className="text-gray-600">Salary:</span>
                  <span className="font-medium text-gray-800">{jobData.salary}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase size={16} className="text-accent" />
                  <span className="text-gray-600">Job Type:</span>
                  <span className="font-medium text-gray-800">{jobData.jobType}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users size={16} className="text-accent" />
                  <span className="text-gray-600">Seniority:</span>
                  <span className="font-medium text-gray-800">{jobData.seniority}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-xs text-gray-500 mb-2">Care Benefits</p>
                <div className="space-y-1.5">
                  {jobData.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="w-full mt-6 bg-primary text-white font-semibold py-2.5 rounded-lg hover:bg-primary/90 transition text-sm"
              >
                Scroll to Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyPage;