import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShieldCheck, Loader2 } from "lucide-react";

const CheckoutForm = ({ amount, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!clientSecret) {
      toast.error("Payment session not initialized. Please refresh.");
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      
      },
    });

    if (error) {
      toast.error(error.message || "An error occurred during payment.");
      setIsProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      toast.success("Enrolled Successfully! Welcome to Nexora.");
      
      setTimeout(() => {
        window.location.href = "/payment-success";
      }, 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="group transition-all">
        <label className="text-sm font-medium text-slate-700 mb-2 block">
          Card Details
        </label>
        <div className="p-4 border-2 rounded-xl bg-white border-slate-100 group-focus-within:border-primary/50 group-focus-within:ring-4 group-focus-within:ring-primary/5 transition-all">
          <CardElement 
            options={{
              style: { 
                base: { 
                  fontSize: '16px', 
                  color: '#1e293b',
                  fontFamily: 'Inter, sans-serif',
                  '::placeholder': { color: '#94a3b8' }
                },
                invalid: { color: '#ef4444' }
              } 
            }} 
          />
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
        <ShieldCheck size={18} className="text-emerald-600" />
        <p className="text-xs text-slate-500 leading-tight">
          Your payment is processed securely via <strong>Stripe</strong>. 
          We do not store your card information.
        </p>
      </div>

      <Button 
        type="submit"
        disabled={isProcessing || !stripe} 
        className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl transition-all active:scale-[0.98]"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin h-5 w-5" />
            <span>Processing Payment...</span>
          </div>
        ) : (
          `Pay $${amount?.toFixed(2)}`
        )}
      </Button>
      
      <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest">
        Powered by Stripe
      </p>
    </form>
  );
};

export default CheckoutForm;