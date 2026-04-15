import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, PlayCircle, FileText } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import Loader from "@/components/ui/Loader"; 

const PaymentSuccessPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: [
          "hsl(var(--primary))",
          "hsl(var(--primary-foreground))",
          "hsl(var(--accent))",
        ],
      });
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // 👇 Loader Page
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-3 sm:px-4 py-6">

      <Card className="max-w-md w-full border border-border shadow-xl bg-card overflow-hidden rounded-3xl">

        <div className="h-1.5 sm:h-2 w-full bg-primary" />

        <CardContent className="pt-8 sm:pt-12 pb-8 sm:pb-10 px-4 sm:px-6 md:px-8 text-center space-y-6">

          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-4 animate-in fade-in zoom-in">
              <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 text-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground">
              Payment Successful!
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Thank you for choosing{" "}
              <span className="font-bold text-primary">Nexora</span>.
              Your enrollment is confirmed and your courses are ready.
            </p>
          </div>

          <div className="bg-muted rounded-2xl p-4 border border-border flex justify-between items-center">

            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Status
              </p>
              <p className="text-sm font-bold text-primary">
                Confirmed
              </p>
            </div>

            <div className="h-8 w-px bg-border" />

            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Access
              </p>
              <p className="text-sm font-bold text-foreground">
                Immediate
              </p>
            </div>

          </div>

          <div className="flex flex-col gap-3 pt-2">

            <Button
              asChild
              className="h-11 sm:h-12 text-sm sm:text-lg font-bold rounded-xl w-full shadow-md"
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
              className="h-11 sm:h-12 border-border text-foreground hover:bg-accent rounded-xl w-full"
            >
              <Link to="/dashboard" className="flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </Button>

          </div>

          <p className="text-[10px] sm:text-xs text-muted-foreground">
            A confirmation email and receipt have been sent to your inbox.
          </p>

        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;