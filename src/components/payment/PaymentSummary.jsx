const PaymentSummary = ({ subtotal, discount, total }) => {
  return (
    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
      
      <h3 className="text-xl font-bold text-foreground">
        Order Summary
      </h3>

      <div className="space-y-2 border-b border-border pb-4">
        
        <div className="flex justify-between text-muted-foreground">
          <span>Original Price</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-primary font-medium">
            <span>Voucher Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}

      </div>

      <div className="flex justify-between text-lg font-bold text-primary">
        <span>Total Amount</span>
        <span>${total.toFixed(2)}</span>
      </div>

    </div>
  );
};

export default PaymentSummary;