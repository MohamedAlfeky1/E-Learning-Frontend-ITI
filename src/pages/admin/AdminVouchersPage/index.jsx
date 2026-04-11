import React, { useState } from "react";
import {
  Ticket, Trash2, Edit3, XCircle, PlusCircle, Zap, 
  Calendar, Hash, Info, CheckCircle2, Clock, ArrowRight, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import Loader from "@/components/ui/loader";

import { useGetVouchers } from "@/queries/useVoucherQueries";
import { useVoucherMutations } from "@/mutations/useVoucherMutations";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import VoucherForm from "../../../components/voucher/VoucherForm";
import VoucherRow from "../../../components/voucher/VoucherRow";

const AdminVoucherPage = () => {
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const { data: vouchers, isLoading } = useGetVouchers();
  const { createVoucher, updateVoucher, deleteVoucher } = useVoucherMutations();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faff]" >
        <Loader />
      </div>
    );
  }

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
      createVoucher.mutate({ ...formattedData, validFrom: new Date().toISOString() });
    }
  };

  const handleDelete = (id) => {
    toast("Are you sure you want to delete this voucher?", {
      description: "This action cannot be undone.",
      action: {
        label: "Yes, Delete",
        onClick: () => {
          deleteVoucher.mutate(id);
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
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 lg:sticky lg:top-10">
            <VoucherForm
              selectedVoucher={selectedVoucher}
              clearSelection={clearSelection}
              onSubmit={onSubmit}
              isPending={createVoucher.isPending || updateVoucher?.isPending}
            />
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
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVoucherPage;