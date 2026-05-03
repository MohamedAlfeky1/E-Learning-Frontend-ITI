import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useLocation } from "react-router-dom"; 
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShieldCheck, Loader2 } from "lucide-react";

const CheckoutForm = ({ amount, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation(); 
  const [isProcessing, setIsProcessing] = useState(false);

  const params = new URLSearchParams(location.search);
  const isSession = params.get("bookingId");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    if (!clientSecret) {
      toast.error("Payment session not initialized. Please refresh.");
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      }
    );

    if (error) {
      toast.error(error.message || "Payment failed.");
      setIsProcessing(false);
    } else if (paymentIntent.status === "succeeded") {
      toast.success("Payment Successful! 🎉");

      const type = isSession ? "session" : "course";
      
      setTimeout(() => {
        window.location.href = `/payment-success?type=${type}`;
      }, 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="group transition-all">
        <label className="text-sm font-medium text-foreground mb-2 block">
          Card Details
        </label>

        <div className="
          p-4 border-2 rounded-xl 
          bg-card border-border
          group-focus-within:border-primary/50 
          group-focus-within:ring-4 
          group-focus-within:ring-primary/10
          transition-all
        ">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "hsl(var(--foreground))",
                  fontFamily: "var(--font-sans)",
                  "::placeholder": {
                    color: "hsl(var(--muted-foreground))",
                  },
                },
                invalid: {
                  color: "hsl(var(--destructive))",
                },
              },
            }}
          />
        </div>
      </div>

      <div className="
        flex items-center gap-2 p-3 
        bg-muted rounded-lg 
        border border-border
      ">
        <ShieldCheck size={18} className="text-primary" />
        <p className="text-xs text-muted-foreground leading-tight">
          Your payment is processed securely via <strong>Stripe</strong>. 
          We do not store your card information.
        </p>
      </div>

      <Button
        type="submit"
        disabled={isProcessing || !stripe}
        className="
          w-full h-14 text-lg font-bold 
          bg-primary text-primary-foreground
          hover:bg-primary/90
          shadow-lg shadow-primary/20 
          rounded-xl transition-all 
          active:scale-[0.98]
        "
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

      <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest">
        Powered by Stripe
      </p>
    </form>
  );
};

export default CheckoutForm;