import React from "react";
import { Ticket, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default VoucherRow;