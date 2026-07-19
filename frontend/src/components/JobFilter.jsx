import { useState, useCallback } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";

const FilterContent = ({
  keyword,
  setKeyword,
  location,
  setLocation,
  category,
  setCategory,
  locations,
  categories,
  handleSearch,
  onReset,
  salaryMin,
  salaryMax,
  salaryValue,
  setSalaryValue,
}) => {
  return (
    <div className="p-5 space-y-5">
      {/* Search */}
      <div>
        <label className="font-semibold text-gray-800 mb-1.5 block text-sm">
          Search
        </label>
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent transition-colors duration-200"
            size={18}
          />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Job title..."
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-accent/30 focus:ring-2 focus:ring-accent/30 outline-none transition-all duration-200 text-sm text-gray-700"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="font-semibold text-gray-800 mb-1.5 block text-sm">
          Category
        </label>
        <div className="relative group">
          <Briefcase
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent transition-colors duration-200"
            size={18}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full py-3.5 rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-8 focus:bg-white focus:border-accent/30 focus:ring-2 focus:ring-accent/30 outline-none transition-all duration-200 text-sm text-gray-700 appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="font-semibold text-gray-800 mb-1.5 block text-sm">
          Location
        </label>
        <div className="relative group">
          <MapPin
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent transition-colors duration-200"
            size={18}
          />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full py-3.5 rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-8 focus:bg-white focus:border-accent/30 focus:ring-2 focus:ring-accent/30 outline-none transition-all duration-200 text-sm text-gray-700 appearance-none cursor-pointer"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.city}, {loc.state}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Salary Range */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1.5 text-sm">
          Salary Range
        </label>
        <div className="flex justify-between text-xs mb-2">
          <span className="text-gray-400">{salaryMin ? `₹${Number(salaryMin/1000).toFixed(0)}K` : '₹0K'}</span>
          <span className="font-medium text-gray-500">
            {salaryValue ? `₹${Number(salaryValue/100000).toFixed(1)}L+` : 'Any salary'}
          </span>
        </div>
        <input
          type="range"
          min={salaryMin || 0}
          max={salaryMax || 1000000}
          value={salaryValue}
          onChange={(e) => setSalaryValue(Number(e.target.value))}
          className="w-full accent-yellow-400"
        />
      </div>

      {/* Buttons */}
      <div className="space-y-2.5 pt-1">
        <button
          onClick={() => {
            handleSearch();
            onReset();
          }}
          className="w-full h-10 rounded-lg bg-yellow-400 font-semibold hover:bg-yellow-300 transition shadow flex justify-center items-center gap-2 text-sm"
        >
          <Search size={16} />
          Apply Filters
        </button>

        <button
          onClick={onReset}
          className="w-full h-10 rounded-lg border border-gray-200 hover:bg-gray-50 transition flex justify-center items-center gap-2 text-sm"
        >
          <RotateCcw size={15} />
          Reset Filters
        </button>
      </div>
    </div>
  );
};

const JobFilter = ({
  keyword,
  setKeyword,
  location,
  setLocation,
  category,
  setCategory,
  locations,
  categories,
  handleSearch,
  onReset,
  salaryMin = 0,
  salaryMax = 1000000,
}) => {
  const [open, setOpen] = useState(false);
  const [salaryValue, setSalaryValue] = useState(salaryMax || 1000000);

  const wrappedHandleSearch = useCallback(() => {
    handleSearch();
    setOpen(false);
  }, [handleSearch]);

  const wrappedOnReset = useCallback(() => {
    onReset();
    setOpen(false);
  }, [onReset]);

  return (
    <>
      {/* Mobile trigger */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg py-2.5 text-sm font-semibold shadow-sm"
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <aside className="sticky top-24">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gray-900 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center">
                  <SlidersHorizontal className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">
                    Find Dream Job
                  </h2>
                  <p className="text-gray-300 text-xs mt-0.5">
                    Discover thousands of verified jobs.
                  </p>
                </div>
              </div>
            </div>
            <FilterContent
              keyword={keyword}
              setKeyword={setKeyword}
              location={location}
              setLocation={setLocation}
              category={category}
              setCategory={setCategory}
              locations={locations}
              categories={categories}
              handleSearch={wrappedHandleSearch}
              onReset={wrappedOnReset}
              salaryMin={salaryMin}
              salaryMax={salaryMax}
              salaryValue={salaryValue}
              setSalaryValue={setSalaryValue}
            />
          </div>
        </aside>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <FilterContent
              keyword={keyword}
              setKeyword={setKeyword}
              location={location}
              setLocation={setLocation}
              category={category}
              setCategory={setCategory}
              locations={locations}
              categories={categories}
              handleSearch={wrappedHandleSearch}
              onReset={wrappedOnReset}
              salaryMin={salaryMin}
              salaryMax={salaryMax}
              salaryValue={salaryValue}
              setSalaryValue={setSalaryValue}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default JobFilter;
