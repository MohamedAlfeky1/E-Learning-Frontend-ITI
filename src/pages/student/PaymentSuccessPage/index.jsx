import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, PlayCircle, FileText } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";

const PaymentSuccessPage = () => {
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#7c3aed", "#a78bfa", "#10b981"],
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 px-3 sm:px-4 py-6">
      
      <Card className="max-w-md w-full border-none shadow-2xl bg-white overflow-hidden rounded-2xl">
        
        <div className="h-1.5 sm:h-2 bg-emerald-500 w-full" />

        <CardContent className="pt-8 sm:pt-12 pb-8 sm:pb-10 px-4 sm:px-6 md:px-8 text-center space-y-5 sm:space-y-6">
          
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-emerald-50 p-3 sm:p-4 animate-bounce">
              <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-500" />
            </div>
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900">
              Payment Successful!
            </h1>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
              Thank you for choosing{" "}
              <span className="font-bold text-primary">Nexora</span>. 
              Your enrollment is confirmed and your courses are ready.
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-slate-50 rounded-2xl p-3 sm:p-4 border border-slate-100 flex justify-between sm:justify-around items-center">
            
            <div className="text-center">
              <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400">
                Status
              </p>
              <p className="text-xs sm:text-sm font-bold text-emerald-600">
                Confirmed
              </p>
            </div>

            <div className="h-6 sm:h-8 w-[1px] bg-slate-200" />

            <div className="text-center">
              <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400">
                Access
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-700">
                Immediate
              </p>
            </div>

          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-3 sm:pt-4">
            
            <Button 
              asChild 
              className="h-11 sm:h-12 text-sm sm:text-lg font-bold rounded-xl shadow-lg shadow-primary/20 w-full"
            >
              <Link to="/my-courses" className="flex items-center justify-center gap-2">
                <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                Go to My Courses
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              className="h-11 sm:h-12 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl w-full"
            >
              <Link to="/dashboard" className="flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </Button>

          </div>

          {/* Footer Text */}
          <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed">
            A confirmation email and receipt have been sent to your inbox.
          </p>

        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;