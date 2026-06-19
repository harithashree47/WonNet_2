import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import { getCompanies } from "../api/company";

import "swiper/css";
import "swiper/css/free-mode";

const TopHiringCompanies = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const res = await getCompanies();
      if (res.success) setCompanies(res.data);
    };
    fetchCompanies();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            Top Hiring <span className="text-accent">Companies</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto mt-4 text-sm md:text-base">
            With more than 12 million employer reviews, Company Pages give people
            insights into potential employers and help you create a memorable
            candidate experience.
          </p>
        </div>

        {/* Infinite Carousel */}
        <div data-aos="fade-up" data-aos-delay="150">
          <Swiper
            modules={[Autoplay, FreeMode]}
            dir="rtl"
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            freeMode={true}
            speed={4000}
            allowTouchMove={false}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="pb-2 select-none"
          >
            {companies.map((company) => (
              <SwiperSlide key={company.id}>
                <div
                  dir="ltr"
                  className="flex flex-col items-center text-center p-6 group"
                >
                  {/* Circle Image */}
                  <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden group-hover:shadow-lg group-hover:border-accent transition duration-300">
                    <img
                      src={company.logo || `https://dummyimage.com/200x200/facc15/111827.png&text=${company.name[0]}`}
                      alt={company.name}
                      className="max-h-16 max-w-[70%] object-contain"
                      onError={(e) =>
                        (e.currentTarget.src = `https://dummyimage.com/200x200/facc15/111827.png&text=${company.name[0]}`)
                      }
                    />
                  </div>

                  {/* Text */}
                  <div className="mt-5">
                    <h3 className="font-semibold text-primary text-lg">
                      {company.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {company.location
                        ? `${company.location.city}, ${company.location.state}`
                        : "Location not specified"}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style>{`
        .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>
    </section>
  );
};

export default TopHiringCompanies;