import { UserRoles } from "lib/models/enums";
import {
  getSupabaseServerComponentClient,
  isUserRoleRestricted,
} from "lib/supabase/supbase.server";

import PartnerDetails from "../../settings/partner/partner-details";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getParner(partnerId) {
  const supabase = getSupabaseServerComponentClient();
  const { data, error } = await supabase.client
    .from("partners")
    .select(
      `
        *,
        billing_address:addresses(address_line1, address_line2, city, state, pincode, id),
        partner_members:partner_members(*, ...user_roles(*, ...user_profiles_view(*)))
      `
    )
    .eq("id", partnerId)
    .single();

  if (!data) throw new Error("Partner not found.");
  if (error) throw error;
  return data;
}

export default async function PartnerDetailsPage({ params }) {
  if (await isUserRoleRestricted(UserRoles.CoachesAndAdmins)) notFound();

  try {
    const partner = await getParner(params.id);
    return <PartnerDetails {...{ partner }} />;
  } catch (error) {
    console.error("ERROR", error);
    return <p>Sorry, something went wrong, please try again later.</p>;
  }
}
