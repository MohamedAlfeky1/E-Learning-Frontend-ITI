import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useResetPasswordMutation } from '@/mutations/authMutations';
import { FiLock, FiEye, FiEyeOff, FiShield, FiCheck, FiArrowLeft, FiX } from 'react-icons/fi';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

const ResetPasswordForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const resetMutation = useResetPasswordMutation();

  const isMinLength = password.length >= 8;
  const isConfirmStarted = confirmPassword.length > 0;
  const isPasswordMatch = password === confirmPassword && confirmPassword !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isPasswordMatch) {
      toast.error("Passwords do not match!");
      return;
    }

    resetMutation.mutate({ token, password }, {
      onSuccess: () => {
        toast.success("Password reset successfully! Please login.");
        navigate('/login');
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "Link expired or invalid");
      }
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[480px] animate-in fade-in duration-700 py-4">
        
        {/* Header Area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl mb-4 shadow-sm">
            <FiShield size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Secure Your Account</h2>
          <p className="text-gray-500 mt-2 text-base">
            Create a strong password to protect your journey.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-purple-100/40 p-8 md:p-10 border border-gray-100 relative">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* New Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                New Password
              </label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-600 transition-colors size-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-purple-50 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400 text-base"
                  placeholder="••••••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                Confirm New Password
              </label>
              <div className="relative group">
                <FiShield className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg transition-colors ${isConfirmStarted && !isPasswordMatch ? 'text-red-500' : 'text-gray-500 group-focus-within:text-purple-600'}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl focus:bg-white focus:ring-4 outline-none transition-all placeholder:text-gray-400 text-base ${
                    isConfirmStarted && !isPasswordMatch 
                    ? 'border-red-200 focus:ring-red-50 focus:border-red-400' 
                    : 'border-transparent focus:ring-purple-50 focus:border-purple-500'
                  }`}
                  placeholder="••••••••••••"
                />
              </div>
              
              {isConfirmStarted && !isPasswordMatch && (
                <p className="text-xs text-red-500 font-bold ml-1 flex items-center gap-1.5 animate-in slide-in-from-top-1">
                  <FiX className="bg-red-100 rounded-full p-0.5" /> Passwords do not match
                </p>
              )}
            </div>

            {/* Password Policy Box */}
            <div className={`p-4 rounded-2xl flex items-start gap-3 transition-all duration-500 ${isMinLength && isPasswordMatch ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
              <div className={`mt-0.5 p-0.5 rounded-full transition-colors duration-500 ${isMinLength && isPasswordMatch ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
                <FiCheck size={12} />
              </div>
              <p className="text-[13px] leading-snug font-medium">
                At least 8 characters. Match both passwords to continue.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={resetMutation.isPending || !isPasswordMatch || !isMinLength}
              className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-purple-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:bg-purple-300 disabled:cursor-not-allowed shadow-lg shadow-purple-200"
            >
              {resetMutation.isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner className="w-5 h-5 border-white" /> Updating...
                </div>
              ) : "Update Password"}
            </button>
          </form>

          <Link to="/login" className="flex items-center justify-center gap-2 mt-8 text-sm font-bold text-purple-600 hover:text-purple-800 transition-colors group">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>
        </div>

        {/* Brand Footer */}
        <p className="text-center mt-10 text-gray-400 text-[11px] font-medium tracking-widest uppercase opacity-80">
          NEXORA <span className="mx-1 opacity-30">|</span> Digital Campus
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordForm;