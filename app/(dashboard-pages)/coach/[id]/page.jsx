import { UserRoles } from "lib/models/enums";
import {
  getSupabaseServerComponentClient,
  isUserRoleRestricted,
} from "lib/supabase/supbase.server";
import { notFound } from "next/navigation";
import CoachProfile from "../../settings/profile/coach-profile";

export default async function CoachAdminPage({ params }) {
  if (await isUserRoleRestricted(UserRoles.CoachesAndAdmins)) return notFound();
  const supabase = getSupabaseServerComponentClient();
  const { data, error } = await supabase.client
    .from("coaches")
    .select(
      `
        *,
        ...user_roles(*, ...user_profiles(*))
        `
    )
    .eq("id", params.id)
    .single();

  if (error)
    return error.message || "An error occurred while fetching coach details.";
  if (!data) return "Coach not found.";

  return <CoachProfile {...{ profile: data }} />;
}
