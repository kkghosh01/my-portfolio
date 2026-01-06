import { Card, CardContent } from "../ui/card";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
}

export default function DashboardCard({
  title,
  count,
  icon: Icon,
}: DashboardCardProps) {
  return (
    <Card className="bg-card shadow-sm hover:shadow-md transition-all hover:border-primary/30 dark:bg-muted/40">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-bold mt-1 tracking-tight">{count}</h3>
          </div>

          <div className="rounded-xl bg-primary/10 text-primary p-3">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
