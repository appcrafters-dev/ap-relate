import {
  getSupabaseServerComponentClient,
  hasRole,
} from "lib/supabase/supbase.server";
import FamilyMemberLayout from "@/components/family-member-layout";
import { prettyDate, getAge } from "lib/date";
import Link from "next/link";
import { FamilyMemberType, UserRoles } from "lib/models/enums";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { data: headOfHousehold } = await getHeadOfHousehold(params.name);
  return {
    title: `Heads of Household - ${headOfHousehold?.first_name} - Total Family Management`,
  };
}

async function getHeadOfHousehold(id) {
  const supabase = getSupabaseServerComponentClient();

  const { data: headOfHousehold, error: headOfHouseholdError } =
    await supabase.getUserProfile(id);

  if (headOfHouseholdError) return { data: null, error: headOfHouseholdError };

  const { data: roles, error: rolesError } = await supabase.client
    .from("family_member_roles")
    .select("roles")
    .eq("family_member_id", id)
    .order("completed_on", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (rolesError) return { data: null, error: rolesError };

  headOfHousehold.roles = roles?.roles.map((role) => role.role_title);

  const { data: timeWise, error: timeWiseError } = await supabase.client
    .from("time_wises")
    .select("*")
    .eq("family_member_id", id)
    .order("completed_on", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (timeWiseError) return { data: null, error: timeWiseError };

  headOfHousehold.time_wise = timeWise;

  return {
    data: headOfHousehold,
    error: null,
  };
}

export default async function HeadOfHouseholdPage({ params }) {
  const { data: headOfHousehold, error } = await getHeadOfHousehold(
    params.name
  );

  const isAdmin = await hasRole(UserRoles.CoachesAndAdmins);

  if (error) console.error("ERROR - getHeadOfHousehold:", error);

  if (!headOfHousehold) return notFound();

  const profile_fields = {
    Email: headOfHousehold.email,
    Phone: headOfHousehold.phone,
    Birthday: headOfHousehold.birth_date
      ? prettyDate(headOfHousehold.birth_date)
      : null,
    Age: headOfHousehold.birth_date ? getAge(headOfHousehold.birth_date) : null,
    Occupation: headOfHousehold.occupation,
    "Relationship Status": headOfHousehold.relationship_status
      ? headOfHousehold.relationship_status.split(" - ")[0]
      : "",
    [headOfHousehold.relationship_status === "Married" ? "Spouse" : "Partner"]:
      headOfHousehold.partner_spouse && (
        <Link
          href={`/family/head-of-household/${headOfHousehold.partner_spouse.id}`}
          className="hover:text-tfm-secondary"
        >
          {headOfHousehold.partner_spouse.first_name}→
        </Link>
      ),
    Anniversary:
      headOfHousehold.relationship_anniversary &&
      prettyDate(headOfHousehold.relationship_anniversary),
  };

  return (
    <FamilyMemberLayout
      person={headOfHousehold}
      profile_fields={profile_fields}
      memberType={FamilyMemberType.HeadOfHouseHold}
      isAdmin={isAdmin}
    />
  );
}
