import React from "react";
import { Ticket, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const VoucherRow = ({ voucher, onEdit, onDelete, isSelected }) => {
  const isExpired = new Date(voucher.validUntil) < new Date();

  const creatorName = voucher.createdBy
    ? `${voucher.createdBy.firstName} ${voucher.createdBy.lastName}`
    : "System Admin";

  return (
    <Card
      className={`transition-all border border-border rounded-2xl p-4 md:p-5 
      flex flex-col md:flex-row md:items-center gap-4 ${
        isSelected
          ? "bg-primary/10 ring-2 ring-primary/20"
          : "hover:bg-muted/50"
      }`}
    >
    <div className="flex items-center gap-4 flex-1 min-w-0">
        <div
          className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${
            isExpired
              ? "bg-muted text-muted-foreground"
              : "bg-primary/10 text-primary"
          }`}
        >
          <Ticket size={18} />
        </div>

        <div className="min-w-0">
          <p className="font-bold text-foreground uppercase truncate">
            {voucher.code}
          </p>
          <p className="text-[10px] text-muted-foreground font-bold truncate">
            Created by {creatorName}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="font-black text-primary whitespace-nowrap">
          {voucher.discountType === "percentage"
            ? `${voucher.discountValue}% OFF`
            : `$${voucher.discountValue} FLAT`}
        </span>

        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {voucher.currentUses} / {voucher.maxUses || "∞"}
        </span>
      </div>

      <div className="flex gap-2 md:ml-auto">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit(voucher)}
        >
          <Edit3 size={14} />
        </Button>

        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(voucher._id)}
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </Card>
  );
};

export default VoucherRow;