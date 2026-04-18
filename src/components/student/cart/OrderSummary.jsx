import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Banknote,
  CircleCheck,
  CreditCard,
  Landmark,
  LockKeyhole,
} from "lucide-react";
import { useVoucherMutations } from "@/mutations/useVoucherMutations";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const OrderSummary = ({ cart }) => {
  const [voucherCode, setVoucherCode] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [newTotal, setNewTotal] = useState(0);
  const { applyVoucher } = useVoucherMutations();
  const {
    mutateAsync: applyVoucherMutation,
    isPending: isApplyingVoucher,
    error: applyVoucherError,
  } = applyVoucher;

  const handleApply = async () => {
    if (!voucherCode) {
      toast.error("Please enter a voucher code");
      return;
    }
    const data = await applyVoucherMutation({ code: voucherCode });
    if (data) {
      setDiscountValue(data.discountValue);
      setDiscountAmount(data.discountAmount);
      setNewTotal(data.newTotal);
    }
  };

  return (
    <div className="xl:flex-1 h-min sticky top-4 p-8 flex flex-col gap-8 rounded-3xl bg-white border border-gray-100 shadow-sm">
      <div className="text-center space-y-1">
        <h2 className="text-[#141B2B] text-2xl font-extrabold font-['Plus Jakarta Sans']">
          Order Summary
        </h2>
        <p className="text-xs text-[#464555] font-bold uppercase tracking-widest opacity-60">
          Confirm your purchase
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center bg-[#F9F9FF] p-4 rounded-2xl border border-gray-50">
          <p className="text-sm font-bold text-[#464555] uppercase tracking-wider">
            Subtotal
          </p>
          <p className="text-xl font-black text-[#141B2B] font-['Plus Jakarta Sans']">
            ${cart.total}
          </p>
        </div>
        {discountValue > 0 && (
          <div className="flex justify-between items-center bg-green-200 p-4 rounded-2xl border border-gray-50">
            <p className="text-sm font-bold text-[#464555] uppercase tracking-wider">
              Discount
            </p>
            <p className="text-xl font-black text-[#141B2B] font-['Plus Jakarta Sans']">
              -${discountAmount}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Field>
          <FieldLabel className="uppercase text-[10px] font-black tracking-[1.5px] text-[#464555] ml-1">
            Discount Code
          </FieldLabel>
          <div className="flex gap-2">
            <Input
              type="text"
              className="bg-[#F9F9FF] text-[#141B2B] rounded-xl font-medium border-gray-100 focus:border-[#3525CD] transition-colors"
              placeholder="GIVEMEXO"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
            />
            <Button
              onClick={handleApply}
              className="rounded-xl px-6 bg-[#141B2B] hover:bg-black text-white font-bold transition-all"
            >
              {isApplyingVoucher ? <Spinner className="size-4" /> : "Apply"}
            </Button>
          </div>
        </Field>
      </div>

      <div className="flex flex-col items-center gap-4 py-6 border-y border-dashed border-gray-200">
        <div className="text-center">
          <span className="uppercase text-[10px] font-black tracking-[2px] text-[#777587]">
            Grand Total
          </span>
          <div
            className={`text-5xl font-black text-[#3525CD] font-['Plus Jakarta Sans'] mt-1 ${newTotal ? "line-through" : ""}`}
          >
            ${cart.total}
          </div>
          {newTotal > 0 && (
            <div className="text-5xl font-black text-[#3525CD] font-['Plus Jakarta Sans'] mt-1">
              ${newTotal}
            </div>
          )}
        </div>
      </div>

      <Button className="w-full h-16 bg-[#3525CD] hover:bg-[#2a1da6] text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-100 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group">
        Proceed to Checkout
        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
      </Button>

      <div className="space-y-6">
        <div className="flex justify-center items-center gap-6 text-gray-400">
          <CreditCard className="size-6 transition-colors hover:text-[#3525CD]" />
          <Banknote className="size-6 transition-colors hover:text-[#3525CD]" />
          <Landmark className="size-6 transition-colors hover:text-[#3525CD]" />
        </div>
        <div className="bg-gray-50 p-3 rounded-xl flex justify-center items-center gap-2 border border-gray-100">
          <LockKeyhole className="size-4 text-green-500" />
          <p className="text-[10px] uppercase font-black tracking-wider text-[#464555] opacity-70">
            Secure encrypted transaction
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
