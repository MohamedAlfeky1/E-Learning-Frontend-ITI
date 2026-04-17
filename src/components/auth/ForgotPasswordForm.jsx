import { useState } from 'react';
import { useForgotPasswordMutation } from '@/mutations/authMutations';
import { FiMail, FiArrowLeft, FiCheckCircle, FiRotateCcw, FiInfo, FiSend } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Button } from "@/components/ui/button";

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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-[500px] animate-in fade-in zoom-in duration-500">
          <div className="bg-card text-card-foreground rounded-3xl shadow-2xl p-10 border border-border text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 text-primary rounded-full mb-6 border border-primary/20">
              <FiCheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-extrabold mb-4">Check your inbox</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              We've sent a password reset link to <br/> 
              <span className="font-bold text-foreground">{email}</span>.
            </p>
            <Link to="/login" className="flex items-center justify-center gap-2 text-primary font-bold hover:underline">
              <FiArrowLeft /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[500px] flex flex-col items-center">
        
        <div className="w-full bg-card text-card-foreground rounded-3xl shadow-2xl p-8 md:p-10 border border-border">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 text-primary rounded-2xl mb-4">
              <FiRotateCcw size={28} />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Forgot Password</h2>
            <p className="text-muted-foreground mt-2 text-sm">Enter your email to receive a reset link</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-muted/50 border border-transparent rounded-2xl focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
                  placeholder="name@school.edu"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={forgotMutation.isPending}
              className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
            >
              {forgotMutation.isPending ? (
                <><Spinner className="w-5 h-5" /> Sending...</>
              ) : (
                <>Send Reset Link <FiSend size={18} /></>
              )}
            </Button>
          </form>

         
          <Link to="/login" className="flex items-center justify-center gap-2 mt-8 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Sign In
          </Link>
        </div>

        <div className="w-full mt-6 bg-primary/5 border border-primary/10 rounded-2xl p-5 flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-1000">
          <div className="text-primary mt-1 shrink-0">
            <FiInfo size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-primary uppercase tracking-tight">Academic Security</h4>
            <p className="text-[12px] text-muted-foreground leading-relaxed mt-1">
              Reset links are valid for 24 hours. If you don't see the email, check your spam folder or contact your tutor.
            </p>
          </div>
        </div>

        
        <p className="text-center mt-10 text-muted-foreground/60 text-[10px] font-medium tracking-widest uppercase">
          © {new Date().getFullYear()} Nexora Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;