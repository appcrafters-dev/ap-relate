import {
  getSupabaseServerComponentClient,
  isUserRoleRestricted,
} from "lib/supabase/supbase.server";
import FamilyVision from "./family-member-roles-page";
import { UserRoles } from "lib/models/enums";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getFamilyVisionPageData(familyMemberId) {
  const supabase = getSupabaseServerComponentClient();

  const { data: familyMember, error: familyMemberError } =
    await supabase.getUserProfile(familyMemberId);

  if (familyMemberError) return { data: null, error: familyMemberError };

  const { data: familyMemberRole, error: familyMemberRoleError } =
    await supabase.client
      .from("family_member_roles")
      .select()
      .eq("family_member_id", familyMemberId)
      .order("completed_on", { ascending: false })
      .limit(1)
      .maybeSingle();

  if (familyMemberRoleError)
    return { data: null, error: familyMemberRoleError };

  familyMember.vision = familyMemberRole;

  const { data: allRoles, error: allRolesError } = await supabase.client
    .from("family_roles")
    .select("id, title:family_role");

  if (allRolesError) return { data: null, error: allRolesError };

  return {
    data: {
      familyMember,
      allRoles: allRoles,
    },
    error: null,
  };
}

export default async function FamilyVisionPage({ params }) {
  if (await isUserRoleRestricted(UserRoles.CoachesAndAdmins)) return notFound();

  const { data, error } = await getFamilyVisionPageData(params.name);

  if (error) {
    console.log("ERROR - getFamilyVisionPageData:", error);
    return <p>Something went wrong, please try again later.</p>;
  }

  return (
    <FamilyVision familyMember={data.familyMember} allRoles={data.allRoles} />
  );
}
