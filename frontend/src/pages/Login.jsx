import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Globe2 } from "lucide-react";
import { toast } from "react-toastify"; // 👈 ADD THI
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";
import { loginUser } from "../api/auth";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};
    if (!form.email) err.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      err.email = "Enter a valid email";
    if (!form.password) err.password = "Password is required";
    else if (form.password.length < 6)
      err.password = "Minimum 6 characters";
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

    setErrors({});

    try {
      const res = await loginUser({
        email: form.email,
        password: form.password,
      });

      console.log("Login Success:", res);

      // Save JWT token only
      localStorage.setItem("access_token", res.access_token);
      
      // 👈 Show success toast
      toast.success(" Login successful! Welcome back!");
      
      // Redirect after toast
      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {
      console.error(error);
      
      // 👈 Show error toast
      const errorMessage = error.response?.data?.message || error.message || "Invalid credentials";
      toast.error(` ${errorMessage}`);
      
      setErrors({
        api: errorMessage,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div
        className="w-full max-w-md bg-white rounded-2xl overflow-hidden
                   shadow-[0_4px_6px_-1px_rgba(0,0,0,0.07),0_10px_40px_-4px_rgba(0,0,0,0.12)]
                   border border-gray-100"
        data-aos="fade-up"
      >
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
                Sign in to your account
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-yellow-400 w-4 h-4"
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-accent font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" size="full">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-accent font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;