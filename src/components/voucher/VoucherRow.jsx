import React from "react";
import { Ticket, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const VoucherRow = ({ voucher, onEdit, onDelete, isSelected }) => {
  const isExpired = new Date(voucher.validUntil) < new Date();
  const creatorName = voucher.createdBy 
    ? `${voucher.createdBy.firstName} ${voucher.createdBy.lastName}` 
    : "System Admin";

  return (
    <>
      {/* Desktop */}
      <tr className={`hidden md:table-row transition-all ${isSelected ? 'bg-indigo-50/50' : 'hover:bg-slate-50/30'}`}>
        <td className="px-6 py-5">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isExpired ? 'bg-slate-100 text-slate-400' : 'bg-[#f0f0ff] text-[#6366f1]'}`}>
              <Ticket size={18} />
            </div>
            <div>
              <span className="font-bold text-slate-800 uppercase block">{voucher.code}</span>
              <span className="text-[10px] text-slate-400 font-bold">Created by {creatorName}</span>
            </div>
          </div>
        </td>

        <td className="px-6 py-5">
          <span className="text-xs font-black text-[#6366f1]">
            {voucher.discountType === 'percentage'
              ? `${voucher.discountValue}% OFF`
              : `$${voucher.discountValue} FLAT`}
          </span>
        </td>

        <td className="px-6 py-5">
          <span className="text-xs text-slate-500">
            {voucher.currentUses} / {voucher.maxUses || '∞'}
          </span>
        </td>

        <td className="px-6 py-5 text-right">
          <div className="flex justify-end gap-2">
            <Button size="icon" onClick={() => onEdit(voucher)}>
              <Edit3 size={14} />
            </Button>
            <Button size="icon" onClick={() => onDelete(voucher._id)}>
              <Trash2 size={14} />
            </Button>
          </div>
        </td>
      </tr>

      {/* Mobile */}
      <div className="md:hidden bg-white rounded-2xl shadow-sm p-4 space-y-3 border">
        <div className="flex justify-between">
          <span className="font-bold">{voucher.code}</span>
          <span className="text-xs text-slate-400">{creatorName}</span>
        </div>

        <div className="text-sm text-[#6366f1] font-bold">
          {voucher.discountType === 'percentage'
            ? `${voucher.discountValue}% OFF`
            : `$${voucher.discountValue} FLAT`}
        </div>

        <div className="text-xs text-slate-500">
          {voucher.currentUses} / {voucher.maxUses || '∞'}
        </div>

        <div className="flex justify-end gap-2">
          <Button size="icon" onClick={() => onEdit(voucher)}>
            <Edit3 size={14} />
          </Button>
          <Button size="icon" onClick={() => onDelete(voucher._id)}>
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </>
  );
};

export default VoucherRow;