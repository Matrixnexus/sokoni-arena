import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ShieldAlert, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/untyped-client";
import { z } from "zod";

const schema = z.object({
  reporter_name: z.string().trim().max(100).optional(),
  reporter_phone: z.string().trim().max(30).optional(),
  shop_or_seller_name: z.string().trim().nonempty("Shop / seller name is required").max(150),
  seller_phone: z.string().trim().max(30).optional(),
  item_name: z.string().trim().max(200).optional(),
  category: z.string().trim().max(80).optional(),
  description: z.string().trim().nonempty("Please describe the issue").max(2000),
});

export default function Report() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    reporter_name: "",
    reporter_phone: "",
    shop_or_seller_name: "",
    seller_phone: "",
    item_name: "",
    category: "",
    description: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Check the form", description: parsed.error.issues[0]?.message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("reports").insert({
      ...parsed.data,
      reporter_user_id: user?.id ?? null,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Could not send report", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Report submitted", description: "Thank you. Our admins will review it shortly." });
    setForm({
      reporter_name: "",
      reporter_phone: "",
      shop_or_seller_name: "",
      seller_phone: "",
      item_name: "",
      category: "",
      description: "",
    });
  };

  return (
    <Layout>
      <div className="container py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-destructive/10">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold">Report Suspicious Activity</h1>
            <p className="text-muted-foreground">
              Help us keep SokoniArena safe. Your report goes directly to our admin team.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Report details
            </CardTitle>
            <CardDescription>
              Provide as much detail as possible. Fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reporter_name">Your name</Label>
                  <Input id="reporter_name" value={form.reporter_name} onChange={set("reporter_name")} placeholder="Optional" />
                </div>
                <div>
                  <Label htmlFor="reporter_phone">Your phone</Label>
                  <Input id="reporter_phone" value={form.reporter_phone} onChange={set("reporter_phone")} placeholder="Optional" />
                </div>
              </div>

              <div>
                <Label htmlFor="shop_or_seller_name">Shop or seller name *</Label>
                <Input id="shop_or_seller_name" value={form.shop_or_seller_name} onChange={set("shop_or_seller_name")} required />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="seller_phone">Seller phone</Label>
                  <Input id="seller_phone" value={form.seller_phone} onChange={set("seller_phone")} placeholder="07xx xxx xxx" />
                </div>
                <div>
                  <Label htmlFor="category">Category of issue</Label>
                  <Input id="category" value={form.category} onChange={set("category")} placeholder="Scam, fake item, harassment…" />
                </div>
              </div>

              <div>
                <Label htmlFor="item_name">Item / listing they are selling</Label>
                <Input id="item_name" value={form.item_name} onChange={set("item_name")} placeholder="e.g. iPhone 14 Pro" />
              </div>

              <div>
                <Label htmlFor="description">Describe what happened *</Label>
                <Textarea id="description" rows={6} value={form.description} onChange={set("description")} required />
              </div>

              <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Submit report
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
