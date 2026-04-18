import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
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
  const { createVoucher, updateVoucher, deleteVoucher } =
    useVoucherMutations();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
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
      updateVoucher.mutate(
        { id: selectedVoucher._id, data: formattedData },
        {
          onSuccess: () => {
            clearSelection();
            toast.success("Voucher updated successfully");
          },
        }
      );
    } else {
      createVoucher.mutate({
        ...formattedData,
        validFrom: new Date().toISOString(),
      });
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
      className: "border-destructive/20",
    });
  };

  return (
    <div className="min-h-screen bg-background relative p-3 sm:p-4 md:p-6 lg:p-10 font-sans">

      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

      <div className="relative max-w-[1300px] mx-auto space-y-8 md:space-y-10">
        
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-border pb-6 md:pb-8">
          <div>
            <p className="text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-1">
              Promotions Engine
            </p>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground">
              Vouchers Management
            </h1>

            <p className="text-muted-foreground text-xs mt-1">
              Create, monitor, and manage academic discounts and promotional codes.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">

          <div className="lg:col-span-4 lg:sticky lg:top-10 z-20">
            <VoucherForm
              selectedVoucher={selectedVoucher}
              clearSelection={clearSelection}
              onSubmit={onSubmit}
              isPending={createVoucher.isPending || updateVoucher?.isPending}
            />
          </div>

          <div className="lg:col-span-8 relative z-10">
            <Card className="bg-card border border-border rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] overflow-hidden backdrop-blur">

              <div className="p-5 md:p-6 border-b border-border flex items-center justify-between bg-muted/30 backdrop-blur-sm">
                <h3 className="font-bold text-foreground text-sm md:text-base">
                  Active Vouchers
                </h3>

                
              </div>

              <div className="p-4 md:p-6 space-y-4">
                {vouchers?.map((v) => (
                  <VoucherRow
                    key={v._id}
                    voucher={v}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isSelected={selectedVoucher?._id === v._id}
                  />
                ))}
              </div>

            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVoucherPage;