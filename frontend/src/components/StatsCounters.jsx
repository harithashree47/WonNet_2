import { useEffect, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  Users,
  ClipboardList,
} from "lucide-react";

const stats = [
  { label: "Live Job Listings", value: 963, icon: BriefcaseBusiness },
  { label: "Hiring Companies", value: 570, icon: Building2 },
  { label: "Active Candidates", value: 1262, icon: Users },
  { label: "Total Applications", value: 825, icon: ClipboardList },
];

const useCountUp = (end, start) => {
  const [value, setValue] = useState(0);
  const frame = useRef(null);

  useEffect(() => {
    if (!start) {
      setValue(0);
      if (frame.current) cancelAnimationFrame(frame.current);
      return;
    }

    const duration = 1200;
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const current = Math.floor(progress * end);
      setValue(current);
      if (progress < 1) frame.current = requestAnimationFrame(animate);
    };

    frame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame.current || 0);
  }, [end, start]);

  return value;
};

const JobStats = () => {
  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.4 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative py-10 md:py-14 bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(15,23,42,0.88), rgba(15,23,42,0.88)), url('https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg?auto=compress&cs=tinysrgb&w=1600')",
      }}
    >
      <div
        className="
          max-w-7xl mx-auto px-4
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
          gap-6 sm:gap-8
        "
      >
        {stats.map((item, index) => {
          const Icon = item.icon;
          const count = useCountUp(item.value, inView);

          return (
            <div
              key={item.label}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="
                flex flex-col items-center
                sm:flex-row sm:items-center
                gap-2 sm:gap-4 text-white
                justify-center sm:justify-start
              "
            >
              <div className="text-accent flex justify-center">
                <Icon size={28} strokeWidth={2.2} className="sm:w-8 sm:h-8" />
              </div>

              <div className="text-center sm:text-left">
                <div className="text-xl sm:text-2xl md:text-3xl font-semibold leading-tight">
                  {count.toLocaleString()}
                </div>
                <div className="text-[11px] sm:text-xs md:text-sm text-gray-200">
                  {item.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default JobStats;