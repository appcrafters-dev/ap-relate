import { UserRoles } from "lib/models/enums";
import {
  getCurrentUser,
  isUserRoleRestricted,
} from "lib/supabase/supbase.server";
import { notFound } from "next/navigation";

export default async function UserPage() {
  if (await isUserRoleRestricted(UserRoles.CoachesAndAdmins)) notFound();

  const user = await getCurrentUser();

  return <pre>{JSON.stringify(user, null, 2)}</pre>;
}
