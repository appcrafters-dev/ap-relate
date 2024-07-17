import { UserRoles } from "lib/models/enums";
import {
  getCurrentUser,
  getSupabaseServerComponentClient,
  hasRole,
} from "lib/supabase/supbase.server";
import { redirect } from "next/navigation";
import FamilyDetails from "./family-details";

async function getAllLifePhases() {
  const supabase = getSupabaseServerComponentClient();
  const { data, error } = await supabase.client
    .from("life_phases")
    .select("id, title, description");

  if (error) throw error;
  return data;
}

async function getFamily(familyId) {
  const supabase = getSupabaseServerComponentClient();
  const { data, error } = await supabase.client
    .from("families")
    .select(
      `
        id,
        family_name,
        family_photo_url,
        life_phase_id,
        primary_address:addresses(address_line1, address_line2, city, state, pincode, id)
      `
    )
    .eq("id", familyId)
    .single();

  if (!data) throw new Error("Family not found.");
  if (error) throw error;
  return data;
}

export default async function FamilyDetailsPage() {
  const user = await getCurrentUser();

  if (!user || !user?.profile || !user.family?.id)
    return redirect("/join/get-started");

  if (await hasRole(UserRoles.CoachesAndAdmins))
    return redirect("/settings/profile");

  try {
    const family = await getFamily(user?.family?.id);
    const lifePhases = await getAllLifePhases();
    return <FamilyDetails {...{ family, lifePhases }} />;
  } catch (error) {
    console.error("ERROR", error);
    return <p>Sorry, something went wrong, please try again later.</p>;
  }
}
