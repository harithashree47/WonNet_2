import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { getActiveCategories } from "../api/category";
import { getLocations } from "../api/location";

const Banner = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);

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
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (location) params.set("location", location);
    if (category) params.set("category", category);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <section
      className="relative min-h-[70vh] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600')",
      }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative max-w-6xl mx-auto px-4 w-full">
        {/* Heading */}
        <div className="text-center mb-10" data-aos="fade-up">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            The Easiest Way to{" "}
            <span className="text-accent">Get Your New Job</span>
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-gray-300">
            Find Jobs, Employment & Career Opportunities
          </p>
        </div>

        {/* Search filters */}
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {/* Keyword */}
          <div className="md:col-span-1">
            <label className="block text-white text-sm font-semibold mb-2">
              Search Job Now:
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter keywords..."
              className="w-full px-4 py-2.5 rounded-sm bg-white text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Job Locations
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-sm bg-white text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Job Locations</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.city}, {loc.state}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Job Categories
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-sm bg-white text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Job Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search button */}
          <div>
            <button
              onClick={handleSearch}
              className="w-full flex items-center justify-center gap-2 bg-accent text-primary font-semibold px-6 py-2.5 rounded-sm hover:bg-yellow-300 transition text-sm"
            >
              <Search size={16} />
              Search
            </button>
          </div>
        </div>

        {/* Keywords hint */}
        <p
          className="mt-4 text-gray-300 text-xs"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          <span className="font-semibold text-white">Keywords: </span>
          <span className="italic">Html, Css, WordPress</span>
        </p>
      </div>
    </section>
  );
};

export default Banner;