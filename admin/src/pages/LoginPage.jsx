import React, { useState } from 'react';
import { adminLogin } from '../api/auth';
import { Icon } from '../components/ui/Icon';
import { Globe2 } from 'lucide-react';

// Reusable Button Component
const Button = ({ children, onClick, type = "button", variant = "primary", disabled = false, loading = false, icon = null, className = "" }) => {
    const baseClasses = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2";
    const variantClasses = variant === "primary" 
        ? "bg-primary text-white shadow-lg hover:bg-secondary hover:shadow-xl" 
        : "bg-gray-200 hover:bg-gray-300 text-gray-700";
    
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseClasses} ${variantClasses} ${className} ${(disabled || loading) ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
            {loading && (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
            )}
            {icon && !loading && <i className={icon}></i>}
            {children}
        </button>
    );
};

// Reusable Input Component
const Input = ({ label, type = "text", value, onChange, placeholder, error, icon }) => {
    return (
        <div className="mb-5">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
                {icon && <i className={`${icon} mr-2 text-gray-400`}></i>}
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all bg-white/80`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return 'Email is required';
        if (!regex.test(email)) return 'Please enter a valid email';
        return '';
    };

    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        if (password.length < 4) return 'Password must be at least 4 characters';
        return '';
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setEmailError(validateEmail(value));
        setLoginError('');
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordError(validatePassword(value));
        setLoginError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const emailValidationError = validateEmail(email);
        const passwordValidationError = validatePassword(password);
        
        setEmailError(emailValidationError);
        setPasswordError(passwordValidationError);
        
        if (emailValidationError || passwordValidationError) {
            return;
        }
        
        setLoading(true);
        setLoginError('');

        const result = await adminLogin(email, password);

        if (result.success) {
            onLogin(result.data.user);
        } else {
            setLoginError(result.error.message || 'Invalid email or password. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 bg-gray-50 relative">
            {/* Decorative floating elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
                <div className="absolute top-20 left-10 w-64 h-64 sm:w-72 sm:h-72 bg-accent/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-72 h-72 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-3xl"></div>
            </div>
            
            <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg animate-fadeInUp relative z-10">
                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-100">
                    {/* Accent bar */}
                    
                    
                    <div className="text-center mb-6 sm:mb-8">
                        {/* Logo - Same as user login page */}
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-accent border-2 border-accent/60">
                                <Globe2 size={24} className="text-accent" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-primary">
                                    Won<span className="text-accent">Net!</span>
                                </h1>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    Admin Panel
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="admin@wonnet.com"
                            icon="fas fa-envelope"
                            error={emailError}
                        />
                        
                        <div className="relative mb-5">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                <i className="fas fa-lock mr-2 text-gray-400"></i>
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={handlePasswordChange}
                                    placeholder="••••••••"
                                    className={`w-full px-4 py-3 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all bg-white/80 pr-12`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                                </button>
                            </div>
                            {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                        </div>
                        
                        {loginError && (
                            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                                <i className="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
                                <p className="text-red-600 text-sm">{loginError}</p>
                            </div>
                        )}
                        
                        <Button type="submit" loading={loading} icon="fas fa-arrow-right-to-bracket" className="w-full">
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;