import {
  getCurrentUser,
  getSupabaseServerComponentClient,
  isUserRoleRestricted,
} from "lib/supabase/supbase.server";
import { notFound, redirect } from "next/navigation";
import FamilyAdminPage from "./family-admin-page";
import { UserRoles } from "lib/models/enums";

export const dynamic = "force-dynamic";

async function getData(familyId) {
  const supabase = getSupabaseServerComponentClient();

  const { data: family, error: familyError } = await supabase.client
    .from("families")
    .select(
      `
        *, 
        partner:partner_id(*), 
        coach:assigned_coach_id(...user_profiles_view(*)),
        sessions:family_sessions(*),
        primary_address:addresses(*),
        pets(*),
        members:user_profiles_view(*)
      `
    )
    .eq("id", familyId)
    .single();

  if (familyError) return { data: null, error: familyError };

  const { data: lifePhases, error: lifePhasesError } = await supabase.client
    .from("life_phases")
    .select("id, title, description");

  if (lifePhasesError) return { data: null, error: lifePhasesError };

  const { data: coaches, error: coachesError } = await supabase.client
    .from("user_profiles_view")
    .select("*")
    .in("role", UserRoles.CoachesAndAdmins);

  console.error("error?", coachesError);
  if (coachesError) return { data: null, error: coachesError };

  const { data: partners, error: partnersError } = await supabase.client
    .from("partners")
    .select("id, company_legal_name");

  if (partnersError) return { data: null, error: partnersError };

  const headsOfHousehold = family.members.filter((m) => !m.is_child);
  const children = family.members.filter((m) => m.is_child);
  const pets = family.pets;

  return {
    data: {
      family,
      headsOfHousehold,
      children,
      pets,
      lifePhases,
      partners,
      coaches,
    },
    error: null,
  };
}

export default async function Page({ params }) {
  if (await isUserRoleRestricted(UserRoles.CoachesAndAdmins)) return notFound();

  if (!params.id) return redirect("/family/list");

  const { data, error } = await getData(params.id);

  if (error) {
    console.error("ERROR - getData:", error);
    return "Something went wrong, please try again later.";
  }

  const user = await getCurrentUser();

  return <FamilyAdminPage data={data} user={user} />;
}
