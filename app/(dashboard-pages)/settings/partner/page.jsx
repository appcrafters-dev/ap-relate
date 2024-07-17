import { UserRoles } from "lib/models/enums";
import {
  getCurrentUser,
  getSupabaseServerComponentClient,
  hasRole,
} from "lib/supabase/supbase.server";
import { redirect } from "next/navigation";
import PartnerDetails from "./partner-details";

async function getParner(familyId) {
  const supabase = getSupabaseServerComponentClient();
  const { data, error } = await supabase.client
    .from("partners")
    .select(
      `
        *,
        billing_address:addresses(address_line1, address_line2, city, state, pincode, id)
      `
    )
    .eq("id", familyId)
    .single();

  if (!data) throw new Error("Partner not found.");
  if (error) throw error;
  return data;
}

export default async function PartnerDetailsPage() {
  const user = await getCurrentUser();

  if (!user || !user?.profile || !user.partner?.id)
    return redirect("/join/get-started");

  if (await hasRole(UserRoles.FamilyMembers))
    return redirect("/settings/profile");

  try {
    const partner = await getParner(user?.partner?.id);
    return <PartnerDetails {...{ partner }} />;
  } catch (error) {
    console.error("ERROR", error);
    return <p>Sorry, something went wrong, please try again later.</p>;
  }
}
