import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AddVendorDialog } from "./AddVendorDialog";
import { useUserRole } from "@/hooks/useUserRole";

interface Vendor {
  id: string;
  name: string;
  location: string;
  sector: string;
  compliance_status: string;
  co2_level: string | null;
  safety_rating: string | null;
  last_audit_date: string | null;
}

export const VendorsView = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useUserRole();
  const { toast } = useToast();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVendors(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading vendors",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "review":
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case "non-compliant":
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "compliant":
        return <Badge className="bg-success hover:bg-success">Compliant</Badge>;
      case "review":
        return <Badge className="bg-warning hover:bg-warning">Review</Badge>;
      case "non-compliant":
        return <Badge className="bg-destructive hover:bg-destructive">Non-Compliant</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vendor Management</h2>
          <p className="text-muted-foreground">Track and monitor vendor compliance status</p>
        </div>
        {isAdmin && <AddVendorDialog onVendorAdded={fetchVendors} />}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Vendors</CardTitle>
          <CardDescription>
            {vendors.length === 0 
              ? "No vendors registered yet. Add your first vendor to start tracking compliance."
              : `Complete list of ${vendors.length} supply chain vendors and their compliance status`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {vendors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Start by adding vendors through the backend dashboard</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>CO₂ Level</TableHead>
                  <TableHead>Safety Rating</TableHead>
                  <TableHead>Last Audit</TableHead>
                  <TableHead>Compliance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>{getStatusIcon(vendor.compliance_status)}</TableCell>
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell>{vendor.location}</TableCell>
                    <TableCell>{vendor.sector}</TableCell>
                    <TableCell>
                      {vendor.co2_level ? (
                        <Badge variant="outline" className={
                          vendor.co2_level === "Low" ? "border-success text-success" :
                          vendor.co2_level === "Medium" ? "border-warning text-warning" :
                          "border-destructive text-destructive"
                        }>
                          {vendor.co2_level}
                        </Badge>
                      ) : "-"}
                    </TableCell>
                    <TableCell>{vendor.safety_rating || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {vendor.last_audit_date 
                        ? new Date(vendor.last_audit_date).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>{getStatusBadge(vendor.compliance_status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
