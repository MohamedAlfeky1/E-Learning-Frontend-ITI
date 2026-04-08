import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckoutMutation } from "../../../mutations/usePaymentMutations";
import StripeWrapper from "@/components/payment/StripeWrapper";
import CheckoutForm from "@/components/payment/CheckoutForm";
import PaymentSummary from "@/components/payment/PaymentSummary";
import VoucherSection from "@/components/payment/VoucherSection";
import visa from '../../../assets/visa.png'
import mastercard from '../../../assets/mastercard.png'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  ArrowLeft,
  CheckCircle2
} from "lucide-react";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { mutate, data, isPending } = useCheckoutMutation();

  useEffect(() => {
    mutate({ voucherCode: null });
  }, [mutate]);

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white space-y-6 px-4">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 animate-spin text-indigo-600 opacity-20" />
          <Lock className="absolute h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg sm:text-xl font-bold text-slate-900">Securing your session</p>
          <p className="text-sm sm:text-base text-slate-500 animate-pulse">
            Preparing Nexora secure checkout...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-16 sm:pb-20">

      <div className="container max-w-6xl mx-auto py-6 sm:py-8 px-3 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="space-y-4 w-full">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)} 
              className="w-full sm:w-auto group -ml-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back
            </Button>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-slate-900">
                Checkout
              </h1>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-emerald-600 uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Encryption Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-between sm:justify-end w-full md:w-auto">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform</p>
              <p className="text-lg sm:text-xl font-black text-indigo-600 tracking-tighter">NEXORA</p>
            </div>
            <div className="h-8 sm:h-10 w-[1px] bg-slate-200 hidden sm:block"></div>
            <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 opacity-20" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          <div className="order-1 lg:order-2 lg:col-span-5 lg:sticky lg:top-8">
            <Card className="shadow-2xl shadow-indigo-100/50 border-none rounded-[2rem] overflow-hidden bg-white">
              <CardHeader className="pb-4 border-b border-slate-50 pt-6 sm:pt-8 px-4 sm:px-6 md:px-8">
                <CardTitle className="text-lg sm:text-xl font-bold text-slate-800 uppercase tracking-tighter">
                  Summary
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-4 sm:p-6 md:p-8 space-y-6">
                <PaymentSummary 
                  subtotal={data?.originalAmount || 0} 
                  discount={data?.discount || 0} 
                  total={data?.finalAmount || 0} 
                />
                
                <Separator className="opacity-50" />

                <VoucherSection onApply={(code) => mutate({ voucherCode: code })} />
                
                <div className="pt-2 sm:pt-4">
                  <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-indigo-50/50 rounded-[1.5rem] border border-indigo-100/50">
                    <p className="text-[10px] sm:text-[11px] font-black text-indigo-600 uppercase tracking-widest mb-1">
                      Nexora Promise
                    </p>
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                      Join thousands of students. Your educational journey is secured and guaranteed.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Section */}
          <div className="order-2 lg:order-1 lg:col-span-7 space-y-4 sm:space-y-6">
            
            <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden bg-white rounded-[2rem]">
              <CardHeader className="border-b border-slate-50 bg-slate-50/30 pb-4 sm:pb-6 pt-6 sm:pt-8 px-4 sm:px-6 md:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  <div className="space-y-1">
                    <CardTitle className="text-lg sm:text-xl font-bold text-slate-800">
                      Payment Method
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Secure credit card processing via Stripe.
                    </CardDescription>
                  </div>

                  <div className="flex gap-2 opacity-70">
                    <img src={visa} alt="Visa" className="h-4" />
                    <img src={mastercard} alt="Mastercard" className="h-4" />
                  </div>

                </div>
              </CardHeader>
              
              <CardContent className="p-4 sm:p-6 md:p-8 pt-6 sm:pt-10">
                <StripeWrapper clientSecret={data?.clientSecret}>
                  <CheckoutForm 
                    amount={data?.finalAmount} 
                    clientSecret={data?.clientSecret} 
                  />
                </StripeWrapper>
                
                <div className="mt-6 sm:mt-10 flex items-start gap-3 p-3 sm:p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <Lock className="w-4 h-4 text-slate-400 mt-0.5" />
                  <p className="text-[10px] sm:text-[11px] leading-relaxed text-slate-500">
                    Your sensitive data is encrypted before reaching our servers. Nexora complies with PCI-DSS standards.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              
              <Card className="border-none shadow-sm bg-white/50 rounded-2xl">
                <CardContent className="p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <CreditCard size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Auto-Enrollment</p>
                    <p className="text-[10px] sm:text-[11px] text-slate-500">
                      Immediate access after pay
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-white/50 rounded-2xl">
                <CardContent className="p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Secure Payments</p>
                    <p className="text-[10px] sm:text-[11px] text-slate-500">
                      256-bit SSL Protection
                    </p>
                  </div>
                </CardContent>
              </Card>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;