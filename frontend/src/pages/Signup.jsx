import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Globe2,
  User,
  Phone,
} from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "jobseeker",
    password: "",
    confirm: "",
    agree: false,
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};
    if (!form.name) err.name = "Full name is required";
    if (!form.email) err.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      err.email = "Enter a valid email";
    if (!form.phone) err.phone = "Phone number is required";
    if (!form.password) err.password = "Password is required";
    else if (form.password.length < 6)
      err.password = "Minimum 6 characters";
    if (!form.confirm) err.confirm = "Please confirm your password";
    else if (form.confirm !== form.password)
      err.confirm = "Passwords do not match";
    if (!form.agree) err.agree = "You must accept the terms";
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }
    setErrors({});
    // handle signup logic here
    navigate("/login");
  };

  const Field = ({ id, label, icon: Icon, error, children }) => (
    <div>
      <label className="block text-sm font-medium text-primary mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Icon
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        {children}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-10"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600')",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-primary/80" />

      <div
        className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
        data-aos="fade-up"
      >
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-accent" />

        <div className="px-8 py-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-accent border-2 border-accent/60 mb-3">
              <Globe2 size={24} />
            </div>
            <h1 className="text-2xl font-bold text-primary">
              Won<span className="text-accent">Net!</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Create your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <Field
              label="Full Name"
              icon={User}
              error={errors.name}
            >
              <input
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`w-full pl-9 pr-4 py-2.5 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-accent text-primary ${
                  errors.name
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              />
            </Field>

            {/* Email */}
            <Field
              label="Email Address"
              icon={Mail}
              error={errors.email}
            >
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className={`w-full pl-9 pr-4 py-2.5 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-accent text-primary ${
                  errors.email
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              />
            </Field>

            {/* Phone */}
            <Field
              label="Phone Number"
              icon={Phone}
              error={errors.phone}
            >
              <input
                type="tel"
                placeholder="+1 234 567 890"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                className={`w-full pl-9 pr-4 py-2.5 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-accent text-primary ${
                  errors.phone
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              />
            </Field>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["jobseeker", "employer"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm({ ...form, role: r })}
                    className={`py-2.5 rounded-md border text-sm font-semibold capitalize transition ${
                      form.role === r
                        ? "bg-accent text-primary border-accent"
                        : "border-gray-200 text-gray-500 hover:border-accent hover:text-accent"
                    }`}
                  >
                    {r === "jobseeker" ? "Job Seeker" : "Employer"}
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className={`w-full pl-9 pr-10 py-2.5 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-accent text-primary ${
                    errors.password
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={(e) =>
                    setForm({ ...form, confirm: e.target.value })
                  }
                  className={`w-full pl-9 pr-10 py-2.5 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-accent text-primary ${
                    errors.confirm
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirm && (
                <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>
              )}
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={(e) =>
                    setForm({ ...form, agree: e.target.checked })
                  }
                  className="accent-yellow-400 w-4 h-4 mt-0.5"
                />
                <span className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-accent font-medium hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-accent font-medium hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agree && (
                <p className="text-xs text-red-500 mt-1">{errors.agree}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-accent text-primary font-semibold py-2.5 rounded-md hover:bg-yellow-300 transition text-sm"
            >
              Create Account
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <span className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">or continue with</span>
              <span className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-md py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-4 h-4"
              />
              Sign up with Google
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-accent font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;