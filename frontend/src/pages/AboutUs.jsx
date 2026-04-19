import Breadcrumb from "../components/Breadcrumb";
import {
  Target,
  Eye,
  Users,
  Award,
  Briefcase,
  Globe2,
  HeartHandshake,
  TrendingUp,
} from "lucide-react";
import JobStats from "../components/StatsCounters";


const values = [
  {
    icon: Target,
    title: "Our Mission",
    desc: "To bridge the gap between talented professionals and top employers, making job searching and hiring seamless, efficient, and rewarding for everyone involved.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    desc: "To become the most trusted job platform globally, empowering millions of people to find meaningful work and build successful careers.",
  },
  {
    icon: HeartHandshake,
    title: "Our Values",
    desc: "Integrity, transparency, and inclusivity are at the core of everything we do. We believe every person deserves equal access to great opportunities.",
  },
  {
    icon: TrendingUp,
    title: "Our Growth",
    desc: "Since our founding, we have helped thousands of companies hire top talent and helped tens of thousands of candidates land their dream jobs.",
  },
];

const team = [
  {
    name: "Alex Johnson",
    role: "CEO & Founder",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Sarah Williams",
    role: "Head of Operations",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Michael Chen",
    role: "Lead Developer",
    img: "https://randomuser.me/api/portraits/men/52.jpg",
  },
  {
    name: "Emily Davis",
    role: "Marketing Director",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const AboutUs = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: "About Us", href: "/about" }]} />

      {/* Intro section */}
      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Who We <span className="text-accent">Are</span>
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
              WonNet is a smart job and talent network dedicated to connecting
              ambitious professionals with forward-thinking companies. We
              believe that finding the right job — or the right person — should
              not be complicated. Our platform makes it simple, fast, and
              effective for both job seekers and employers.
            </p>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <JobStats/>

      {/* Mission / Vision / Values */}
      <section className="py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              What Drives <span className="text-accent">Us</span>
            </h2>
            <p className="text-gray-500 mt-3 text-sm md:text-base max-w-xl mx-auto">
              Our core principles that guide every decision we make.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  className="bg-white border border-gray-200 rounded-md p-6 group hover:border-accent transition duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-black transition duration-300">
                    <Icon
                      size={22}
                      className="text-accent group-hover:text-accent transition duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-primary text-base mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team section */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Meet Our <span className="text-accent">Team</span>
            </h2>
            <p className="text-gray-500 mt-3 text-sm md:text-base max-w-xl mx-auto">
              The passionate people behind WonNet who make it all happen.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div
                key={member.name}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="bg-gray-50 border border-gray-200 rounded-md p-6 flex flex-col items-center text-center group hover:border-accent transition duration-300"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-accent/30 mb-4 group-hover:border-accent transition duration-300">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-primary text-base">
                  {member.name}
                </h3>
                <p className="text-xs text-accent font-medium mt-1">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-14 px-4 bg-primary">
        <div
          className="max-w-3xl mx-auto text-center"
          data-aos="fade-up"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Find Your{" "}
            <span className="text-accent">Dream Job?</span>
          </h2>
          <p className="text-gray-300 text-sm md:text-base mb-6">
            Join thousands of professionals who found their perfect career
            match on WonNet. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/jobs"
              className="bg-accent text-primary font-semibold px-6 py-3 rounded-md hover:bg-yellow-300 transition text-sm"
            >
              Browse Jobs
            </a>
            <a
              href="/login"
              className="border border-white text-white font-semibold px-6 py-3 rounded-md hover:bg-white hover:text-primary transition text-sm"
            >
              Create Account
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;