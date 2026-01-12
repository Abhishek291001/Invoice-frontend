import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  data: Record<string, number>;
  icon?: LucideIcon;
};

export default function MultiCurrencyStatCard({
  title,
  data,
  icon: Icon,
}: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>

      <CardContent className="space-y-1">
        {Object.keys(data || {}).length === 0 && (
          <p className="text-sm text-muted-foreground">No data</p>
        )}

        {Object.entries(data || {}).map(([currency, amount]) => (
          <div
            key={currency}
            className="flex justify-between text-sm font-semibold"
          >
            <span>{currency}</span>
            <span>{amount.toFixed(2)}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
