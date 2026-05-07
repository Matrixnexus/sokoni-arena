import { useState, useEffect } from "react";
import { Star, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/untyped-client";
import { AdPaymentSelector, type AdPlan } from "./AdPaymentSelector";

interface SponsorRequestButtonProps { listingId: string; listingTitle: string; }
interface SponsorRequest { id: string; status: string; duration_days: number; }

const PLANS: AdPlan[] = [
  { id: "week",  label: "1 Week",  price: 10, durationDays: 7 },
  { id: "month", label: "1 Month", price: 29, durationDays: 30 },
];

export function SponsorRequestButton({ listingId, listingTitle }: SponsorRequestButtonProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [existingRequest, setExistingRequest] = useState<SponsorRequest | null>(null);

  useEffect(() => { if (user && listingId) fetchExistingRequest(); }, [user, listingId]);

  const fetchExistingRequest = async () => {
    const { data } = await supabase
      .from("sponsor_requests").select("*")
      .eq("listing_id", listingId).eq("user_id", user?.id)
      .order("created_at", { ascending: false }).limit(1).maybeSingle();
    setExistingRequest(data);
  };

  const handlePaid = async (plan: AdPlan) => {
    if (!user) return;
    await supabase.from("sponsor_requests").insert({
      listing_id: listingId, user_id: user.id,
      duration_days: plan.durationDays, status: "pending",
    });
    setIsOpen(false);
    fetchExistingRequest();
  };

  if (existingRequest) {
    const statusConfig = {
      pending:  { icon: Clock,       color: "bg-amber-100 text-amber-700",  label: "Pending" },
      approved: { icon: CheckCircle, color: "bg-green-100 text-green-700",  label: "Approved" },
      rejected: { icon: XCircle,     color: "bg-red-100 text-red-700",      label: "Rejected" },
    };
    const config = statusConfig[existingRequest.status as keyof typeof statusConfig];
    const Icon = config.icon;
    return <Badge className={config.color}><Icon className="h-3 w-3 mr-1" />Sponsor: {config.label}</Badge>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Star className="h-4 w-4" />Promote
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Promote this Listing</DialogTitle>
          <DialogDescription>
            Boost "{listingTitle}" to the top of search and homepage rails.
          </DialogDescription>
        </DialogHeader>
        <AdPaymentSelector
          plans={PLANS}
          reference={listingId}
          description="Promoted Listing"
          onPaymentInitiated={handlePaid}
        />
      </DialogContent>
    </Dialog>
  );
}
