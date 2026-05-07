import { useState, useEffect } from "react";
import { Crown, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/untyped-client";
import { AdPaymentSelector, type AdPlan } from "./AdPaymentSelector";

interface ShopPromotionButtonProps { shopId: string; shopName: string; }

const PLANS: AdPlan[] = [
  { id: "month", label: "1 Month", price: 299,  durationDays: 30 },
  { id: "year",  label: "1 Year",  price: 3000, durationDays: 365 },
];

export function ShopPromotionButton({ shopId, shopName }: ShopPromotionButtonProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [existingRequest, setExistingRequest] = useState<any>(null);

  useEffect(() => {
    if (user && shopId) {
      (supabase.from("shop_promotion_requests" as any) as any)
        .select("*").eq("shop_id", shopId).eq("user_id", user.id)
        .order("created_at", { ascending: false }).limit(1).maybeSingle()
        .then(({ data }: any) => setExistingRequest(data));
    }
  }, [user, shopId]);

  const handlePaid = async (plan: AdPlan) => {
    if (!user) return;
    await (supabase.from("shop_promotion_requests" as any) as any).insert({
      shop_id: shopId, user_id: user.id, duration_days: plan.durationDays,
    });
    setIsOpen(false);
    const { data } = await (supabase.from("shop_promotion_requests" as any) as any)
      .select("*").eq("shop_id", shopId).eq("user_id", user.id)
      .order("created_at", { ascending: false }).limit(1).maybeSingle();
    setExistingRequest(data);
  };

  if (existingRequest) {
    const cfg: Record<string, any> = {
      pending:  { icon: Clock,       color: "bg-amber-100 text-amber-700", label: "Pending" },
      approved: { icon: CheckCircle, color: "bg-green-100 text-green-700", label: "Promoted" },
      rejected: { icon: XCircle,     color: "bg-red-100 text-red-700",     label: "Declined" },
    };
    const c = cfg[existingRequest.status] || cfg.pending;
    const Icon = c.icon;
    return <Badge className={c.color}><Icon className="h-3 w-3 mr-1" />Promo: {c.label}</Badge>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Crown className="h-4 w-4" />Promote Shop
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Promote Your Shop</DialogTitle>
          <DialogDescription>Premium placement for "{shopName}".</DialogDescription>
        </DialogHeader>
        <AdPaymentSelector
          plans={PLANS}
          reference={shopId}
          description="Shop Promotion"
          onPaymentInitiated={handlePaid}
        />
      </DialogContent>
    </Dialog>
  );
}
