import { UserRoles } from "lib/models/enums";
import {
  getSupabaseServerComponentClient,
  isUserRoleRestricted,
} from "lib/supabase/supbase.server";
import { notFound } from "next/navigation";
import NewSessionForm from "./new-session";

export default async function SessionNewPage({ searchParams = {} }) {
  if (await isUserRoleRestricted(UserRoles.Admins)) notFound();
  const supabase = getSupabaseServerComponentClient();
  const { data: families, error: familyError } = await supabase.client
    .from("families")
    .select("id, family_name");
  if (familyError)
    return (
      familyError.message || "Something went wrong, please try again later."
    );
  const { data: coaches, error: coachError } = await supabase.client
    .from("coaches")
    .select("id, ...user_roles(...user_profiles(first_name, last_name))");
  if (coachError)
    return (
      coachError.message || "Something went wrong, please try again later."
    );
  const { data: sessions, error: sessionError } = await supabase.client
    .from("sessions")
    .select("id, title, number");
  if (sessionError)
    return (
      sessionError.message || "Something went wrong, please try again later."
    );

  return (
    <NewSessionForm
      {...{
        searchParams,
        families,
        coaches,
        sessions,
      }}
    />
  );
}
