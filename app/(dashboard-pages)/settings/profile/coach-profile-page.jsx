import { getCurrentUser } from "lib/supabase/supbase.server";
import { UserRoles } from "lib/models/enums";
import CoachProfile from "./coach-profile";
import { redirect } from "next/navigation";

export default async function CoachProfilePage() {
  const user = await getCurrentUser();

  const coachProfile = user?.profiles?.find(
    (p) =>
      p.role === UserRoles.Coach ||
      p.role === UserRoles.CoachAdmin ||
      p.role === UserRoles.Admin
  );

  if (!coachProfile) return redirect("/dashboard");

  return <CoachProfile profile={coachProfile} />;
}
