import { usePaymentHistory } from "@/queries/usePaymentQueries";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  AlertCircle,
  Receipt,
  CreditCard,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  Wallet,
} from "lucide-react";
import Loader from "@/components/ui/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

const PaymentHistoryPage = () => {
  const { data: payments, isLoading } = usePaymentHistory();

  if (isLoading)
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="min-h-screen bg-background rounded-xl p-4 md:p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
            <Wallet className="w-3 h-3" />
            <span>Billing Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">
            Payment <span className="text-primary">History</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Manage your digital investments and session bookings at Nexora.
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex-1 md:flex-none bg-card p-4 rounded-2xl border border-border shadow-sm">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
              Total Spent
            </p>
            <p className="text-xl font-black text-primary">
              $ {payments
                ?.reduce(
                  (acc, curr) => acc + (curr.status === "completed" ? (Number(curr.amount) || 0) : 0),
                  0
                )
                .toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="hidden md:block overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-xl shadow-primary/5 hover:shadow-primary/10 transition-all duration-300 backdrop-blur-xl">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="py-6 px-8 text-foreground font-bold uppercase text-[11px] tracking-widest">
                Transaction Details
              </TableHead>
              <TableHead className="text-foreground font-bold uppercase text-[11px] tracking-widest">
                Date
              </TableHead>
              <TableHead className="text-foreground font-bold uppercase text-[11px] tracking-widest text-right">
                Amount
              </TableHead>
              <TableHead className="text-foreground font-bold uppercase text-[11px] tracking-widest text-center">
                Status
              </TableHead>
              <TableHead className="w-[80px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments?.map((payment) => (
              <TableRow
                key={payment._id}
                className="group border-border hover:bg-accent/40 transition-all duration-300"
              >
                <TableCell className="py-6 px-8">
                  <div className="flex flex-col gap-1">
                    {payment.type === "course_sale" ? (
                      payment.courses?.map((c) => (
                        <span key={c._id} className="font-bold text-foreground group-hover:text-primary transition-colors">
                          {c.title}
                        </span>
                      ))
                    ) : (
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                          Private Session: {payment.sessionId?.teacherId?.firstName} {payment.sessionId?.teacherId?.lastName}
                        </span>
                        <span className="text-[10px] text-primary font-bold uppercase">1-on-1 Mentorship</span>
                      </div>
                    )}

                    <div className="flex items-center text-[10px] text-muted-foreground font-mono tracking-tighter mt-1">
                      <CreditCard className="w-3 h-3 mr-1" />
                      ID: {payment._id.toUpperCase()}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <Calendar className="w-4 h-4 opacity-60" />
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </div>
                </TableCell>

                <TableCell className="text-right font-black text-foreground">
                  ${(Number(payment.amount) || 0).toFixed(2)}
                </TableCell>

                <TableCell className="text-center">
                  <Badge
                    className={
                      payment.status === "completed"
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-muted text-muted-foreground border-border"
                    }
                  >
                    {payment.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                    <div className="p-2 bg-primary text-primary-foreground rounded-full">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden grid gap-4">
        {payments?.map((payment) => (
          <Card key={payment._id} className="border border-border bg-card shadow-sm rounded-3xl overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  {payment.type === "course_sale" ? (
                    payment.courses?.map((c) => (
                      <h3 key={c._id} className="font-black text-foreground leading-tight text-lg">
                        {c.title}
                      </h3>
                    ))
                  ) : (
                    <h3 className="font-black text-foreground leading-tight text-lg">
                      Session with {payment.sessionId?.teacherId?.firstName || "Teacher"}
                    </h3>
                  )}
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-bold uppercase tracking-tighter">
                    {payment.type === "course_sale" ? "Course" : "Session"} • {payment.status}
                  </Badge>
                </div>
                <div className="p-3 bg-muted rounded-2xl">
                  <Receipt className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>

              <div className="flex items-center justify-between text-muted-foreground">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-widest">Date</span>
                  <span className="text-sm font-bold text-foreground">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-right flex flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-widest">Total</span>
                  <span className="text-2xl font-black text-primary">
                    ${(Number(payment.amount) || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!payments || payments.length === 0) && (
        <div className="flex flex-col items-center justify-center py-32 bg-card rounded-[2rem] border border-dashed border-border">
          <div className="p-6 bg-muted rounded-full mb-4">
            <Receipt className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">No History Yet</h2>
          <p className="text-muted-foreground">Your future enrollments and bookings will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentHistoryPage;