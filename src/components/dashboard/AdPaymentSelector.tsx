import { useState } from "react";
import { Loader2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/untyped-client";
import { cn } from "@/lib/utils";

export type AdPlan = {
  id: string;
  label: string;
  price: number;          // KES
  durationDays: number;
};

interface Props {
  plans: AdPlan[];
  reference: string;
  description: string;
  defaultPlanId?: string;
  onPaymentInitiated: (plan: AdPlan) => Promise<void> | void;
}

/**
 * Pricing + M-Pesa STK push selector. After the user enters their phone and
 * picks a plan, we trigger Daraja STK push and call onPaymentInitiated so the
 * caller can record the request (status: pending) for admin/system to verify.
 */
export function AdPaymentSelector({
  plans, reference, description, defaultPlanId, onPaymentInitiated,
}: Props) {
  const { toast } = useToast();
  const [planId, setPlanId] = useState(defaultPlanId || plans[0].id);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const plan = plans.find(p => p.id === planId)!;

  const handlePay = async () => {
    if (!phone || phone.replace(/[^0-9]/g, "").length < 9) {
      toast({ title: "Enter a valid M-Pesa phone number", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("mpesa-stk-push", {
        body: { phone, amount: plan.price, reference, description },
      });
      if (error || (data as any)?.error) {
        throw new Error((data as any)?.error || error?.message || "Payment failed");
      }
      toast({
        title: "Check your phone",
        description: "Enter your M-Pesa PIN to complete the payment.",
      });
      await onPaymentInitiated(plan);
    } catch (e: any) {
      toast({ title: "Payment failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Choose a plan</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {plans.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlanId(p.id)}
              className={cn(
                "rounded-lg border p-3 text-left transition-all",
                planId === p.id
                  ? "border-primary bg-primary/10 ring-2 ring-primary/40"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="font-medium text-sm">{p.label}</div>
              <div className="text-primary font-bold mt-1">KES {p.price.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">{p.durationDays} days</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>M-Pesa phone number</Label>
        <Input
          type="tel"
          inputMode="tel"
          placeholder="07XX XXX XXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <Button onClick={handlePay} disabled={loading} className="w-full gap-2">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Smartphone className="h-4 w-4" />}
        Pay KES {plan.price.toLocaleString()} with M-Pesa
      </Button>
      <p className="text-[11px] text-muted-foreground text-center">
        Powered by Safaricom Daraja • You'll receive an STK prompt
      </p>
    </div>
  );
}
