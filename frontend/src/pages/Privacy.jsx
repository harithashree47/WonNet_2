import { Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";

const Privacy = () => {
  const breadcrumbItems = [
    { label: "Privacy Policy" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl p-8 md:p-12 border border-white/50">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-slate-700 bg-clip-text text-transparent mb-8">
            Privacy Policy
          </h1>
          
          <div className="space-y-8 text-gray-700">
            <section className="group">
              <div className="flex items-start gap-4">
                <div className="w-1 h-full min-h-[60px] bg-gradient-to-b from-accent to-yellow-300 rounded-full" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">1. Information We Collect</h2>
                  <p className="leading-relaxed text-gray-600">
                    We collect information you provide directly to us, such as when you create an account, update your profile, 
                    apply for jobs, or contact us. This includes your name, email address, phone number, and professional information.
                  </p>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4">
                <div className="w-1 h-full min-h-[60px] bg-gradient-to-b from-accent to-yellow-300 rounded-full" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">2. How We Use Your Information</h2>
                  <p className="leading-relaxed text-gray-600">
                    We use the information we collect to provide, maintain, and improve our services, to process your job applications, 
                    to communicate with you about updates and offers, and to ensure the security of our platform.
                  </p>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4">
                <div className="w-1 h-full min-h-[60px] bg-gradient-to-b from-accent to-yellow-300 rounded-full" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">3. Data Sharing & Disclosure</h2>
                  <p className="leading-relaxed text-gray-600">
                    We do not sell your personal information. We may share your data with potential employers when you apply for jobs, 
                    with service providers who assist our operations, or when required by law.
                  </p>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4">
                <div className="w-1 h-full min-h-[60px] bg-gradient-to-b from-accent to-yellow-300 rounded-full" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">4. Data Security</h2>
                  <p className="leading-relaxed text-gray-600">
                    We implement appropriate technical and organizational measures to protect your personal information against 
                    unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is 100% secure.
                  </p>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4">
                <div className="w-1 h-full min-h-[60px] bg-gradient-to-b from-accent to-yellow-300 rounded-full" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">5. Cookies & Tracking</h2>
                  <p className="leading-relaxed text-gray-600">
                    We use cookies and similar technologies to enhance your experience, analyze usage patterns, and personalize content. 
                    You can manage your cookie preferences through your browser settings.
                  </p>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4">
                <div className="w-1 h-full min-h-[60px] bg-gradient-to-b from-accent to-yellow-300 rounded-full" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">6. Your Rights</h2>
                  <p className="leading-relaxed text-gray-600">
                    You have the right to access, update, or delete your personal information. You can also opt out of marketing 
                    communications at any time. Contact us for any privacy-related concerns.
                  </p>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4">
                <div className="w-1 h-full min-h-[60px] bg-gradient-to-b from-accent to-yellow-300 rounded-full" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">7. Changes to Privacy Policy</h2>
                  <p className="leading-relaxed text-gray-600">
                    We may update this privacy policy from time to time. We will notify you of significant changes via email or 
                    through a prominent notice on our platform.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Last updated: June 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;