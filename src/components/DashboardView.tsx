import { Activity, Leaf, ShieldAlert, TrendingDown } from "lucide-react";
import { KPICard } from "./KPICard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const DashboardView = () => {
  const kpiData = [
    {
      title: "CO₂ Emissions",
      value: "1,245 tons",
      trend: "↓ 12% vs last month",
      icon: Leaf,
      variant: "success" as const,
    },
    {
      title: "Waste Management",
      value: "89%",
      trend: "↑ 5% improvement",
      icon: Activity,
      variant: "default" as const,
    },
    {
      title: "Safety Incidents",
      value: "3",
      trend: "↓ 2 vs last month",
      icon: ShieldAlert,
      variant: "warning" as const,
    },
    {
      title: "Non-Compliant",
      value: "4 vendors",
      trend: "Requires attention",
      icon: TrendingDown,
      variant: "destructive" as const,
    },
  ];

  const complianceMetrics = [
    { name: "ISO 14001", score: 92, status: "good" },
    { name: "ISO 45001", score: 88, status: "good" },
    { name: "PROPER", score: 75, status: "warning" },
    { name: "SMK3", score: 65, status: "danger" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">ESG Compliance Dashboard</h2>
        <p className="text-muted-foreground">Monitor and track your supply chain ESG performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Overview</CardTitle>
            <CardDescription>Current status across key standards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {complianceMetrics.map((metric) => (
              <div key={metric.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{metric.name}</span>
                  <span className={metric.status === "good" ? "text-success" : metric.status === "warning" ? "text-warning" : "text-destructive"}>
                    {metric.score}%
                  </span>
                </div>
                <Progress 
                  value={metric.score} 
                  className={metric.status === "good" ? "bg-muted [&>div]:bg-success" : metric.status === "warning" ? "bg-muted [&>div]:bg-warning" : "bg-muted [&>div]:bg-destructive"}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Audits</CardTitle>
            <CardDescription>Latest compliance assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { vendor: "PT Supplier Alpha", date: "2 days ago", status: "Passed", score: 95 },
                { vendor: "CV Beta Materials", date: "5 days ago", status: "Review", score: 72 },
                { vendor: "PT Gamma Industries", date: "1 week ago", status: "Passed", score: 88 },
              ].map((audit, index) => (
                <div key={index} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{audit.vendor}</p>
                    <p className="text-xs text-muted-foreground">{audit.date}</p>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      audit.status === "Passed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                    )}>
                      {audit.status}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">{audit.score}/100</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
