import { UserRoles } from "lib/models/enums";
import {
  getCurrentUser,
  getSupabaseRouteHandlerSecretClient,
} from "lib/supabase/supabase.edge";
import { NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST() {
  try {
    const user = await getCurrentUser();

    // Ensure the user is authorized to process payments
    if (!user || user.profile.role !== UserRoles.Admin)
      return errorResponse("Unauthorized", 403);

    const supabase = getSupabaseRouteHandlerSecretClient();

    // Fetch unpaid coach payments
    const { data: coachPayments, error: coachPaymentsError } =
      await supabase.client
        .from("coach_payments")
        .select("*, coach:coach_id(*)")
        .eq("paid", false);

    console.log("coachPayments", coachPayments);

    if (coachPaymentsError) throw coachPaymentsError;

    if (!coachPayments || coachPayments.length === 0)
      throw new Error("No unpaid coach payments found");

    // Process each unpaid coach payment
    for (const cp of coachPayments) await processPayment(cp, supabase);

    return NextResponse.json({ message: "Payments processed" });
  } catch (error) {
    console.error("Error processing payment", error);
    return errorResponse("Error processing payment");
  }
}

async function processPayment(cp, supabase) {
  // Check if the coach has a connected Stripe account and has payouts enabled
  if (!cp.coach.stripe_connected_account_id || !cp.coach.enable_payouts) {
    return console.log(
      `Skipping payment for coach ${cp.coach.first_name} ${cp.coach.last_name}`
    );
  }
  const transfer = await stripe.transfers.create({
    currency: "usd",
    amount: cp.amount * 100,
    destination: cp.coach.stripe_connected_account_id,
    description: cp.description || "Manual payment",
    metadata: {
      coach_payment_id: cp.id,
    },
  });

  if (transfer) {
    const { error } = await supabase.client
      .from("coach_payments")
      .update({ paid: true, stripe_transfer_id: transfer.id })
      .eq("id", cp.id);

    if (error) {
      console.error(
        `Error updating payment record for payment ID ${cp.id}:`,
        error
      );
      throw error;
    }
  }
}

function errorResponse(message, status = 500) {
  return NextResponse.json({ error: message }, { status });
}
