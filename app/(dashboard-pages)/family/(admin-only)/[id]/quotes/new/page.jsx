import {
  getSupabaseServerComponentClient,
  isUserRoleRestricted,
} from "lib/supabase/supbase.server";
import NewQuote from "./new-page";
import { UserRoles } from "lib/models/enums";
import { notFound } from "next/navigation";

async function getNewQuoteData(familyId) {
  const supabase = getSupabaseServerComponentClient();

  const { data: family, error: familyError } = await supabase.client
    .from("families")
    .select(`id, family_name`)
    .eq("id", familyId)
    .single();

  if (familyError) return { data: null, error: familyError };

  const { data: familyMembers, error: familyMembersError } =
    await supabase.getFamilyMembers(familyId);

  if (familyMembersError) return { data: null, error: familyMembersError };

  const { data: quote_themes, error: themesError } = await supabase.client
    .from("quote_themes")
    .select("title");

  if (themesError) return { data: null, error: themesError };

  return {
    data: {
      family,
      familyMembers,
      themes: quote_themes.map((theme) => theme.title),
    },
  };
}

export default async function NewQuotePage({ params, searchParams }) {
  if (await isUserRoleRestricted(UserRoles.CoachesAndAdmins)) return notFound();

  const { data, error } = await getNewQuoteData(params.id);

  if (error)
    return error.message || "Something went wrong, please try again later.";

  return (
    <NewQuote
      family={data.family}
      searchParams={searchParams}
      familyMembers={data.familyMembers}
      themes={data.themes}
    />
  );
}
