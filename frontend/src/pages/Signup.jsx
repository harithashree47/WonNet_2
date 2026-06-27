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
import { toast } from "react-toastify"; // 👈 ADD THIS
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";
import { registerUser } from "../api/auth";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
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

    if (!form.agree) err.agree = "You must accept the terms";

    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (Object.keys(err).length > 0) {
      setErrors(err);
      // 👈 Show validation error toasts
      Object.values(err).forEach(errorMsg => {
        toast.error(errorMsg);
      });
      return;
    }

    const userData = {
      name: form.name,
      email: form.email,
      mobile: form.mobile,
      password: form.password,
    };

    try {
      setSubmitting(true);

      const res = await registerUser(userData);
      console.log("Signup Success:", res);
      
      // 👈 Show success toast
      toast.success(" Account created successfully! Please login.");
      
      // Redirect to login after toast
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error(error);
      
      // 👈 Show error toast
      const errorMessage = error.response?.data?.message || error.message || "Registration failed";
      toast.error(` ${errorMessage}`);
      
      setErrors({
        api: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow border border-gray-100">
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
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              error={errors.email}
              icon={Mail}
              required
            />

            <InputField
              label="Mobile Number"
              type="tel"
              value={form.mobile}
              onChange={(e) =>
                setForm({ ...form, mobile: e.target.value })
              }
              error={errors.mobile}
              icon={Phone}
              required
            />

            <InputField
              label="Password"
              type={showPassword ? "text" : "password"}
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
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={(e) =>
                    setForm({ ...form, agree: e.target.checked })
                  }
                />
                <span className="text-sm">
                  I agree to Terms & Privacy Policy
                </span>
              </label>
              {errors.agree && (
                <p className="text-xs text-red-500">{errors.agree}</p>
              )}
            </div>

            <Button type="submit" size="full" loading={submitting} disabled={submitting}>
              {submitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-accent font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;