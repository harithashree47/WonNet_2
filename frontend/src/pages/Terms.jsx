import { Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";

const Terms = () => {
  const breadcrumbItems = [
    { label: "Terms & Conditions" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl p-8 md:p-12 border border-white/50">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-slate-700 bg-clip-text text-transparent mb-8">
            Terms & Conditions
          </h1>
          
          <div className="space-y-8 text-gray-700">
            <section className="group">
              <div className="flex items-start gap-4">
                <div className="w-1 h-full min-h-[60px] bg-gradient-to-b from-accent to-yellow-300 rounded-full" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">1. Acceptance of Terms</h2>
                  <p className="leading-relaxed text-gray-600">
                    By accessing and using WonNet!, you accept and agree to be bound by the terms and provisions of this agreement. 
                    If you do not agree to these Terms & Conditions, please do not use our platform.
                  </p>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4">
                <div className="w-1 h-full min-h-[60px] bg-gradient-to-b from-accent to-yellow-300 rounded-full" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">2. User Responsibilities</h2>
                  <p className="leading-relaxed text-gray-600">
                    Users are responsible for maintaining the confidentiality of their account information and for all activities 
                    that occur under their account. You agree to notify us immediately of any unauthorized use of your account.
                  </p>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4">
                <div className="w-1 h-full min-h-[60px] bg-gradient-to-b from-accent to-yellow-300 rounded-full" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">3. Job Postings & Applications</h2>
                  <p className="leading-relaxed text-gray-600">
                    Employers are responsible for the accuracy of job postings. Job seekers must provide truthful information 
                    in their applications. WonNet! does not guarantee employment or placement.
                  </p>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4">
                <div className="w-1 h-full min-h-[60px] bg-gradient-to-b from-accent to-yellow-300 rounded-full" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">4. Privacy & Data Protection</h2>
                  <p className="leading-relaxed text-gray-600">
                    We value your privacy. Personal information collected through our platform is used solely for providing 
                    and improving our services. We do not sell or share your data with third parties without consent.
                  </p>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4">
                <div className="w-1 h-full min-h-[60px] bg-gradient-to-b from-accent to-yellow-300 rounded-full" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">5. Intellectual Property</h2>
                  <p className="leading-relaxed text-gray-600">
                    All content, features, and functionality of WonNet! are owned by us and are protected by international 
                    copyright, trademark, and other intellectual property laws.
                  </p>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4">
                <div className="w-1 h-full min-h-[60px] bg-gradient-to-b from-accent to-yellow-300 rounded-full" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">6. Modifications to Terms</h2>
                  <p className="leading-relaxed text-gray-600">
                    We reserve the right to modify these terms at any time. Continued use of the platform after changes 
                    constitutes acceptance of the modified terms.
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

export default Terms;