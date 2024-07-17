import { FamilyPartnerStatus } from "lib/models/enums";
import { getSupabaseRouteHandlerSecretClient } from "lib/supabase/supabase.edge";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const relevantEvents = [
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.created",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
];

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    if (!sig || !webhookSecret)
      return new Response("Webhook secret not found.", { status: 400 });
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log(`🔔  Webhook received: ${event.type}`);
    if (relevantEvents.includes(event.type)) {
      const supabase = getSupabaseRouteHandlerSecretClient();
      switch (event.type) {
        case "checkout.session.completed": {
          // handle checkout session completed
          const checkoutSession = event.data.object;
          console.log("🔔  Checkout session:", checkoutSession);
          const { data: family, error: familyError } = await supabase.client
            .from("families")
            .update({
              status: FamilyPartnerStatus.Active,
            })
            .eq("stripe_customer_id", checkoutSession.customer)
            .select("id")
            .maybeSingle();
          if (familyError) throw familyError;
          if (!family) throw new Error("Family not found.");
          // TODO: improve this and handle incrementing credits
          const { error: creditError } = await supabase.client
            .from("family_session_credits")
            .insert({
              id: family.id,
              credits: 8,
            });
          if (creditError) throw creditError;
          break;
        }
        case "customer.subscription.updated":
          // handle customer subscription updated
          break;
        case "customer.subscription.deleted":
          // handle customer subscription deleted
          break;
        case "customer.subscription.created":
          // handle customer subscription created
          break;
        case "invoice.payment_succeeded":
          // handle invoice payment succeeded
          break;
        case "invoice.payment_failed":
          // handle invoice payment failed
          break;
        default:
          console.log(`❌ Unhandled event type: ${event.type}`);
      }
    }
  } catch (err) {
    console.log(`❌ Error message: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  return new Response("ok");
}
