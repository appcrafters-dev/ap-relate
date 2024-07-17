import { getCustomerSubscriptions, getPortalSessionUrl } from "lib/stripe";
import Billing from "./billing-page";
import {
  getCurrentUser,
  isUserRoleRestricted,
} from "lib/supabase/supbase.server";
import { UserRoles } from "lib/models/enums";
import { redirect } from "next/navigation";

async function getUserInfo(user) {
  const family = user.family || null;
  const partner = user.partner || null;

  const subscriptions = await getCustomerSubscriptions(
    partner?.stripe_customer_id || family?.stripe_customer_id
  );

  const portal_url =
    subscriptions && subscriptions.length > 0
      ? await getPortalSessionUrl(subscriptions[0].customer)
      : null;

  return { family, partner, subscriptions, portal_url };
}

export default async function BillingPage() {
  if (
    await isUserRoleRestricted([
      UserRoles.HeadOfHousehold,
      UserRoles.PartnerAdmin,
    ])
  )
    redirect("/dashboard");

  const user = await getCurrentUser();
  const { family, portal_url, subscriptions } = await getUserInfo(user);

  return (
    <Billing
      family={family}
      isPartner={user.profile.role === UserRoles.PartnerAdmin}
      portal_url={portal_url}
      subscriptions={subscriptions}
    />
  );
}
