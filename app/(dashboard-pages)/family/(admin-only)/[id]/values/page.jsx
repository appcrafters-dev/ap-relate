import { UserRoles } from "lib/models/enums";
import FamilyValues from "./values-page";
import {
  getSupabaseServerComponentClient,
  isUserRoleRestricted,
} from "lib/supabase/supbase.server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getFamilyValues(familyId) {
  const supabase = getSupabaseServerComponentClient();

  const { data: familyValues, error: familyValuesError } = await supabase.client
    .from("family_values")
    .select(`*, family:families(id, family_name)`)
    .eq("family_id", familyId)
    .order("completed_on", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (familyValuesError) return { data: null, error: familyValuesError };

  let familyData = familyValues?.family;

  if (!familyData) {
    // get the family data if it wasn't found in the family_values query
    const { data: family, error: familyError } = await supabase.client
      .from("families")
      .select("id, family_name")
      .eq("id", familyId)
      .single();

    if (familyError) return { data: null, error: familyError };

    familyData = family;
  }

  const { data: allValues, error: valuesError } = await supabase.client
    .from("values")
    .select("id, name");

  if (valuesError) return { data: null, error: valuesError };

  return {
    data: {
      allValues,
      familyValues,
      familyData,
    },
    error: null,
  };
}

export default async function Values({ params }) {
  if (await isUserRoleRestricted(UserRoles.CoachesAndAdmins)) return notFound();

  const { data, error } = await getFamilyValues(params.id);

  if (error) return "Something went wrong, please try again later.";

  return (
    <FamilyValues
      family={data.familyData}
      familyValues={data.familyValues}
      allValues={data.allValues}
    />
  );
}
