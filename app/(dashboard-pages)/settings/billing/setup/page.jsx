import { FamilyPartnerStatus, UserRoles } from "lib/models/enums";
import {
  createCustomer,
  createFirstYearCheckoutSession,
  getPortalSessionUrl,
} from "lib/stripe";
import {
  getCurrentUser,
  getSupabaseServerComponentClient,
  isUserRoleRestricted,
} from "lib/supabase/supbase.server";
import { redirect } from "next/navigation";

export default async function BillingSetupPage() {
  const roles = [UserRoles.HeadOfHousehold, UserRoles.PartnerAdmin];
  if (await isUserRoleRestricted(roles)) {
    return "Sorry, you must be a Head of Household or Partner Admin to access this page.";
  }

  const ERROR_MESSAGE =
    "Sorry, there was a problem setting up your billing. Please try again or contact us for assistance.";
  const supabase = getSupabaseServerComponentClient();
  const user = await getCurrentUser();

  const isPartner = !!user.partner?.id;
  const existingCustomerId = isPartner
    ? user.partner.stripe_customer_id
    : user.family.stripe_customer_id;

  const customer = existingCustomerId
    ? { id: existingCustomerId }
    : await createCustomer(user, isPartner);

  if (!customer) return ERROR_MESSAGE;
  const stripe_customer_id = customer.id;

  // update customer id in the database
  if (stripe_customer_id && !existingCustomerId) {
    const id = isPartner ? user.partner.id : user.family.id;
    const payload = { stripe_customer_id };
    if (isPartner) payload.status = FamilyPartnerStatus.Active;
    const { error } = await supabase.client
      .from(isPartner ? "partners" : "families")
      .update(payload)
      .eq("id", id);

    if (error) return ERROR_MESSAGE;
  }

  const portal_session_url = await getPortalSessionUrl(customer.id);
  if (!portal_session_url) return ERROR_MESSAGE;

  // partners redirect to billing portal
  if (isPartner) return redirect(portal_session_url);

  // families redirect to checkout a first year membership
  const checkout = await createFirstYearCheckoutSession(customer.id);
  if (checkout) return redirect(checkout.url);

  return ERROR_MESSAGE;
}
