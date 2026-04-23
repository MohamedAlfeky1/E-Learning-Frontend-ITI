import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCheckoutMutation } from "../../../mutations/usePaymentMutations";
import StripeWrapper from "@/components/payment/StripeWrapper";
import CheckoutForm from "@/components/payment/CheckoutForm";
import PaymentSummary from "@/components/payment/PaymentSummary";
import VoucherSection from "@/components/payment/VoucherSection";
import visa from "../../../assets/visa.png";
import mastercard from "../../../assets/mastercard.png";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  ShieldCheck,
  Lock,
  CreditCard,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";


const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const bookingId = params.get("bookingId");
const voucherCode = location.state?.voucherCode;

  const { mutate, isPending } = useCheckoutMutation();
  const [checkoutDetails, setCheckoutDetails] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  

useEffect(() => {
  if (isFirstLoad) {
    console.log("Sending checkout request with:", { voucherCode, bookingId }); 

    mutate(
      { voucherCode: voucherCode || null, bookingId: bookingId || null },
      {
        onSuccess: (data) => {
          console.log("Success! Received checkout data:", data);
          setCheckoutDetails(data);
          setIsFirstLoad(false);
        },
        onError: (error) => {
          console.error("Checkout Mutation Error:", error.response?.data || error);
          toast.error(error.response?.data?.message || "Failed to initialize payment");
          setIsFirstLoad(false);
        },
      }
    );
  }
}, [bookingId, voucherCode, mutate, isFirstLoad]);
const handleApplyVoucher = (code) => {
  mutate(
    { 
      voucherCode: code, 
      bookingId: bookingId || null,
      isRecalculate: true   
    },
    {
      onSuccess: (newData) => {
        setCheckoutDetails(newData);
        toast.success("Voucher applied and total updated!");
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Invalid voucher code");
      },
    }
  );
};
  if (isFirstLoad && !checkoutDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background space-y-6 px-4">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-14 w-14 animate-spin text-primary opacity-20" />
          <Lock className="absolute h-6 w-6 text-primary" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-xl font-bold text-foreground">
            Securing your session
          </p>
          <p className="text-muted-foreground animate-pulse">
            Preparing secure checkout...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-background min-h-screen pb-16">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-4 w-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto group text-muted-foreground hover:text-primary hover:bg-accent"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back
            </Button>

            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tight text-foreground">
                Checkout
              </h1>
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>Encryption Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-muted-foreground uppercase">
                Platform
              </p>
              <p className="text-xl font-black text-primary">NEXORA</p>
            </div>
            <div className="h-8 w-px bg-border hidden sm:block"></div>
            <ShieldCheck className="w-10 h-10 text-primary opacity-20" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <Card className="shadow-xl border border-border rounded-2xl bg-card">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg font-bold text-foreground">
                  Summary
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div
                  className={`${isPending ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <PaymentSummary
                    subtotal={checkoutDetails?.originalAmount || 0}
                    discount={checkoutDetails?.discount || 0}
                    total={checkoutDetails?.finalAmount || 0}
                  />
                </div>

                <Separator />

                <VoucherSection
                  isLoading={isPending}
                 onApply={handleApplyVoucher}
                />

                <div className="p-4 bg-accent rounded-xl border border-border text-center">
                  <p className="text-xs font-bold text-primary uppercase">
                    Nexora Promise
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your journey is secured and guaranteed.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <Card className="border border-border shadow-lg bg-card rounded-2xl">
              <CardHeader className="border-b border-border">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg font-bold text-foreground">
                      Payment Method
                    </CardTitle>
                    <CardDescription>Secure payment via Stripe</CardDescription>
                  </div>
                  <div className="flex gap-2 opacity-70">
                    <img src={visa} className="h-4" alt="Visa" />
                    <img src={mastercard} className="h-4" alt="Mastercard" />
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {checkoutDetails?.clientSecret && (
                  <StripeWrapper
                    key={checkoutDetails.clientSecret}
                    clientSecret={checkoutDetails.clientSecret}
                  >
                    <CheckoutForm
                      amount={checkoutDetails.finalAmount}
                      clientSecret={checkoutDetails.clientSecret}
                    />
                  </StripeWrapper>
                )}

                <div className="mt-6 flex items-start gap-3 p-4 bg-muted rounded-xl border border-border">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Your data is encrypted
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border border-border bg-card">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary">
                    <CreditCard size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      Auto Enrollment
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Instant access
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border bg-card">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary">
                    <ShieldCheck size={16} />
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    Secure Payments
                  </p>
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
