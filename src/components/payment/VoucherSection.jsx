import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ticket } from "lucide-react";

const VoucherSection = ({ onApply, isLoading }) => {
  const [code, setCode] = useState("");

  return (
    <div className="flex gap-2">

      <div className="relative flex-1">
        <Ticket 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
          size={18} 
        />

        <Input
          placeholder="Enter Voucher Code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="
            pl-10 
            bg-background 
            border-border 
            text-foreground 
            placeholder:text-muted-foreground
            focus-visible:ring-primary/50
          "
        />
      </div>
      <Button
        variant="outline"
        onClick={() => onApply(code)}
        disabled={!code || isLoading}
        className="
          border-border 
          text-foreground
          hover:bg-accent 
          hover:text-accent-foreground
        "
      >
        Apply
      </Button>

    </div>
  );
};

export default VoucherSection;