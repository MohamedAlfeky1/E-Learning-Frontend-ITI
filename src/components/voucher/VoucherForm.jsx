import React from "react";
import { useForm } from "react-hook-form";
import { Edit3, PlusCircle, XCircle, Hash, Calendar, Info, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
      reset({
        code: "",
        discountType: "percentage",
        discountValue: "",
        validUntil: "",
        maxUses: "",
      });
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
    <Card className={`overflow-hidden border-none shadow-xl transition-all duration-500 ${selectedVoucher ? 'ring-2 ring-[#6366f1]' : ''}`}>

      <CardHeader className={`${selectedVoucher ? 'bg-[#4f46e5]' : 'bg-[#1e1e1e]'} text-white p-4 sm:p-5 md:p-6`}>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl">
              {selectedVoucher ? <Edit3 size={18} /> : <PlusCircle size={18} />}
            </div>

            <div>
              <h2 className="font-bold text-base sm:text-lg">
                {selectedVoucher ? "Update Voucher" : "Generate New"}
              </h2>
              <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold">
                Promotion Engine
              </p>
            </div>
          </div>

          {selectedVoucher && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearSelection}
              className="hover:bg-white/10 text-white rounded-full self-start sm:self-auto"
            >
              <XCircle size={20} />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 md:p-6 bg-white">

        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4 md:space-y-5">

          <div className="space-y-2">
            <Label className="text-slate-400 font-bold text-[10px] uppercase tracking-widest ml-1">
              Voucher Code Name
            </Label>

            <div className="relative">
              <Hash className="absolute left-3 top-3 text-slate-300" size={16} />
              <Input
                {...register("code", { required: "Code is required" })}
                placeholder="e.g. SUMMER24_SAVE"
                className="pl-10 h-10 sm:h-11 text-sm border-slate-100 bg-[#f8faff] focus:bg-white rounded-xl uppercase font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label className="text-slate-400 font-bold text-[10px] uppercase tracking-widest ml-1">
                Discount Type
              </Label>

              <Select
                defaultValue="percentage"
                onValueChange={(val) => setValue("discountType", val)}
                value={watch("discountType")}
              >
                <SelectTrigger className="h-10 sm:h-11 border-slate-100 bg-[#f8faff] rounded-xl text-slate-600">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400 font-bold text-[10px] uppercase tracking-widest ml-1">
                Value
              </Label>

              <Input
                type="number"
                {...register("discountValue", {
                  required: "Discount value is required",
                  min: { value: 0, message: "Discount value cannot be negative" },
                })}
                className="h-10 sm:h-11 text-sm border-slate-100 bg-[#f8faff] rounded-xl"
              />
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label className="text-slate-400 font-bold text-[10px] uppercase tracking-widest ml-1">
              Expiry Date
            </Label>

            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-slate-300" size={16} />
              <Input
                type="date"
                min={todayStr}
                {...register("validUntil", {
                  required: "Expiry date is required",
                  validate: (value) =>
                    new Date(value) >= new Date().setHours(0, 0, 0, 0) ||
                    "Date cannot be in the past",
                })}
                className="pl-10 h-10 sm:h-11 text-sm border-slate-100 bg-[#f8faff] rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-400 font-bold text-[10px] uppercase tracking-widest ml-1">
              Usage Limit
            </Label>

            <div className="relative">
              <Info className="absolute left-3 top-3 text-slate-300" size={16} />
              <Input
                type="number"
                {...register("maxUses", {
                  min: { value: 1, message: "Usage limit must be at least 1" },
                })}
                placeholder="Limit"
                className="pl-10 h-10 sm:h-11 text-sm border-slate-100 bg-[#f8faff] rounded-xl"
              />
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className={`w-full h-11 sm:h-12 rounded-xl font-bold text-sm transition-all active:scale-[0.98] ${
              selectedVoucher
                ? "bg-[#4f46e5] hover:bg-[#4338ca]"
                : "bg-[#6366f1] hover:bg-[#4f46e5]"
            }`}
            disabled={isPending}
          >
            {isPending
              ? "Processing..."
              : selectedVoucher
              ? "Update Voucher Code"
              : "Create Voucher Code"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VoucherForm;