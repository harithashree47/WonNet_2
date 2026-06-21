import { useState } from "react";
import { X, Upload, FileText, CheckCircle } from "lucide-react";

const ApplyModal = ({ isOpen, job, onClose, onSubmit }) => {
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResume(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("jobId", job.id);
      if (resume) formData.append("resume", resume);
      if (coverLetter) formData.append("coverLetter", coverLetter);

      if (onSubmit) {
        await onSubmit(formData);
      }

      setSubmitted(true);
      setTimeout(() => {
        setResume(null);
        setCoverLetter("");
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error submitting application:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-primary text-white p-6 flex items-center justify-between border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold">Apply for Position</h2>
            <p className="text-accent text-sm mt-1">{job.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-primary/80 p-2 rounded transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Success State */}
        {submitted ? (
          <div className="p-8 text-center">
            <div className="mb-4 flex justify-center">
              <CheckCircle size={64} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-2">
              Application Submitted!
            </h3>
            <p className="text-gray-600 mb-4">
              Thank you for applying. We'll review your application and get back
              to you soon.
            </p>
            <p className="text-sm text-gray-500">
              Closing modal in a moment...
            </p>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Job Summary */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-primary mb-2">Job Summary</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-700">Position:</span>{" "}
                  {job.title}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Company:</span>{" "}
                  {job.company?.name}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Location:</span>{" "}
                  {job.location?.city}, {job.location?.state}
                </p>
              </div>
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <span className="text-red-500">*</span> Upload Resume/CV
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-accent transition cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                  required
                  className="hidden"
                  id="resume-upload"
                />
                <label
                  htmlFor="resume-upload"
                  className="cursor-pointer block"
                >
                  {resume ? (
                    <div className="flex flex-col items-center">
                      <FileText size={32} className="text-accent mb-2" />
                      <p className="font-medium text-primary">{resume.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Click to change
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload size={32} className="text-gray-400 mb-2" />
                      <p className="font-medium text-gray-700">
                        Click to upload
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, or DOCX (Max 5MB)
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Cover Letter (Optional)
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell us why you're a great fit for this role..."
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                rows="5"
              />
              <p className="text-xs text-gray-500 mt-2">
                {coverLetter.length} / 1000 characters
              </p>
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="confirm"
                required
                className="mt-1 w-4 h-4 text-accent cursor-pointer"
              />
              <label
                htmlFor="confirm"
                className="text-sm text-gray-600 cursor-pointer"
              >
                I confirm that the information provided is accurate and
                complete. By submitting this application, I agree to the terms
                and conditions.
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-accent text-primary font-semibold py-3 rounded-lg hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplyModal;