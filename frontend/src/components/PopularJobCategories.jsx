import { useState, useEffect } from "react";
import { getActiveCategories } from "../api/category";
import { getJobsByCategory } from "../api/job";
import {
  GraduationCap,
  HeartPulse,
  Scale,
  Bike,
  Car,
  Gamepad2,
  UserRound,
  Landmark,
} from "lucide-react";

const iconList = [
  GraduationCap,
  HeartPulse,
  Scale,
  Bike,
  Car,
  Gamepad2,
  UserRound,
  Landmark,
];

const PopularJobCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getActiveCategories();
      if (res.success) setCategories(res.data);
    };
    fetchCategories();
  }, []);

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            Popular Job <span className="text-accent">Categories</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto mt-4 text-sm md:text-base">
            One of our jobs has some kind of flexibility option – such as
            telecommuting, part-time schedule or a flexible or flextime schedule.
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => {
            const Icon = iconList[index % iconList.length];
            const vacancyCount = cat.jobs ? cat.jobs.length : 0;
            return (
              <div
                key={cat.id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="relative group bg-gray-50 border border-gray-200 rounded-md
                           p-8 flex flex-col items-center text-center overflow-hidden"
              >
                {/* dark overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />

                {/* Icon circle */}
                <div
                  className="relative w-16 h-16 flex items-center justify-center rounded-full
                             bg-accent/10 text-accent mb-4
                             transition-colors duration-300
                             group-hover:bg-black group-hover:text-accent"
                >
                  <Icon size={32} strokeWidth={2} />
                </div>

                {/* Text */}
                <h3 className="relative font-semibold text-primary text-base md:text-lg">
                  {cat.name}
                </h3>
                <p className="relative text-xs md:text-sm text-gray-500 mt-2">
                  ({vacancyCount} Open Vacancies)
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PopularJobCategories;