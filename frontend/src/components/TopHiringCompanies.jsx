import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";

const companies = [
  {
    name: "Elink Inc.",
    jobs: "2 Jobs Afghanistan",
    logo: "https://dummyimage.com/200x200/facc15/111827.png&text=E",
  },
  {
    name: "Envato Inc.",
    jobs: "3 Jobs Afghanistan",
    logo: "https://dummyimage.com/200x200/111827/facc15.png&text=En",
  },
  {
    name: "Hymalyas Inc",
    jobs: "2 Jobs Afghanistan",
    logo: "https://dummyimage.com/200x200/facc15/111827.png&text=H",
  },
  {
    name: "Pepper Inc.",
    jobs: "3 Jobs Afghanistan",
    logo: "https://dummyimage.com/200x200/111827/facc15.png&text=P",
  },
  {
    name: "Tech Corp",
    jobs: "5 Jobs Afghanistan",
    logo: "https://dummyimage.com/200x200/facc15/111827.png&text=T",
  },
  {
    name: "Designly",
    jobs: "4 Jobs Afghanistan",
    logo: "https://dummyimage.com/200x200/111827/facc15.png&text=D",
  },
];

const TopHiringCompanies = () => {
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
            speed={4000} // smooth continuous speed
            allowTouchMove={false}
            autoplay={{
              delay: 0, // 👈 zero delay = continuous
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
            {companies.map((company, index) => (
              <SwiperSlide key={index}>
                <div
                  dir="ltr"
                  className="flex flex-col items-center text-center p-6 group"
                >
                  {/* Circle Image */}
                  <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden group-hover:shadow-lg group-hover:border-accent transition duration-300">
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="max-h-16 max-w-[70%] object-contain"
                    />
                  </div>

                  {/* Text */}
                  <div className="mt-5">
                    <h3 className="font-semibold text-primary text-lg">
                      {company.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{company.jobs}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Make autoplay perfectly linear (no easing jumps) */}
      <style>{`
        .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>
    </section>
  );
};

export default TopHiringCompanies;
