import { useState } from 'react';
import { useForgotPasswordMutation } from '@/mutations/authMutations';
import { FiMail, FiArrowLeft, FiCheckCircle, FiRotateCcw, FiInfo, FiSend } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const forgotMutation = useForgotPasswordMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    forgotMutation.mutate({ email }, {
      onSuccess: () => {
        setIsSent(true);
        toast.success("Check your email for reset link");
      },
      onError: (err) => toast.error(err.response?.data?.message || "Error occurred")
    });
  };

  if (isSent) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="w-full max-w-[500px] animate-in fade-in zoom-in duration-500">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-purple-100/40 p-10 border border-gray-100 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 text-green-500 rounded-full mb-6 border border-green-100">
              <FiCheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Check your inbox</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              We've sent a password reset link to <br/> 
              <span className="font-bold text-gray-800">{email}</span>.
            </p>
            <Link to="/login" className="flex items-center justify-center gap-2 text-purple-600 font-bold hover:underline">
              <FiArrowLeft /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[500px] flex flex-col items-center">
        
        {/* Main Card */}
        <div className="w-full bg-white rounded-[2rem] shadow-xl shadow-purple-100/40 p-8 md:p-10 border border-gray-100">
          
          {/* Header with Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl mb-4">
              <FiRotateCcw size={28} />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Forgot Password</h2>
            <p className="text-gray-500 mt-2 text-sm">Enter your email to receive a reset link</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-purple-50 focus:border-purple-500 outline-none transition-all placeholder:text-gray-300"
                  placeholder="name@school.edu"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={forgotMutation.isPending}
              className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-purple-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:bg-purple-300 shadow-lg shadow-purple-200 flex items-center justify-center gap-3"
            >
              {forgotMutation.isPending ? (
                <><Spinner className="w-5 h-5 border-white" /> Sending...</>
              ) : (
                <>Send Reset Link <FiSend size={18} /></>
              )}
            </button>
          </form>

          {/* Back Link */}
          <Link to="/login" className="flex items-center justify-center gap-2 mt-8 text-sm font-bold text-gray-500 hover:text-purple-600 transition-colors group">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Sign In
          </Link>
        </div>

        <div className="w-full mt-6 bg-purple-50/50 border border-purple-100 rounded-2xl p-5 flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-1000">
          <div className="text-purple-600 mt-1">
            <FiInfo size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-purple-900 uppercase tracking-tight">Academic Security</h4>
            <p className="text-[12px] text-purple-700 leading-relaxed mt-1">
              Reset links are valid for 24 hours. If you don't see the email, check your spam folder or contact your institution's IT help desk.
            </p>
          </div>
        </div>

        {/* Footer Copyright */}
        <p className="text-center mt-10 text-gray-400 text-[10px] font-medium tracking-widest uppercase">
          © 2026 Nexora Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
