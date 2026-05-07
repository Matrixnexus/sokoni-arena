// Daraja M-Pesa STK Push edge function for ad payments.
// Secrets (set in Supabase): DARAJA_CONSUMER_KEY, DARAJA_CONSUMER_SECRET,
// DARAJA_SHORTCODE, DARAJA_PASSKEY, DARAJA_ENV ("sandbox" | "production"),
// DARAJA_CALLBACK_URL.
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

type StkBody = {
  phone: string;          // 2547xxxxxxxx
  amount: number;         // KES
  reference: string;      // listing/shop id
  description?: string;   // human-readable
};

function normalizePhone(p: string): string {
  const d = p.replace(/[^0-9]/g, "");
  if (d.startsWith("254")) return d;
  if (d.startsWith("0")) return "254" + d.slice(1);
  if (d.startsWith("7") || d.startsWith("1")) return "254" + d;
  return d;
}

async function getAccessToken(env: string, key: string, secret: string) {
  const base = env === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";
  const auth = btoa(`${key}:${secret}`);
  const res = await fetch(`${base}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  if (!res.ok) throw new Error(`Daraja auth failed [${res.status}]: ${await res.text()}`);
  const json = await res.json();
  return { token: json.access_token as string, base };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const KEY = Deno.env.get("DARAJA_CONSUMER_KEY");
    const SECRET = Deno.env.get("DARAJA_CONSUMER_SECRET");
    const SHORTCODE = Deno.env.get("DARAJA_SHORTCODE");
    const PASSKEY = Deno.env.get("DARAJA_PASSKEY");
    const ENV = Deno.env.get("DARAJA_ENV") || "sandbox";
    const CALLBACK = Deno.env.get("DARAJA_CALLBACK_URL");

    if (!KEY || !SECRET || !SHORTCODE || !PASSKEY || !CALLBACK) {
      return new Response(JSON.stringify({ error: "Daraja secrets not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as StkBody;
    if (!body?.phone || !body?.amount || !body?.reference) {
      return new Response(JSON.stringify({ error: "phone, amount and reference are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const phone = normalizePhone(body.phone);
    const amount = Math.max(1, Math.round(body.amount));
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);
    const password = btoa(`${SHORTCODE}${PASSKEY}${timestamp}`);

    const { token, base } = await getAccessToken(ENV, KEY, SECRET);

    const stkRes = await fetch(`${base}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        BusinessShortCode: SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: CALLBACK,
        AccountReference: body.reference.slice(0, 12),
        TransactionDesc: (body.description || "Sokoni Ad").slice(0, 13),
      }),
    });

    const stkJson = await stkRes.json();
    if (!stkRes.ok || stkJson.ResponseCode !== "0") {
      return new Response(JSON.stringify({ error: "STK push failed", detail: stkJson }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      ok: true,
      checkoutRequestId: stkJson.CheckoutRequestID,
      merchantRequestId: stkJson.MerchantRequestID,
      message: "Check your phone and enter your M-Pesa PIN to complete payment",
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
