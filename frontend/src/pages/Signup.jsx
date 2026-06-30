import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Terms from "./Terms";
import Privacy from "./Privacy";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Globe2,
  User,
  Phone,
  Briefcase,
} from "lucide-react";
import { toast } from "react-toastify";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";
import { registerUser } from "../api/auth";

const Signup = ({ onSwitchToLogin, onClose }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    password: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const err = {};

    if (!form.name) err.name = "Full name is required";

    if (!form.email) err.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      err.email = "Enter a valid email";

    if (!form.mobile) err.mobile = "Mobile number is required";

    if (!form.password) err.password = "Password is required";
    else if (form.password.length < 6)
      err.password = "Minimum 6 characters";

    if (!form.agree) err.agree = "You must accept the terms and privacy policy";

    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (Object.keys(err).length > 0) {
      setErrors(err);
      // Show only the first error (topmost field) to guide user step by step
      const firstError = Object.values(err)[0];
      toast.error(firstError);
      return;
    }

    const userData = {
      name: form.name,
      email: form.email,
      mobile: form.mobile,
      designation: form.designation,
      password: form.password,
    };

    try {
      setSubmitting(true);

      const res = await registerUser(userData);
      
      toast.success(" Account created successfully! Please login.");
      
      if (onClose) onClose();

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Registration failed";
      toast.error(` ${errorMessage}`);
      setErrors({ api: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  const cardContent = (
    <div className="px-4 pt-5 pb-4 sm:px-5 sm:pt-6 sm:pb-5">
      {/* Premium Logo Section */}
      <div className="flex items-center justify-center gap-4 mb-6 sm:mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-accent to-yellow-300 rounded-full blur-lg opacity-40 animate-pulse" />
          <div className="relative flex h-10 w-10 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-slate-800 text-accent shadow-2xl ring-4 ring-accent/20">
            <Globe2 size={20} strokeWidth={1.5} className="sm:size-5" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-slate-700 to-primary bg-clip-text text-transparent">
            Won<span className="text-accent">Net!</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold tracking-wide">
            Create your account
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4">
        <InputField
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
          icon={User}
          required
        />

        <InputField
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
          icon={Mail}
          required
        />

        <InputField
          label="Mobile Number"
          type="tel"
          placeholder="+91 98765 43210"
          value={form.mobile}
          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          error={errors.mobile}
          icon={Phone}
          required
        />

        <InputField
          label="Designation"
          type="text"
          placeholder="Software Engineer"
          value={form.designation}
          onChange={(e) => setForm({ ...form, designation: e.target.value })}
          error={errors.designation}
          icon={Briefcase}
        />

        <InputField
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
          icon={Lock}
          required
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="text-gray-400 hover:text-accent transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        {/* Terms */}
        <div className="flex items-center gap-2.5">
          <input
            type="checkbox"
            checked={form.agree}
            onChange={(e) => setForm({ ...form, agree: e.target.checked })}
            className="w-4 h-4 rounded border-2 border-gray-300 text-accent focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all flex-shrink-0"
          />
          <span className="text-xs text-gray-600 transition-colors leading-relaxed">
            I agree to{" "}
            <Link to="/terms" className="text-accent font-semibold hover:underline">Terms</Link>
            {" "}&{" "}
            <Link to="/privacy" className="text-accent font-semibold hover:underline">Privacy Policy</Link>
          </span>
        </div>
        {errors.agree && (
          <p className="text-xs text-red-500 -mt-2">{errors.agree}</p>
        )}

        <div className="pt-2">
          <Button type="submit" size="full" loading={submitting} disabled={submitting}>
            {submitting ? "Creating Account..." : "Create Account"}
          </Button>
        </div>
      </form>

      <div className="mt-6 sm:mt-6 pt-4 sm:pt-4 border-t border-gray-100">
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-accent font-bold hover:underline decoration-2 underline-offset-4"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );

  if (onClose) {
    return cardContent;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow border border-gray-100">
        {cardContent}
      </div>
    </div>
  );
};

export default Signup;