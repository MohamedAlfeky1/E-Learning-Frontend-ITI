import { useState } from "react";
import { 
  useTeacherBalance, 
  useWithdrawalHistory 
} from "@/queries/useTeacherFinanceQueries";
import { useWithdrawMutation } from "../../../mutations/teacherFinanceMutation";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Wallet, ArrowUpRight, History, Loader2, CreditCard, Landmark, Plus } from "lucide-react";
import { toast } from "sonner";

const TeacherEarnings = () => {
  const { data: balance, isLoading: isBalanceLoading } = useTeacherBalance();
  const { data: history, isLoading: isHistoryLoading } = useWithdrawalHistory();
  const withdrawMutation = useWithdrawMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    method: "vodafone_cash",
    holderName: "",
    accountNumber: "",
    bankName: ""
  });

  const handleWithdraw = (e) => {
    e.preventDefault();
    
    if (!formData.amount || formData.amount <= 0) return toast.error("Please enter a valid amount");
    if (formData.amount > balance?.currentBalance) return toast.error("Insufficient balance");
    if (!formData.holderName || !formData.accountNumber) return toast.error("Please fill required info");
    if (formData.method !== 'vodafone_cash' && !formData.bankName) return toast.error("Bank name is required");

    const payload = {
      amount: Number(formData.amount),
      method: formData.method,
      accountInfo: {
        holderName: formData.holderName,
        accountNumber: formData.accountNumber,
        ...(formData.method !== 'vodafone_cash' && { bankName: formData.bankName })
      }
    };

    withdrawMutation.mutate(payload, {
      onSuccess: () => {
        setFormData({ amount: "", method: "vodafone_cash", holderName: "", accountNumber: "", bankName: "" });
        setIsDialogOpen(false); // إغلاق المودال بعد النجاح
        toast.success("Withdrawal request submitted!");
      }
    });
  };

  if (isBalanceLoading || isHistoryLoading) {
    return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>;
  }

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Financial Overview</h1>
          <p className="text-slate-500">Manage your earnings and withdrawal requests</p>
        </div>

        {/* Withdrawal Dialog Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl px-6 py-6 shadow-lg shadow-primary/20 gap-2 text-md font-bold">
              <Plus size={20} /> Request Withdrawal
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[500px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <CreditCard className="text-primary" /> Withdrawal Details
              </DialogTitle>
              <DialogDescription>
                Enter your payment information to process the withdrawal.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleWithdraw} className="space-y-5 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Method</label>
                  <select 
                    className="w-full p-2.5 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-primary"
                    value={formData.method}
                    onChange={(e) => setFormData({...formData, method: e.target.value})}
                  >
                    <option value="vodafone_cash">Vodafone Cash</option>
                    <option value="instapay">Instapay</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Amount ($)</label>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600">Account Holder Name</label>
                <Input 
                  placeholder="Full name" 
                  value={formData.holderName}
                  onChange={(e) => setFormData({...formData, holderName: e.target.value})}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600">Account / Wallet Number</label>
                <Input 
                  placeholder="e.g. 010xxxxxxxx" 
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                  className="rounded-xl font-mono"
                />
              </div>

              {formData.method !== 'vodafone_cash' && (
                <div className="space-y-2 animate-in slide-in-from-top duration-300">
                  <label className="text-sm font-bold text-slate-600">Bank Name / Provider</label>
                  <Input 
                    placeholder="e.g. CIB, QNB, PayPal" 
                    value={formData.bankName}
                    onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                    className="rounded-xl"
                  />
                </div>
              )}

              <Button 
                type="submit"
                className="w-full py-6 rounded-xl font-bold text-lg" 
                disabled={withdrawMutation.isPending}
              >
                {withdrawMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : "Confirm & Request"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 1. Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-primary text-white border-none shadow-xl overflow-hidden relative">
          <div className="absolute right-[-5%] top-[-10%] opacity-10"><Wallet size={140} /></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-widest">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-black">${balance?.currentBalance || 0}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 text-slate-500">
            <CardTitle className="text-sm font-medium uppercase tracking-widest">Total Earnings</CardTitle>
            <ArrowUpRight size={24} className="text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-black text-slate-800">${balance?.totalEarnings || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Withdrawal History Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-2xl font-bold text-slate-800">
          <History size={28} className="text-primary" />
          <h2>Transaction History</h2>
        </div>
        
        <Card className="border-none shadow-md overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold">Date</TableHead>
                <TableHead className="font-bold">Amount</TableHead>
                <TableHead className="font-bold">Method</TableHead>
                <TableHead className="font-bold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history?.length > 0 ? (
                history.map((req) => (
                  <TableRow key={req._id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium">{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="font-black text-slate-800 font-mono">${req.amount.toFixed(2)}</TableCell>
                    <TableCell className="capitalize text-slate-500">{req.method.replace('_', ' ')}</TableCell>
                    <TableCell>
                      <Badge className="rounded-full px-3 py-1 uppercase text-[10px]" variant={
                        req.status === 'approved' || req.status === 'paid' ? 'success' : 
                        req.status === 'pending' ? 'warning' : 'destructive'
                      }>
                        {req.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-20 text-slate-400 opacity-60 italic">
                    No transactions recorded yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default TeacherEarnings;