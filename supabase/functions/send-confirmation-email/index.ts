import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import React from "react";
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";
import { renderAsync } from "@react-email/components";
import { ConfirmationEmail } from "./_templates/confirmation-email.tsx";

const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET')

interface WebhookPayload {
  user: {
    email: string
  }
  email_data: {
    token: string
    token_hash: string
    redirect_to: string
    email_action_type: string
    site_url: string
  }
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  if (!BREVO_API_KEY) {
    console.error('BREVO_API_KEY is not configured')
    return new Response(
      JSON.stringify({ error: { message: 'Email service not configured' } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)
    
    let webhookData: WebhookPayload
    
    // Verify webhook if secret is configured
    if (hookSecret) {
      const wh = new Webhook(hookSecret)
      webhookData = wh.verify(payload, headers) as WebhookPayload
    } else {
      webhookData = JSON.parse(payload) as WebhookPayload
    }

    const { user, email_data } = webhookData
    const { token_hash, email_action_type } = email_data
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    
    // Always redirect to production site after email verification
    const productionRedirectUrl = 'https://sokoniarena.co.ke'
    
    // Build confirmation URL
    const confirmationUrl = `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${encodeURIComponent(productionRedirectUrl)}`

    console.log(`Sending confirmation email to ${user.email}`)

    // Render email HTML
    const html = await renderAsync(
      React.createElement(ConfirmationEmail, { confirmationUrl })
    )

    // Send via Brevo API
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'SokoniArena',
          email: 'noreply@sokoniarena.co.ke',
        },
        to: [{ email: user.email }],
        subject: 'Complete Your SokoniArena Signup',
        htmlContent: html,
      }),
    })

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.text()
      console.error('Brevo API error:', errorData)
      throw new Error(`Brevo API error: ${brevoResponse.status} - ${errorData}`)
    }

    const result = await brevoResponse.json()
    console.log('Email sent successfully:', result)

    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error sending confirmation email:', error)
    return new Response(
      JSON.stringify({
        error: {
          http_code: 500,
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})