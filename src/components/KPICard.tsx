import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  trend: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "destructive";
}

export const KPICard = ({ title, value, trend, icon: Icon, variant = "default" }: KPICardProps) => {
  const gradientClasses = {
    default: "bg-gradient-primary",
    success: "bg-gradient-success",
    warning: "bg-gradient-warning",
    destructive: "bg-destructive",
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn("p-2 rounded-lg", gradientClasses[variant])}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{trend}</p>
      </CardContent>
    </Card>
  );
};
