import { getSupabaseServerComponentClient } from "lib/supabase/supbase.server";
import FamilyMemberLayout from "@/components/family-member-layout";
import { prettyDate, getAge } from "lib/date";
import { FamilyMemberType } from "lib/models/enums";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { data: child } = await getChild(params.name);

  return {
    title: `Children - ${child?.first_name} - Total Family Management`,
  };
}

async function getChild(id) {
  const supabase = getSupabaseServerComponentClient();
  return supabase.getUserProfile(id);
}

export default async function ChildPage({ params }) {
  const { data: child, error } = await getChild(params.name);

  if (error) console.error("ERROR - getChild:", error);

  if (!child) return notFound();

  console.log("child", child);
  const profile_fields = {
    Email: child.email,
    Phone: child.phone,
    Birthday: child.birth_date ? prettyDate(child.birth_date) : null,
    Age: child.birth_date ? getAge(child.birth_date) : null,
    "Living at Home": child.child_living_at_home ? "Yes" : "No",
  };

  return (
    <FamilyMemberLayout
      person={child}
      profile_fields={profile_fields}
      memberType={FamilyMemberType.Child}
    />
  );
}
