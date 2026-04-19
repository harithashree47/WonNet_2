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
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
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
    navigate("/login");
  };

  return (
    // light shade outer bg
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-100">
      {/* card with shadow */}
      <div
        className="w-full max-w-md bg-white rounded-2xl overflow-hidden
                   shadow-[0_4px_6px_-1px_rgba(0,0,0,0.07),0_10px_40px_-4px_rgba(0,0,0,0.12)]
                   border border-gray-100"
        data-aos="fade-up"
      >
        {/* top accent bar */}
        <div className="h-1.5 w-full bg-accent" />

        <div className="px-8 py-10">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-accent border-2 border-accent/60">
              <Globe2 size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">
                Won<span className="text-accent">Net!</span>
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Create Your Account
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              error={errors.name}
              icon={User}
              required
            />

            <InputField
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              error={errors.email}
              icon={Mail}
              required
            />

            <InputField
              label="Phone Number"
              type="tel"
              placeholder="+1 234 567 890"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              error={errors.phone}
              icon={Phone}
              required
            />

            <InputField
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              error={errors.password}
              icon={Lock}
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="text-gray-400 hover:text-primary transition"
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              }
            />

           

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

            <Button type="submit" size="full">
              Create Account
            </Button>
          </form>

            
 {/* Divider */}
          <div className="flex items-center gap-2 my-2">
          </div>

          <p className="text-center text-sm text-gray-500">
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