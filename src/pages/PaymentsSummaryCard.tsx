import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Payment {
  amount: number;
  payment_method: string;
  payment_date: string | Date | null;
  remark?: string;
}

interface PaymentsSummaryCardProps {
  formData: {
    currency?: string;
    grand_total?: number;
    total_paid?: number;
    previous_payments?: Payment[];
  };
  mode: "create" | "edit" | "view"; 
}

const PaymentsSummaryCard: React.FC<PaymentsSummaryCardProps> = ({ formData, mode }) => {
 
  if (mode === "create") return null;

  const currency = formData.currency || "INR";
  const grandTotal = formData.grand_total || 0;
  const totalPaid = formData.total_paid || 0;
  const pendingAmount = grandTotal - totalPaid;

  return (
    <Card className="mb-6">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Payments Summary</CardTitle>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Pending Amount</p>
          <p className="text-lg font-bold text-red-600">
            {currency} {pendingAmount.toFixed(2)}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {formData.previous_payments && formData.previous_payments.length > 0 ? (
          <div className="space-y-2">
            {formData.previous_payments.map((payment, i) => (
              <div
                key={i}
                className={`flex justify-between border rounded p-2 items-center ${
                  mode === "view" ? "bg-gray-50 cursor-not-allowed" : ""
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{payment.payment_method}</span>
                  <span className="text-sm text-muted-foreground">
                    {payment.payment_date
                      ? new Date(payment.payment_date).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">
                    {currency} {payment.amount.toFixed(2)}
                  </span>
                  {payment.remark && (
                    <p className="text-sm text-muted-foreground">{payment.remark}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No previous payments.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentsSummaryCard;
