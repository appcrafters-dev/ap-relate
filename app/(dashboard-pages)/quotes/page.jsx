import { notFound } from "next/navigation";
import Quotes from "./quote-page";
import {
  getCurrentUser,
  getSupabaseServerComponentClient,
  isUserRoleRestricted,
} from "lib/supabase/supbase.server";
import { UserRoles } from "lib/models/enums";

function getQuotes(familyId) {
  const supabase = getSupabaseServerComponentClient();

  return supabase.client
    .from("quotes")
    .select(
      `
      id,
      quote,
      date,
      family_member:family_member_id(...user_roles(*, ...user_profiles(*))),
      themes:quote_themes(title)
    `
    )
    .eq("family_id", familyId)
    .order("date", { ascending: false });
}
export default async function QuotePage() {
  if (await isUserRoleRestricted(UserRoles.FamilyMembers)) return notFound();
  const user = await getCurrentUser();

  const { data, error } = await getQuotes(user.family.id);

  if (error) {
    console.error("ERROR - getQuotes:", error);
    return <p>Something went wrong, please try again later.</p>;
  }

  return <Quotes quotes={data} />;
}
