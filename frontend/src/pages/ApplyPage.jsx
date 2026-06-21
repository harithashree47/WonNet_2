import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  X,
  Loader2,
} from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import { getJobById } from "../api/job";
import { uploadResume } from "../api/upload";
import { applyForJob } from "../api/application";

const ApplyPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [formData, setFormData] = useState({
    resume: null,
    resumeUrl: "",
    linkedin: "",
    portfolio: "",
    motivation: "",
    expectedSalary: "",
    noticePeriod: "",
    coverLetter: "",
  });

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const result = await getJobById(Number(id));
        if (result.success) setJobData(result.data);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const uploadResult = await uploadResume(file);
      if (uploadResult.success) {
        setFormData({ ...formData, resume: file, resumeUrl: uploadResult.url });
      } else {
        alert(uploadResult.error || "Failed to upload resume");
      }
    } catch (error) {
      alert("Error uploading resume");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.resumeUrl) {
      alert("Please upload your resume first");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        jobId: Number(id),
        resumeUrl: formData.resumeUrl,
        linkedin: formData.linkedin || undefined,
        portfolio: formData.portfolio || undefined,
        coverLetter: formData.coverLetter || undefined,
        expectedSalary: formData.expectedSalary || undefined,
        noticePeriod: formData.noticePeriod || undefined,
      };
      const result = await applyForJob(payload);
      if (result.success) {
        alert("Application submitted successfully!");
        navigate("/my-applications");
      } else {
        alert(result.error?.message || "Failed to submit application");
      }
    } catch (error) {
      alert("Error submitting application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !jobData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-accent animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 mb-2">Job not found</p>
          <p className="text-sm text-gray-500 mb-4">The job you're trying to apply for doesn't exist.</p>
          <Link to="/jobs" className="inline-block bg-accent text-primary font-semibold px-6 py-2.5 rounded-md hover:bg-yellow-300 transition text-sm">Back to Jobs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb items={[{ label: "Jobs", href: "/jobs" }, { label: jobData.title, href: `/jobs/${id}` }, { label: "Apply", href: "#" }]} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-accent transition-colors mb-6"><ArrowLeft size={18} />Back to Job</button>
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h1 className="text-2xl font-bold text-primary">Apply for Position</h1>
              <p className="text-gray-500 text-sm mt-1">Complete the form below to submit your application</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2"><span className="w-1 h-6 bg-accent rounded-full"></span>Personal Details</h2>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resume / CV <span className="text-red-500">*</span></label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-accent transition-colors cursor-pointer">
                    <input type="file" id="resume" accept=".pdf,.docx,.txt" onChange={handleFileUpload} className="hidden" disabled={loading} />
                    <label htmlFor="resume" className="cursor-pointer block">
                      {formData.resume ? <><FileText size={32} className="text-accent mb-2 mx-auto" /><p className="font-medium text-primary">{formData.resume.name}</p><p className="text-xs text-gray-500 mt-1">Click to change</p></> : <><Upload size={32} className="text-gray-400 mb-2 mx-auto" /><p className="font-medium text-gray-700">Click to upload</p><p className="text-xs text-gray-500 mt-1">PDF, DOC, or DOCX (Max 5MB)</p></>}
                    </label>
                  </div>
                  {loading && <div className="mt-2 flex items-center gap-2 text-sm text-accent"><Loader2 className="w-4 h-4 animate-spin" /><span>Uploading resume...</span></div>}
                  {formData.resumeUrl && !loading && <div className="mt-2 flex items-center gap-2 text-sm text-green-600"><CheckCircle size={16} /><span>Resume uploaded successfully</span><button type="button" onClick={() => setFormData({ ...formData, resume: null, resumeUrl: "" })} className="text-red-500 hover:text-red-700 ml-auto"><X size={16} /></button></div>}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile <span className="text-red-500">*</span></label>
                  <div className="relative"><LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="url" placeholder="https://linkedin.com/in/username" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent" required /></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Links <span className="text-red-500">*</span></label>
                  <div className="relative"><Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="url" placeholder="https://yourportfolio.com" value={formData.portfolio} onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent" required /></div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2"><span className="w-1 h-6 bg-accent rounded-full"></span>Motivation</h2>
                <textarea placeholder="Why do you want to work with us? Share your motivation and what makes you a great fit..." value={formData.motivation} onChange={(e) => setFormData({ ...formData, motivation: e.target.value })} rows={5} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none" />
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2"><span className="w-1 h-6 bg-accent rounded-full"></span>Role Summary</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notice Period</label>
                  <input type="text" placeholder="2 weeks" value={formData.noticePeriod} onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Salary</label>
                  <input type="text" placeholder="$140k – $180k per year" value={formData.expectedSalary} onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent" />
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm"><Briefcase size={16} className="text-accent" /><span className="text-gray-600">Job Type:</span><span className="font-medium text-gray-800">{jobData.jobType?.name || "N/A"}</span></div>
                  {jobData.experienceLevel && (<div className="flex items-center gap-2 text-sm"><Users size={16} className="text-accent" /><span className="text-gray-600">Experience Range:</span><span className="font-medium text-gray-800">{jobData.experienceLevel.minYears} - {jobData.experienceLevel.maxYears} years</span></div>)}
                  {jobData.benefits && jobData.benefits.length > 0 && (<div className="flex items-center gap-2 text-sm"><Award size={16} className="text-accent" /><span className="text-gray-600">Benefits:</span><div className="flex flex-wrap gap-1">{jobData.benefits.map((benefit, idx) => (<span key={benefit.benefit?.id || idx} className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">{benefit.benefit?.name}</span>))}</div></div>)}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <button type="button" onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between"><h2 className="text-lg font-semibold text-primary flex items-center gap-2"><MessageCircle size={20} className="text-accent" />Chat with Recruiters</h2>{expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</button>
                {expanded && (<div className="mt-4 p-4 bg-gray-50 rounded-lg"><p className="text-sm text-gray-500 mb-3">Have questions about the role? Chat with our recruiters directly.</p><button type="button" className="flex items-center gap-2 text-accent font-medium hover:text-yellow-600 transition"><MessageCircle size={18} />Start Chat</button></div>)}
              </div>
              <div className="flex items-center justify-between gap-4 pt-4">
                <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition text-sm">Back</button>
                <button type="submit" disabled={submitting || loading} className="flex items-center gap-2 px-8 py-2.5 bg-accent text-primary font-semibold rounded-lg hover:bg-yellow-300 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed">{submitting ? <><Loader2 size={18} className="animate-spin" />Submitting...</> : <><span>Submit Application</span><ArrowRight size={18} /></>}</button>
              </div>
            </form>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden bg-gray-50 flex-shrink-0">
                  <img
                    src={
                      jobData.company?.logo ||
                      `https://dummyimage.com/80x80/facc15/111827.png&text=${(jobData.company?.name || "C")[0]}`
                    }
                    alt={jobData.company?.name || "Company"}
                    className="w-10 h-10 object-contain"
                    onError={(e) =>
                      (e.currentTarget.src = `https://dummyimage.com/80x80/facc15/111827.png&text=${(jobData.company?.name || "C")[0]}`)
                    }
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-primary leading-tight">{jobData.title}</h3>
                  <p className="text-sm text-gray-600">{jobData.company?.name || "N/A"}</p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm"><MapPin size={16} className="text-accent" /><span className="text-gray-600">Location:</span><span className="font-medium text-gray-800">{jobData.location ? `${jobData.location.city}, ${jobData.location.state}` : "N/A"}</span></div>
                {jobData.salaryMin || jobData.salaryMax ? (<div className="flex items-center gap-2 text-sm"><DollarSign size={16} className="text-accent" /><span className="text-gray-600">Salary:</span><span className="font-medium text-gray-800">{jobData.currency || ""} {jobData.salaryMin}{jobData.salaryMax ? ` - ${jobData.salaryMax}` : "+"}</span></div>) : (<div className="flex items-center gap-2 text-sm"><DollarSign size={16} className="text-accent" /><span className="text-gray-600">Salary:</span><span className="font-medium text-gray-800">Negotiable</span></div>)}
                <div className="flex items-center gap-2 text-sm"><Briefcase size={16} className="text-accent" /><span className="text-gray-600">Job Type:</span><span className="font-medium text-gray-800">{jobData.jobType?.name || "N/A"}</span></div>
                {jobData.experienceLevel && (<div className="flex items-center gap-2 text-sm"><Users size={16} className="text-accent" /><span className="text-gray-600">Seniority:</span><span className="font-medium text-gray-800">{jobData.experienceLevel.label}</span></div>)}
                <div className="flex items-center gap-2 text-sm"><Calendar size={16} className="text-accent" /><span className="text-gray-600">Deadline:</span><span className="font-medium text-gray-800">{jobData.applyDeadline ? new Date(jobData.applyDeadline).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) : "N/A"}</span></div>
              </div>
              {jobData.benefits && jobData.benefits.length > 0 && (<div className="border-t border-gray-200 pt-4 mt-4"><p className="text-xs text-gray-500 mb-2">Care Benefits</p><div className="space-y-1.5">{jobData.benefits.map((benefit, idx) => (<div key={benefit.benefit?.id || idx} className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle size={14} className="text-green-500 flex-shrink-0" /><span>{benefit.benefit?.name}</span></div>))}</div></div>)}
              <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="w-full mt-6 bg-primary text-white font-semibold py-2.5 rounded-lg hover:bg-primary/90 transition text-sm">Scroll to Form</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyPage;