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
import { Wallet, ArrowUpRight, History, Loader2, CreditCard, Plus } from "lucide-react";
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
        setIsDialogOpen(false); 
        toast.success("Withdrawal request submitted!");
      }
    });
  };

  if (isBalanceLoading || isHistoryLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-6 py-6 space-y-6 sm:space-y-8 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-800">
            Financial Overview
          </h1>
          <p className="text-sm sm:text-base text-slate-500">
            Manage your earnings and withdrawal requests
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto rounded-xl px-4 sm:px-6 py-4 sm:py-6 shadow-lg gap-2 text-sm sm:text-md font-bold">
              <Plus size={18} /> Request Withdrawal
            </Button>
          </DialogTrigger>
          
          <DialogContent className="w-[95%] sm:max-w-[500px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-2xl font-bold flex items-center gap-2">
                <CreditCard className="text-primary" /> Withdrawal Details
              </DialogTitle>
              <DialogDescription className="text-sm">
                Enter your payment information to process the withdrawal.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleWithdraw} className="space-y-4 sm:space-y-5 pt-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-bold text-slate-600">Method</label>
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
                  <label className="text-xs sm:text-sm font-bold text-slate-600">Amount ($)</label>
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
                <label className="text-xs sm:text-sm font-bold text-slate-600">Account Holder Name</label>
                <Input 
                  placeholder="Full name" 
                  value={formData.holderName}
                  onChange={(e) => setFormData({...formData, holderName: e.target.value})}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-slate-600">Account / Wallet Number</label>
                <Input 
                  placeholder="e.g. 010xxxxxxxx" 
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                  className="rounded-xl font-mono"
                />
              </div>

              {formData.method !== 'vodafone_cash' && (
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-bold text-slate-600">Bank Name / Provider</label>
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
                className="w-full py-4 sm:py-6 rounded-xl font-bold text-sm sm:text-lg" 
                disabled={withdrawMutation.isPending}
              >
                {withdrawMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : "Confirm & Request"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Card className="bg-primary text-white border-none shadow-xl overflow-hidden relative">
          <CardContent className="p-4 sm:p-6">
            <p className="text-xs uppercase opacity-70">Available Balance</p>
            <div className="text-3xl sm:text-5xl font-black">${balance?.currentBalance || 0}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white">
          <CardContent className="p-4 sm:p-6">
            <p className="text-xs uppercase text-slate-500">Total Earnings</p>
            <div className="text-3xl sm:text-5xl font-black text-slate-800">
              ${balance?.totalEarnings || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
          <History size={20} /> Transaction History
        </h2>

        <Card className="border-none shadow-md bg-white">
          <div className="overflow-x-auto">
            <Table className="min-w-[500px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {history?.length > 0 ? (
                  history.map((req) => (
                    <TableRow key={req._id}>
                      <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="font-bold">${req.amount.toFixed(2)}</TableCell>
                      <TableCell className="capitalize">{req.method.replace('_', ' ')}</TableCell>
                      <TableCell>
                        <Badge>
                          {req.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-slate-400">
                      No transactions yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>

            </Table>
          </div>
        </Card>
      </div>

    </div>
  );
};

export default TeacherEarnings;