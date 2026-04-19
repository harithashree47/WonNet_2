const variants = {
  primary: "bg-accent text-primary hover:bg-yellow-300",
  outline:
    "border border-primary text-primary hover:bg-primary hover:text-white",
  ghost: "text-primary hover:bg-gray-100",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
  full: "w-full py-2.5 text-sm",
};

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  className = "",
  icon: Icon,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-md font-semibold transition
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

export default Button;