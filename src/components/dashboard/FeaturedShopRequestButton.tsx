import { useEffect, useState } from "react";
import { Sparkles, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/untyped-client";
import { AdPaymentSelector, type AdPlan } from "./AdPaymentSelector";

interface Props { shopId: string; shopName: string; }

const PLANS: AdPlan[] = [
  { id: "month", label: "1 Month — Featured", price: 100, durationDays: 30 },
];

export function FeaturedShopRequestButton({ shopId, shopName }: Props) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [existing, setExisting] = useState<any>(null);

  useEffect(() => {
    if (!user || !shopId) return;
    (supabase.from("shop_featured_requests" as any) as any)
      .select("*").eq("shop_id", shopId).eq("user_id", user.id)
      .order("created_at", { ascending: false }).limit(1).maybeSingle()
      .then(({ data }: any) => setExisting(data));
  }, [user, shopId]);

  const handlePaid = async (plan: AdPlan) => {
    if (!user) return;
    await (supabase.from("shop_featured_requests" as any) as any).insert({
      shop_id: shopId, user_id: user.id, duration_days: plan.durationDays,
    });
    setIsOpen(false);
    const { data } = await (supabase.from("shop_featured_requests" as any) as any)
      .select("*").eq("shop_id", shopId).eq("user_id", user.id)
      .order("created_at", { ascending: false }).limit(1).maybeSingle();
    setExisting(data);
  };

  if (existing) {
    const cfg: Record<string, any> = {
      pending:  { icon: Clock,       color: "bg-amber-100 text-amber-700", label: "Pending" },
      approved: { icon: CheckCircle, color: "bg-green-100 text-green-700", label: "Featured" },
      rejected: { icon: XCircle,     color: "bg-red-100 text-red-700",     label: "Declined" },
    };
    const c = cfg[existing.status] || cfg.pending;
    const Icon = c.icon;
    return <Badge className={c.color}><Icon className="h-3 w-3 mr-1" />Featured: {c.label}</Badge>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Sparkles className="h-4 w-4" />Promote to Featured List
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Featured Shops</DialogTitle>
          <DialogDescription>
            Hand-picked placement for "{shopName}" in the Elite Storefronts rail.
          </DialogDescription>
        </DialogHeader>
        <AdPaymentSelector
          plans={PLANS}
          reference={shopId}
          description="Featured Shop"
          onPaymentInitiated={handlePaid}
        />
      </DialogContent>
    </Dialog>
  );
}
