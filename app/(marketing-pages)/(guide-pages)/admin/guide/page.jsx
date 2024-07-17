import { UserRoles } from "lib/models/enums";
import { isUserRoleRestricted } from "lib/supabase/supbase.server";
import { notFound } from "next/navigation";

export default async function GuideAdminHomePage() {
  if (await isUserRoleRestricted(UserRoles.Admin)) return notFound();

  return "Guide Admin Homepage";
}
