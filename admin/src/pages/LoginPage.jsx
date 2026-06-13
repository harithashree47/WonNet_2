import React, { useState } from 'react';
import { adminLogin } from '../api/auth'; 

// Reusable Button Component
const Button = ({ children, onClick, type = "button", variant = "primary", disabled = false, loading = false, icon = null, className = "" }) => {
    const baseClasses = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2";
    const variantClasses = variant === "primary" 
        ? "bg-slate-800 text-white shadow-lg hover:bg-slate-700 hover:shadow-xl" 
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
                className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/80`}
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

        // Using the imported adminLogin function
        const result = await adminLogin(email, password);

        if (result.success) {
            // Update local state and persist session via onLogin callback
            onLogin(result.data.user);
        } else {
            setLoginError(result.error.message || 'Invalid email or password. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-white">
            {/* Decorative floating elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-slate-200/50 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl"></div>
            </div>
            
            <div className="max-w-md w-full animate-fadeInUp">
                {/* Login Card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
                        <p className="text-gray-500 text-sm mt-1">Sign in to manage your job portal</p>
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
                                    className={`w-full px-4 py-3 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/80 pr-12`}
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