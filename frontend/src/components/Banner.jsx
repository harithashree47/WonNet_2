import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Briefcase } from "lucide-react";
import { getActiveCategories } from "../api/category";
import { getLocations } from "../api/location";

const Banner = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [catRes, locRes] = await Promise.all([
        getActiveCategories(),
        getLocations(),
      ]);
      if (catRes.success) setCategories(catRes.data);
      if (locRes.success) setLocations(locRes.data);
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    setFlipping(true);
    setTimeout(() => {
      const params = new URLSearchParams();
      if (keyword) params.set("keyword", keyword);
      if (location) params.set("location", location);
      if (category) params.set("category", category);
      navigate(`/jobs?${params.toString()}`);
    }, 700);
  };

  return (
    <section
      className="relative min-h-[50vh] md:min-h-[70vh] flex items-center justify-center bg-cover bg-center pt-16 md:pt-0"
      style={{
        backgroundImage:
          "url('https://t4.ftcdn.net/jpg/09/02/53/81/360_F_902538150_JCEcejSQkRHHR7d5jE1nbmfhXHdcd9E3.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative max-w-6xl mx-auto px-4 w-full">
        {/* Heading */}
        <div className="text-center mb-4 md:mb-12" data-aos="fade-up">
          <h1 className="text-2xl md:text-4xl lg:text-[42px] font-bold text-white mb-1 md:mb-3 tracking-tight leading-tight">
            Find Your Next{" "}
            <span className="text-accent">Dream Job</span>
          </h1>
          <p className="text-xs md:text-base text-gray-200/90">
            Search from millions of job opportunities
          </p>
        </div>

        {/* Search card */}
        <div
          className="bg-white rounded-xl md:rounded-2xl shadow-2xl p-1.5 md:p-1.5 max-w-full md:max-w-5xl mx-auto relative"
          style={{ perspective: "1200px" }}
        >
          <div
            className="relative transition-all duration-700"
            style={{ transformStyle: "preserve-3d", transform: flipping ? "rotateY(180deg)" : "rotateY(0deg)" }}
          >
            {/* Front */}
            <div
              className="transition-all duration-500"
              style={{ backfaceVisibility: "hidden", opacity: flipping ? 0 : 1 }}
            >
              <div className="flex flex-col md:flex-row md:items-stretch gap-2 md:gap-3">
                {/* Keyword */}
                <div className="flex-1 relative group" data-aos="fade-up" data-aos-delay="0">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 md:pl-4 pointer-events-none text-gray-400 group-focus-within:text-accent transition-all duration-200">
                    <Search size={16} className={`transition-transform duration-300 ${keyword ? 'rotate-90' : 'rotate-0'}`} />
                  </div>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Job title, keyword..."
                    className="w-full pl-9 md:pl-11 pr-3 md:pr-4 py-2.5 md:py-3.5 rounded-lg md:rounded-xl bg-gray-50 text-gray-700 text-xs md:text-[15px] placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent/30 transition-all duration-200"
                  />
                </div>

                {/* Location */}
                <div className="flex-1 relative group" data-aos="fade-up" data-aos-delay="100">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 md:pl-4 pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors duration-200">
                    <MapPin size={14} className={`transition-transform duration-300 ${location ? 'rotate-12' : 'rotate-0'}`} />
                  </div>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-9 md:pl-11 pr-7 md:pr-8 py-2.5 md:py-3.5 rounded-lg md:rounded-xl bg-gray-50 text-gray-700 text-xs md:text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent/30 appearance-none cursor-pointer transition-all duration-200 hover:shadow-md"
                  >
                    <option value="">Location</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.city}, {loc.state}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div className="flex-1 relative group" data-aos="fade-up" data-aos-delay="200">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 md:pl-4 pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors duration-200">
                    <Briefcase size={14} className={`transition-transform duration-300 ${category ? '-rotate-12' : 'rotate-0'}`} />
                  </div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full pl-9 md:pl-11 pr-7 md:pr-8 py-2.5 md:py-3.5 rounded-lg md:rounded-xl bg-gray-50 text-gray-700 text-xs md:text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent/30 appearance-none cursor-pointer transition-all duration-200 hover:shadow-md"
                  >
                    <option value="">Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search button */}
                <button
                  onClick={handleSearch}
                  className="md:hidden flex items-center justify-center gap-2 bg-accent hover:bg-yellow-400 text-primary font-semibold px-6 py-2.5 rounded-lg transition-all duration-200 shadow-md text-xs w-full"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <Search size={14} />
                  Search
                </button>

                <button
                  onClick={handleSearch}
                  className="hidden md:flex items-center justify-center gap-2 bg-accent hover:bg-yellow-400 text-primary font-semibold px-6 md:px-8 py-2.5 md:py-3.5 rounded-lg md:rounded-xl transition-all duration-200 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 text-xs md:text-sm whitespace-nowrap"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <Search size={14} />
                  <span className="md:inline hidden">Search</span>
                </button>
              </div>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 flex items-center justify-center bg-white rounded-2xl shadow-2xl"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", opacity: flipping ? 1 : 0, transition: "opacity 0.5s" }}
            >
              <div className="text-center">
                <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mb-2" />
                <p className="text-sm text-gray-600 font-medium">Searching jobs...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;