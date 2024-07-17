import { redirect } from "next/navigation";
import { getCurrentUser, hasRole } from "lib/supabase/supbase.server";
import { UserRoles } from "lib/models/enums";
import CoachProfilePage from "./coach-profile-page";
import UserProfile from "./user-profile";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user || !user?.profile) return redirect("/join/get-started");

  if (await hasRole(UserRoles.CoachesAndAdmins)) return <CoachProfilePage />;

  return <UserProfile profile={user.profile} />;
}
