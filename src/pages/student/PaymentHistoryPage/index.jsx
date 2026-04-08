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
  Wallet
} from "lucide-react";
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
  const { data: payments, isLoading} = usePaymentHistory();

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-40 space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="text-slate-400 font-medium tracking-widest text-xs uppercase">Nexora Intelligence Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white p-4 md:p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-indigo-600/10 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
            <Wallet className="w-3 h-3" />
            <span>Billing Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
            Payment <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">History</span>
          </h1>
          <p className="text-slate-500 font-medium">Manage your digital investments and course access at Nexora.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex-1 md:flex-none bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Total Spent</p>
            <p className="text-xl font-black text-slate-900">
              ${payments?.reduce((acc, curr) => acc + (curr.status === 'completed' ? curr.amount : 0), 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="hidden md:block overflow-hidden rounded-[2rem] border border-white/50 bg-white/70 backdrop-blur-xl shadow-2xl shadow-indigo-100/50">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="py-6 px-8 text-slate-900 font-bold uppercase text-[11px] tracking-widest">Transaction Details</TableHead>
              <TableHead className="text-slate-900 font-bold uppercase text-[11px] tracking-widest">Date</TableHead>
              <TableHead className="text-slate-900 font-bold uppercase text-[11px] tracking-widest text-right">Amount</TableHead>
              <TableHead className="text-slate-900 font-bold uppercase text-[11px] tracking-widest text-center">Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments?.map((payment) => (
              <TableRow key={payment._id} className="group border-slate-50 hover:bg-indigo-50/30 transition-all duration-300">
                <TableCell className="py-6 px-8">
                  <div className="flex flex-col gap-1">
                    {payment.courses.map(c => (
                      <span key={c._id} className="font-bold text-slate-800 text-base group-hover:text-indigo-600 transition-colors">
                        {c.title}
                      </span>
                    ))}
                    <div className="flex items-center text-[10px] text-slate-400 font-mono tracking-tighter">
                      <CreditCard className="w-3 h-3 mr-1" />
                      STRIPE_ID: {payment._id.toUpperCase()}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <Calendar className="w-4 h-4 opacity-40" />
                    {new Date(payment.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-lg font-black text-slate-900">${payment.amount.toFixed(2)}</span>
                </TableCell>
                <TableCell className="text-center">
                  <Badge className={`
                    rounded-lg px-3 py-1 text-[10px] font-black uppercase shadow-none border
                    ${payment.status === 'completed' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-amber-50 text-amber-600 border-amber-100'}
                  `}>
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                    <div className="p-2 bg-indigo-600 text-white rounded-full">
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
          <Card key={payment._id} className="border-none bg-white shadow-lg shadow-indigo-100/50 rounded-3xl overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  {payment.courses.map(c => (
                    <h3 key={c._id} className="font-black text-slate-900 leading-tight text-lg">{c.title}</h3>
                  ))}
                  <Badge variant="outline" className="text-[9px] font-bold border-indigo-100 text-indigo-500 uppercase tracking-tighter">
                    {payment.status}
                  </Badge>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <Receipt className="w-5 h-5 text-slate-400" />
                </div>
              </div>

              <div className="flex items-center justify-between text-slate-500">
                 <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">Date</span>
                    <span className="text-sm font-bold text-slate-700">{new Date(payment.createdAt).toLocaleDateString()}</span>
                 </div>
                 <div className="text-right flex flex-col">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">Total</span>
                    <span className="text-2xl font-black text-indigo-600">${payment.amount.toFixed(2)}</span>
                 </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {payments?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 bg-white/50 rounded-[2rem] border border-dashed border-slate-200">
           <div className="p-6 bg-slate-50 rounded-full mb-4">
              <Receipt className="w-12 h-12 text-slate-200" />
           </div>
           <h2 className="text-xl font-bold text-slate-900">No History Yet</h2>
           <p className="text-slate-400">Your future enrollments will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentHistoryPage;