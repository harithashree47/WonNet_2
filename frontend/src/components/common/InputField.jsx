const InputField = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  rightElement,
  required = false,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-primary mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative">
        {/* Left icon */}
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex items-center">
            <Icon size={16} />
          </span>
        )}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full py-2.5 rounded-md border text-sm
            focus:outline-none focus:ring-2 focus:ring-accent
            text-primary transition
            ${Icon ? "pl-9" : "pl-4"}
            ${rightElement ? "pr-10" : "pr-4"}
            ${disabled ? "opacity-60 cursor-not-allowed bg-gray-100" : ""}
            ${
              error
                ? "border-red-400 bg-red-50 focus:ring-red-300"
                : "border-gray-200 bg-gray-50 hover:border-gray-300"
            }
          `}
        />

        {/* Right element (e.g. eye icon) */}
        {rightElement && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {rightElement}
          </span>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;