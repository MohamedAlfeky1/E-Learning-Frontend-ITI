import React from "react";
import { useForm } from "react-hook-form";
import {
  Edit3,
  PlusCircle,
  XCircle,
  Hash,
  Calendar,
  Info,
  AlertCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const VoucherForm = ({
  selectedVoucher,
  clearSelection,
  onSubmit,
  isPending,
}) => {
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
  const firstError = Object.values(errors)[0];

  if (!firstError) return;

  let message = firstError.message;

  if (!message) {
    switch (Object.keys(errors)[0]) {
      case "code":
        message = "Voucher code is required";
        break;
      case "discountValue":
        message = "Invalid discount value";
        break;
      case "validUntil":
        message = "Expiry date is required";
        break;
      case "maxUses":
        message = "Invalid usage limit";
        break;
      default:
        message = "Invalid form data";
    }
  }

  const type = Object.keys(errors)[0];

  const icon =
    type === "validUntil" ? (
      <Clock size={16} />
    ) : (
      <AlertCircle size={16} />
    );

  toast.error(message, { icon });
};

  return (
    <div className="w-full flex justify-center">
      <Card
        className={`w-full max-w-3xl overflow-hidden shadow-xl rounded-2xl transition-all ${
          selectedVoucher ? "ring-2 ring-primary" : ""
        }`}
      >
        <CardHeader className="bg-primary text-primary-foreground px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-xl">
                {selectedVoucher ? (
                  <Edit3 size={18} />
                ) : (
                  <PlusCircle size={18} />
                )}
              </div>

              <div>
                <h2 className="font-bold text-lg">
                  {selectedVoucher ? "Update Voucher" : "Generate Voucher"}
                </h2>
                <p className="text-xs opacity-70">Promotion Engine</p>
              </div>
            </div>

            {selectedVoucher && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSelection}
                className="hover:bg-white/10 rounded-full"
              >
                <XCircle size={18} />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">

            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground">
                Voucher Code
              </Label>

              <div className="relative">
                <Hash className="absolute left-3 top-3 text-muted-foreground" size={16} />
                <Input
                  {...register("code", {
                    required: "Voucher code is required",
                  })}
                  placeholder="SUMMER24_SAVE"
                  className="pl-10 h-11 uppercase font-mono bg-muted rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground">
                  Discount Type
                </Label>

                <Select
                  defaultValue="percentage"
                  onValueChange={(val) => setValue("discountType", val)}
                  value={watch("discountType")}
                >
                  <SelectTrigger className="h-11 bg-muted rounded-xl">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground">
                  Value
                </Label>

                <Input
                  type="number"
                  {...register("discountValue", {
                    required: "Discount value is required",
                    min: {
                      value: 0,
                      message: "Value cannot be negative",
                    },
                  })}
                  className="h-11 bg-muted rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground">
                  Expiry Date
                </Label>

                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-muted-foreground" size={16} />
                  <Input
                    type="date"
                    min={todayStr}
                    {...register("validUntil", {
                      required: "Expiry date is required",
                    })}
                    className="pl-10 h-11 bg-muted rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground">
                  Usage Limit
                </Label>

                <div className="relative">
                  <Info className="absolute left-3 top-3 text-muted-foreground" size={16} />
                  <Input
                    type="number"
                    {...register("maxUses", {
                      min: {
                        value: 1,
                        message: "Usage limit must be at least 1",
                      },
                    })}
                    className="pl-10 h-11 bg-muted rounded-xl"
                  />
                </div>
              </div>

            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl font-bold"
              disabled={isPending}
            >
              {isPending
                ? "Processing..."
                : selectedVoucher
                ? "Update Voucher"
                : "Create Voucher"}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoucherForm;