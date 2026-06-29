import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Globe2 } from "lucide-react";
import { toast } from "react-toastify";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";
import { loginUser } from "../api/auth";

const Login = ({ onSwitchToSignup, onClose }) => {
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

      localStorage.setItem("access_token", res.access_token);
      toast.success(" Login successful! Welcome back!");
      
      if (onClose) onClose();
      window.location.reload();
      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Invalid credentials";
      toast.error(` ${errorMessage}`);
      setErrors({ api: errorMessage });
    }
  };

  const cardContent = (
    <div className="px-6 pt-8 pb-6">
      {/* Premium Logo Section */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-accent to-yellow-300 rounded-full blur-lg opacity-40 animate-pulse" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-slate-800 text-accent shadow-2xl ring-4 ring-accent/20">
            <Globe2 size={32} strokeWidth={1.5} />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-slate-700 to-primary bg-clip-text text-transparent">
            Won<span className="text-accent">Net!</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold tracking-wide">
            Welcome back
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
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
          icon={Mail}
          required
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

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2.5 text-gray-600 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-2 border-gray-300 text-accent focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              />
            </div>
            <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-accent font-bold hover:underline decoration-2 underline-offset-4">
            Forgot password?
          </Link>
        </div>

        <div className="pt-2">
          <Button type="submit" size="full">Sign In</Button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-100">
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <button type="button" onClick={onSwitchToSignup} className="text-accent font-bold hover:underline decoration-2 underline-offset-4">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );

  if (onClose) {
    return cardContent;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.07),0_10px_40px_-4px_rgba(0,0,0,0.12)] border border-gray-100">
        {cardContent}
      </div>
    </div>
  );
};

export default Login;