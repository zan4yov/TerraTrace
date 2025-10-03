import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { z } from "zod";

const vendorSchema = z.object({
  name: z.string().min(1, "Nama vendor wajib diisi").max(200),
  location: z.string().min(1, "Lokasi wajib diisi").max(200),
  sector: z.string().min(1, "Sektor wajib diisi").max(200),
  compliance_status: z.enum(["compliant", "non-compliant", "review"]),
  co2_level: z.string().min(1, "CO₂ level wajib dipilih"),
});

export const AddVendorDialog = ({ onVendorAdded }: { onVendorAdded: () => void }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    sector: "",
    compliance_status: "review" as "compliant" | "non-compliant" | "review",
    co2_level: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input
      const validated = vendorSchema.parse(formData);

      const { error } = await supabase.from("vendors").insert([{
        name: validated.name,
        location: validated.location,
        sector: validated.sector,
        compliance_status: validated.compliance_status,
        co2_level: validated.co2_level,
      }]);

      if (error) throw error;

      toast({
        title: "Vendor berhasil ditambahkan",
        description: `${validated.name} telah ditambahkan ke sistem.`,
      });

      setOpen(false);
      setFormData({
        name: "",
        location: "",
        sector: "",
        compliance_status: "review",
        co2_level: "",
      });
      onVendorAdded();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validasi gagal",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Gagal menambahkan vendor",
          description: error instanceof Error ? error.message : "Terjadi kesalahan",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Vendor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Vendor Baru</DialogTitle>
            <DialogDescription>
              Masukkan informasi vendor yang akan ditambahkan ke sistem monitoring.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Vendor</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="PT. Contoh Vendor"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Lokasi</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Jakarta, Indonesia"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sector">Sektor</Label>
              <Input
                id="sector"
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                placeholder="Manufacturing, Retail, dll."
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="compliance_status">Status Compliance</Label>
              <Select
                value={formData.compliance_status}
                onValueChange={(value: "compliant" | "non-compliant" | "review") =>
                  setFormData({ ...formData, compliance_status: value })
                }
              >
                <SelectTrigger id="compliance_status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="compliant">Compliant</SelectItem>
                  <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="co2_level">CO₂ Level</Label>
              <Select
                value={formData.co2_level}
                onValueChange={(value) => setFormData({ ...formData, co2_level: value })}
                required
              >
                <SelectTrigger id="co2_level">
                  <SelectValue placeholder="Pilih level CO₂" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Vendor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
