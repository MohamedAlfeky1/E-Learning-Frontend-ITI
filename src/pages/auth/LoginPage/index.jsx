import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLoginMutation, useGoogleMutation } from '../../../mutations/authMutations'; 
import { useGoogleLogin } from '@react-oauth/google'; 
import { FiMail, FiLock, FiStar, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc'; 
import { Spinner } from '../../../components/ui/spinner'; 

const LoginPage = () => {
  const loginMutation = useLoginMutation();
  const googleMutation = useGoogleMutation(); 
  const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({
    email: '',
    password: '',
    api: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      googleMutation.mutate({ token: tokenResponse.access_token });
    },
    onError: () => {
      setErrors(prev => ({ ...prev, api: 'Google authentication failed. Please try again.' }));
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '', api: '' }));
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let currentErrors = { email: '', password: '', api: '' };
    let hasError = false;

    if (!formData.email) {
      currentErrors.email = 'Email address is required';
      hasError = true;
    } else if (!validateEmail(formData.email)) {
      currentErrors.email = 'Please enter a valid email address';
      hasError = true;
    }

    if (!formData.password) {
      currentErrors.password = 'Password is required';
      hasError = true;
    } else if (formData.password.length < 6) {
      currentErrors.password = 'Password must be at least 6 characters';
      hasError = true;
    }

    if (hasError) {
      setErrors(currentErrors);
      return; 
    }

    loginMutation.mutate(formData, {
      onError: (err) => {
        setErrors(prev => ({
          ...prev, 
          api: err.response?.data?.message || 'Invalid email or password. Please try again.'
        }));
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-6xl flex overflow-hidden border border-gray-100 transition-all duration-500">
        
        {/* Left Side (Purple Section) */}
        <div className="hidden lg:flex w-1/2 bg-purple-600 p-16 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          <div className="relative z-10">
            <Link to="/" className="text-3xl font-black tracking-tighter text-white mb-10 block">NEXORA.</Link>
            <h1 className="text-5xl font-extrabold leading-tight mb-6">
              Welcome back to your<br /> digital campus.
            </h1>
            <p className="text-purple-100 text-lg opacity-90">
              Access your personalized learning path and stay connected.
            </p>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-400 p-3 rounded-full text-purple-900 shadow-lg"><FiStar /></div>
                <div>
                    <p className="font-bold uppercase tracking-wider text-xs opacity-70">Platform Update</p>
                    <p className="font-medium text-sm">AI-Powered insights are now live!</p>
                </div>
              </div>
          </div>
        </div>

        {/* Right Side (Form Section) */}
        <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-500 mb-8">Enter your credentials to manage your dashboard.</p>

            {/* Error Messages (General API Errors) */}
            {(errors.api || googleMutation.isError) && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm font-medium border-l-4 border-red-500 flex items-center gap-3 transition-all animate-in fade-in slide-in-from-top-2">
                <FiAlertCircle className="text-xl flex-shrink-0" />
                {errors.api || googleMutation.error?.response?.data?.message || 'Something went wrong.'}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              
              {/* Email Field */}
              <div className="group">
                <label className={`block text-sm font-semibold mb-1.5 transition-colors ${errors.email ? 'text-red-600' : 'text-gray-700 group-focus-within:text-purple-600'}`}>
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg transition-colors ${errors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-purple-500'}`} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-4 transition-all ${
                      errors.email 
                      ? 'border-red-300 bg-red-50 focus:ring-red-100 focus:border-red-400' 
                      : 'border-gray-200 bg-gray-50/50 focus:ring-purple-50 focus:border-purple-500'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-600 font-medium mt-1.5 ml-1 flex items-center gap-1.5"><FiAlertCircle /> {errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`block text-sm font-semibold transition-colors ${errors.password ? 'text-red-600' : 'text-gray-700 group-focus-within:text-purple-600'}`}>
                    Password
                  </label>
                  <Link to="/forgot-password" intrinsic className="text-xs text-purple-600 hover:underline font-semibold">Forgot?</Link>
                </div>
                <div className="relative">
                  <FiLock className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg transition-colors ${errors.password ? 'text-red-400' : 'text-gray-400 group-focus-within:text-purple-500'}`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-3.5 border rounded-xl focus:outline-none focus:ring-4 transition-all ${
                      errors.password 
                      ? 'border-red-300 bg-red-50 focus:ring-red-100 focus:border-red-400' 
                      : 'border-gray-200 bg-gray-50/50 focus:ring-purple-50 focus:border-purple-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-600 font-medium mt-1.5 ml-1 flex items-center gap-1.5"><FiAlertCircle /> {errors.password}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loginMutation.isPending || googleMutation.isPending}
                className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:bg-purple-300 shadow-lg shadow-purple-200 mt-4"
              >
                {loginMutation.isPending ? (
                  <><Spinner className="w-5 h-5 border-white" /> Authenticating...</>
                ) : 'Sign In Account'}
              </button>
            </form>

            {/* Divider (Now below the form) */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400 font-medium">Or continue with</span>
              </div>
            </div>

            {/* Google Login Button (Moved to bottom) */}
            <button
              type="button"
              onClick={() => handleGoogleLogin()}
              disabled={googleMutation.isPending || loginMutation.isPending}
              className="w-full bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl font-bold text-base hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {googleMutation.isPending ? (
                <><Spinner className="w-5 h-5 border-purple-600" /> Connecting...</>
              ) : (
                <><FcGoogle size={24} /> Sign in with Google</>
              )}
            </button>

            <p className="text-center text-gray-500 mt-10 text-sm font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-purple-600 hover:text-purple-800 font-bold border-b-2 border-purple-100 hover:border-purple-600 pb-0.5 transition-all">
                Create Free Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;