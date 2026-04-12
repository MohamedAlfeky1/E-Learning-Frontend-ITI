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
import "./style.css";

const OrderSummary = () => {
  return (
    <div
      className="h-min sticky top-4 p-8 flex flex-col gap-8 rounded-4xl"
      style={{ backgroundColor: "#DCE2F7" }}
    >
      <h2 className="text-black text-center text-2xl px-8 font-extrabold font-plus-jakarta">
        Order Summary
      </h2>
      <div className="flex flex-col gap-4">
        <div className="subtotal font-inter flex justify-between">
          <p style={{ color: "#464555" }}>Subtotal</p>
          <p className="text-black font-semibold font-inter">$144.00</p>
        </div>
        <div className="tax font-inter flex justify-between">
          <p style={{ color: "#464555" }}>Tax</p>
          <p className="text-black font-semibold font-inter">$11.52</p>
        </div>
        <div
          className="discount font-inter flex justify-between"
          style={{ color: "#005523" }}
        >
          <p>Discount</p>
          <p className="font-semibold font-inter">-$21.60</p>
        </div>
      </div>
      <Field>
        <FieldLabel
          className="uppercase text-[12px] font-normal tracking-[1px] font-inter"
          style={{ color: "#464555" }}
        >
          discount code
        </FieldLabel>
        <Input type="text" className="bg-white rounded-lg" placeholder="Enter code" />
        <Button className="rounded-lg" style={{ backgroundColor: "#F1F3FF", color: "#141B2B" }}>Apply</Button>
      </Field>
      <div className="grand-total flex flex-col gap-2 sm:flex-row sm:justify-between">
        <div className="flex flex-col text-center sm:text-left">
          <span
            className="grand-total-label -mb-1 uppercase text-xs tracking-[1px] font-semibold font-inter"
            style={{ color: "#777587" }}
          >
            grand total
          </span>
          <div className="grand-total-price text-3xl font-extrabold text-black font-plus-jakarta">
            $133.92
          </div>
        </div>
        <Badge
          className="uppercase font-semibold font-inter self-center sm:self-end"
          style={{ backgroundColor: "#4AE176", color: "#005321" }}
        >
          <CircleCheck size={36} color="#4AE176" fill="#141B2B" />
          saved $21.60
        </Badge>
      </div>
      <Button className="px-6 py-10 capitalize text-base sm:text-lg font-bold font-plus-jakarta">
        proceed to checkout <ArrowRight />
      </Button>
      <div className="flex justify-center items-center gap-4">
        <CreditCard color="#454545" />
        <Banknote color="#454545" />
        <Landmark color="#454545" />
      </div>
      <div className="text-gray-500 flex justify-center items-center gap-2">
        <LockKeyhole size={20} />
        <p className="text-xs font-medium font-inter">
          Secure encrypted transaction
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;
