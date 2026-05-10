import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ShieldAlert, Trash2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/untyped-client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Report {
  id: string;
  reporter_name: string | null;
  reporter_phone: string | null;
  shop_or_seller_name: string;
  seller_phone: string | null;
  item_name: string | null;
  category: string | null;
  description: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

export function ReportsManager() {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [notesById, setNotesById] = useState<Record<string, string>>({});

  const fetchReports = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load reports", description: error.message, variant: "destructive" });
    } else {
      setReports((data || []) as Report[]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchReports(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const admin_notes = notesById[id] ?? undefined;
    const { error } = await supabase.from("reports").update({ status, admin_notes }).eq("id", id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else { toast({ title: `Marked as ${status}` }); fetchReports(); }
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("reports").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Report deleted" }); fetchReports(); }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-destructive" />
          Suspicious Activity Reports
        </CardTitle>
        <CardDescription>User-submitted reports about sellers, shops or listings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {reports.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No reports yet.</p>
        )}
        {reports.map((r) => (
          <div key={r.id} className="rounded-xl border border-border p-4 space-y-3 bg-card">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{r.shop_or_seller_name}</h3>
                  <Badge variant={r.status === "resolved" ? "default" : r.status === "dismissed" ? "secondary" : "destructive"}>
                    {r.status}
                  </Badge>
                  {r.category && <Badge variant="outline">{r.category}</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(r.created_at), "MMM d, yyyy HH:mm")}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => remove(r.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-2 text-sm">
              <div><span className="text-muted-foreground">Seller phone: </span>{r.seller_phone || "—"}</div>
              <div><span className="text-muted-foreground">Item: </span>{r.item_name || "—"}</div>
              <div><span className="text-muted-foreground">Reporter: </span>{r.reporter_name || "Anonymous"}</div>
              <div><span className="text-muted-foreground">Reporter phone: </span>{r.reporter_phone || "—"}</div>
            </div>

            <p className="text-sm whitespace-pre-wrap bg-muted/50 rounded-lg p-3">{r.description}</p>

            <Textarea
              placeholder="Admin notes (optional)"
              defaultValue={r.admin_notes ?? ""}
              onChange={(e) => setNotesById((n) => ({ ...n, [r.id]: e.target.value }))}
              rows={2}
            />

            <div className="flex gap-2 flex-wrap">
              <Button size="sm" onClick={() => updateStatus(r.id, "resolved")}>
                <CheckCircle2 className="h-4 w-4 mr-1" /> Mark resolved
              </Button>
              <Button size="sm" variant="secondary" onClick={() => updateStatus(r.id, "dismissed")}>
                Dismiss
              </Button>
              <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, "open")}>
                Reopen
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
