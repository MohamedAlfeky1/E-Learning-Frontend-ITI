import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Ticket, Trash2, Edit3, XCircle, PlusCircle, Zap, 
  Calendar, Hash, Info, CheckCircle2, Clock, ArrowRight, AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

import { useGetVouchers } from "@/queries/useVoucherQueries";
import { useVoucherMutations } from "@/mutations/useVoucherMutations";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Form Component ---
const VoucherForm = ({ selectedVoucher, clearSelection, onSubmit, isPending }) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const todayStr = new Date().toISOString().split("T")[0];

  React.useEffect(() => {
    if (selectedVoucher) {
      reset({
        code: selectedVoucher.code,
        discountType: selectedVoucher.discountType,
        discountValue: selectedVoucher.discountValue,
        validUntil: selectedVoucher.validUntil?.split("T")[0] || "",
        maxUses: selectedVoucher.maxUses || "",
      });
    } else {
      reset({ code: "", discountType: "percentage", discountValue: "", validUntil: "", maxUses: "" });
    }
  }, [selectedVoucher, reset]);
  const onError = (errors) => {
    if (errors.discountValue) {
      toast.error(errors.discountValue.message, { icon: <AlertCircle size={16} /> });
    } else if (errors.validUntil) {
      toast.error(errors.validUntil.message, { icon: <Clock size={16} /> });
    } else if (errors.code) {
      toast.error("Voucher code is required");
    }
  };

  return (
    <Card className={`overflow-hidden border-none shadow-xl shadow-slate-200/60 transition-all duration-500 ${selectedVoucher ? 'ring-2 ring-[#6366f1]' : ''}`}>
      <CardHeader className={`${selectedVoucher ? 'bg-[#4f46e5]' : 'bg-[#1e1e1e]'} text-white p-6 transition-colors duration-500`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl">
              {selectedVoucher ? <Edit3 size={20} /> : <PlusCircle size={20} />}
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-tight">{selectedVoucher ? "Update Voucher" : "Generate New"}</h2>
              <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold">Promotion Engine</p>
            </div>
          </div>
          {selectedVoucher && (
            <Button variant="ghost" size="icon" onClick={clearSelection} className="hover:bg-white/10 text-white rounded-full">
              <XCircle size={20} />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 bg-white">
        {/* نمرر onError للدالة handleSubmit */}
        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-slate-400 font-bold text-[10px] uppercase tracking-widest ml-1">Voucher Code Name</Label>
            <div className="relative">
              <Hash className="absolute left-3 top-3 text-slate-300" size={16} />
              <Input 
                {...register("code", { required: "Code is required" })} 
                placeholder="e.g. SUMMER24_SAVE"
                className="pl-10 h-11 border-slate-100 bg-[#f8faff] focus:bg-white rounded-xl uppercase font-mono font-bold placeholder:text-slate-300 text-slate-700" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-400 font-bold text-[10px] uppercase tracking-widest ml-1">Discount Type</Label>
              <Select 
                defaultValue="percentage" 
                onValueChange={(val) => setValue("discountType", val)}
                value={watch("discountType")}
              >
                <SelectTrigger className="h-11 border-slate-100 bg-[#f8faff] rounded-xl text-slate-600 font-medium">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400 font-bold text-[10px] uppercase tracking-widest ml-1">Value</Label>
              <Input 
                type="number" 
                {...register("discountValue", { 
                  required: "Discount value is required",
                  min: { value: 0, message: "Discount value cannot be negative" }
                })} 
                className="h-11 border-slate-100 bg-[#f8faff] rounded-xl font-bold text-slate-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-400 font-bold text-[10px] uppercase tracking-widest ml-1">Expiry Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-slate-300" size={16} />
              <Input 
                type="date" 
                min={todayStr} 
                {...register("validUntil", { 
                  required: "Expiry date is required",
                  validate: (value) => new Date(value) >= new Date().setHours(0,0,0,0) || "Date cannot be in the past"
                })} 
                className="pl-10 h-11 border-slate-100 bg-[#f8faff] rounded-xl text-slate-600" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-400 font-bold text-[10px] uppercase tracking-widest ml-1">Usage Limit</Label>
            <div className="relative">
              <Info className="absolute left-3 top-3 text-slate-300" size={16} />
              <Input 
                type="number" 
                {...register("maxUses", {
                  min: { value: 1, message: "Usage limit must be at least 1" }
                })} 
                placeholder="Limit" 
                className="pl-10 h-11 border-slate-100 bg-[#f8faff] rounded-xl text-slate-600" 
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className={`w-full h-12 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] ${selectedVoucher ? 'bg-[#4f46e5] hover:bg-[#4338ca]' : 'bg-[#6366f1] hover:bg-[#4f46e5]'}`} 
            disabled={isPending}
          >
            {isPending ? "Processing..." : selectedVoucher ? "Update Voucher Code" : "Create Voucher Code"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// --- Table Row Component ---
const VoucherRow = ({ voucher, onEdit, onDelete, isSelected }) => {
  const isExpired = new Date(voucher.validUntil) < new Date();
  const creatorName = voucher.createdBy 
    ? `${voucher.createdBy.firstName} ${voucher.createdBy.lastName}` 
    : "System Admin";
  
  return (
    <tr className={`group transition-all ${isSelected ? 'bg-indigo-50/50' : 'hover:bg-slate-50/30'}`}>
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isExpired ? 'bg-slate-100 text-slate-400' : 'bg-[#f0f0ff] text-[#6366f1]'}`}>
            <Ticket size={18} />
          </div>
          <div>
            <span className="font-bold text-slate-800 uppercase tracking-tight block leading-none">{voucher.code}</span>
            <span className="text-[10px] text-slate-400 font-bold mt-1 block">Created by {creatorName}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-black text-[#6366f1]">{voucher.discountType === 'percentage' ? `${voucher.discountValue}% OFF` : `$${voucher.discountValue} FLAT`}</span>
          <div className="w-24 bg-slate-100 h-1 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#6366f1] transition-all duration-500" 
              style={{ width: `${voucher.maxUses ? (voucher.currentUses / voucher.maxUses) * 100 : 0}%` }}
            />
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <span className="text-xs font-bold text-slate-500">{voucher.currentUses} used <span className="text-slate-300">/ {voucher.maxUses || '∞'}</span></span>
      </td>
      <td className="px-6 py-5 text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(voucher)} className="h-8 w-8 hover:bg-white hover:text-[#6366f1] shadow-sm border border-transparent hover:border-slate-100 rounded-lg text-slate-400">
            <Edit3 size={14} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-500 rounded-lg text-slate-400" onClick={() => onDelete(voucher._id)}>
            <Trash2 size={14} />
          </Button>
        </div>
      </td>
    </tr>
  );
};

// --- Main Page Component ---
const AdminVoucherPage = () => {
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const { data: vouchers, isLoading } = useGetVouchers();
  const { createVoucher, updateVoucher, deleteVoucher } = useVoucherMutations();

  const handleEdit = (voucher) => setSelectedVoucher(voucher);
  const clearSelection = () => setSelectedVoucher(null);

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      discountValue: Number(data.discountValue),
      maxUses: data.maxUses ? Number(data.maxUses) : null,
    };

    if (selectedVoucher) {
      updateVoucher.mutate({ id: selectedVoucher._id, data: formattedData }, { 
        onSuccess: () => {
          clearSelection();
          toast.success("Changes Applied Successfully");
        } 
      });
    } else {
      createVoucher.mutate({ ...formattedData, validFrom: new Date().toISOString() }, {
        onSuccess: () => toast.success("Voucher Created Successfully")
      });
    }
  };

  const handleDelete = (id) => {
    toast("Are you sure you want to delete this voucher?", {
      description: "This action cannot be undone.",
      action: {
        label: "Yes, Delete",
        onClick: () => {
          deleteVoucher.mutate(id, {
            onSuccess: () => toast.success("Voucher deleted successfully"),
            onError: () => toast.error("Failed to delete voucher")
          });
        },
      },
      cancel: { label: "Cancel" },
      className: "border-red-100", 
    });
  };

  return (
    <div className="min-h-screen bg-[#f8faff] p-4 lg:p-10 font-sans antialiased">
      <div className="max-w-[1300px] mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-8">
          <div>
            <p className="text-[#6366f1] font-black text-[10px] uppercase tracking-[0.2em] mb-1">Promotions Engine</p>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Vouchers Management</h1>
            <p className="text-slate-400 text-xs font-medium mt-1">Create, monitor, and manage academic discounts and promotional codes.</p>
          </div>
          <Button className="bg-[#6366f1] hover:bg-[#4f46e5] rounded-xl font-bold px-6 shadow-lg shadow-indigo-100">
            Export Report
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 lg:sticky lg:top-10">
            <VoucherForm
              selectedVoucher={selectedVoucher}
              clearSelection={clearSelection}
              onSubmit={onSubmit}
              isPending={createVoucher.isPending || updateVoucher?.isPending}
            />
            
            <div className="mt-6 p-6 bg-[#6366f1] rounded-[2rem] text-white relative overflow-hidden group shadow-xl shadow-indigo-200">
                <div className="relative z-10">
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Total Savings Generated</p>
                    <p className="text-3xl font-black mt-1">$124,590</p>
                    <div className="flex items-center gap-2 mt-4 text-[10px] font-bold bg-white/10 w-fit px-3 py-1 rounded-full">
                        <Zap size={10} className="fill-white" /> 12% more than last semester
                    </div>
                </div>
                <Zap className="absolute -right-4 -bottom-4 text-white/5 group-hover:scale-110 transition-transform duration-700" size={160} />
            </div>
          </div>

          <div className="lg:col-span-8">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-sm">Active Vouchers</h3>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-[#6366f1]"><ArrowRight size={16} /></Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#f8faff]/50">
                    <tr className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      <th className="px-6 py-4 text-left">Code</th>
                      <th className="px-6 py-4 text-left">Discount</th>
                      <th className="px-6 py-4 text-left">Usage</th>
                      <th className="px-6 py-4 text-right">Settings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {!isLoading && vouchers?.map(v => (
                      <VoucherRow
                        key={v._id}
                        voucher={v}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isSelected={selectedVoucher?._id === v._id}
                      />
                    ))}
                  </tbody>
                </table>
                
                {isLoading && (
                  <div className="p-20 text-center flex flex-col items-center gap-3">
                     <Loader/>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVoucherPage;