import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, ClipboardCheck } from "lucide-react";

export const AuditsView = () => {
  const audits = [
    {
      id: 1,
      vendor: "PT Supplier Alpha",
      date: "January 15, 2025",
      auditor: "Green Audit Indonesia",
      status: "Completed",
      result: "Passed",
      score: 95,
      findings: "2 minor observations",
    },
    {
      id: 2,
      vendor: "CV Beta Materials",
      date: "January 10, 2025",
      auditor: "ESG Consultants",
      status: "Under Review",
      result: "Pending",
      score: 72,
      findings: "3 major findings",
    },
    {
      id: 3,
      vendor: "PT Gamma Industries",
      date: "January 8, 2025",
      auditor: "Compliance Partners",
      status: "Completed",
      result: "Passed",
      score: 88,
      findings: "1 minor observation",
    },
    {
      id: 4,
      vendor: "UD Delta Corp",
      date: "December 28, 2024",
      auditor: "Green Audit Indonesia",
      status: "Completed",
      result: "Failed",
      score: 58,
      findings: "5 major findings",
    },
  ];

  const getResultBadge = (result: string) => {
    switch (result) {
      case "Passed":
        return <Badge className="bg-success hover:bg-success">Passed</Badge>;
      case "Failed":
        return <Badge className="bg-destructive hover:bg-destructive">Failed</Badge>;
      case "Pending":
        return <Badge className="bg-warning hover:bg-warning">Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Audit Management</h2>
        <p className="text-muted-foreground">Track compliance audits and assessment results</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Audits</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">83%</div>
            <p className="text-xs text-muted-foreground">↑ 5% from last quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Audits</CardTitle>
          <CardDescription>Latest compliance audit results and findings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Audit Date</TableHead>
                <TableHead>Auditor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Findings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audits.map((audit) => (
                <TableRow key={audit.id}>
                  <TableCell className="font-medium">{audit.vendor}</TableCell>
                  <TableCell>{audit.date}</TableCell>
                  <TableCell>{audit.auditor}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{audit.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={
                      audit.score >= 80 ? "text-success font-semibold" :
                      audit.score >= 60 ? "text-warning font-semibold" :
                      "text-destructive font-semibold"
                    }>
                      {audit.score}/100
                    </span>
                  </TableCell>
                  <TableCell>{getResultBadge(audit.result)}</TableCell>
                  <TableCell className="text-muted-foreground">{audit.findings}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
