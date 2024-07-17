import {
  getCurrentUser,
  getSupabaseServerComponentClient,
  isUserRoleRestricted,
} from "lib/supabase/supbase.server";

import {
  FamilyBillingMethod,
  FamilyPartnerStatus,
  UserRoles,
} from "lib/models/enums";
import MembershipRequired from "@/app/components/membership-required";
import { notFound } from "next/navigation";
import Sessions from "./workshop-page";

async function getFamilySession(familyId) {
  const supabase = getSupabaseServerComponentClient();

  return supabase.client
    .from("family_sessions")
    .select(
      `id,
      status,
      scheduled_time,
      planned_for_quarter:planned_quarter_id(id, starts_on, ends_on),
      session:sessions(id, number, title, description),
      coach:coaches(*, ...user_roles(*, ...user_profiles(first_name, last_name)))
      `
    )
    .eq("family_id", familyId);
}

export default async function WorkShopPage() {
  if (await isUserRoleRestricted(UserRoles.FamilyMembers)) return notFound();

  const user = await getCurrentUser();

  if (
    !user.family ||
    (user.family.status !== FamilyPartnerStatus.Active &&
      user.family.billing_method === FamilyBillingMethod.Self)
  ) {
    return (
      <MembershipRequired message="Before you can schedule a session, you'll need an active membership. Subscribe now to get started." />
    );
  }

  const { data, error } = await getFamilySession(user.family.id);

  if (error) {
    console.error("ERROR - getFamilySession:", error);
    return <p>Something went wrong, please try again later.</p>;
  }

  return <Sessions familySessions={data} />;
}
