import { notFound } from "next/navigation";
import Quotes from "./quote-page";
import {
  getSupabaseServerComponentClient,
  isUserRoleRestricted,
} from "lib/supabase/supbase.server";
import { UserRoles } from "lib/models/enums";

export const dynamic = "force-dynamic";

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
export default async function QuotePage({ params }) {
  if (await isUserRoleRestricted(UserRoles.CoachesAndAdmins)) return notFound();
  const { data, error } = await getQuotes(params.id);

  if (error) return <p>Something went wrong, please try again later.</p>;

  return (
    <Quotes quotes={data} showAddQuoteButton={true} familyId={params.id} />
  );
}
