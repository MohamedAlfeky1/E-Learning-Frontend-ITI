const PaymentSummary = ({ subtotal, discount, total }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
      <h3 className="text-xl font-bold text-gray-800">Order Summary</h3>
      <div className="space-y-2 border-b pb-4">
        <div className="flex justify-between text-gray-600">
          <span>Original Price</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Voucher Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
      </div>
      <div className="flex justify-between text-lg font-bold text-purple-700">
        <span>Total Amount</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default PaymentSummary;