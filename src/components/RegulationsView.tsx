import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Regulation {
  id: string;
  name: string;
  category: string;
  description: string | null;
  threshold: string | null;
  status: string;
}

export const RegulationsView = () => {
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRegulations();
  }, []);

  const fetchRegulations = async () => {
    try {
      const { data, error } = await supabase
        .from("regulations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRegulations(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading regulations",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Regulations & Standards</h2>
        <p className="text-muted-foreground">ESG compliance standards and regulatory requirements</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {regulations.map((regulation) => (
          <Card key={regulation.id} className="hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gradient-secondary">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{regulation.name}</CardTitle>
                    <CardDescription>{regulation.category}</CardDescription>
                  </div>
                </div>
                <Badge className="bg-success hover:bg-success">
                  {regulation.status.charAt(0).toUpperCase() + regulation.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {regulation.description || "No description available"}
              </p>
              <div className="flex items-center justify-between pt-2 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Threshold</p>
                  <p className="text-sm font-medium">
                    {regulation.threshold || "Not specified"}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Document
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
