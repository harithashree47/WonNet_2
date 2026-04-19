const SelectField = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  error,
  icon: Icon,
  required = false,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-primary mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon size={16} />
          </span>
        )}
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full py-2.5 rounded-md border text-sm
            focus:outline-none focus:ring-2 focus:ring-accent
            text-primary bg-white transition appearance-none
            ${Icon ? "pl-9" : "pl-4"} pr-4
            ${disabled ? "opacity-60 cursor-not-allowed bg-gray-100" : ""}
            ${
              error
                ? "border-red-400 bg-red-50 focus:ring-red-300"
                : "border-gray-200 bg-gray-50 hover:border-gray-300"
            }
          `}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option
              key={opt.value ?? opt}
              value={opt.value ?? opt}
            >
              {opt.label ?? opt}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default SelectField;