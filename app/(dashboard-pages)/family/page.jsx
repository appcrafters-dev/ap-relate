import {
  getCurrentUser,
  getSupabaseServerComponentClient,
} from "lib/supabase/supbase.server";
import { redirect } from "next/navigation";
import FamilyPage from "./family-page";
import { ErrorBox } from "@/components/ui/errors";

export async function generateMetadata() {
  return {
    title: "My Family - Total Family Management",
  };
}

async function getFamilyMembers(familyId) {
  const supabase = getSupabaseServerComponentClient();

  const { data: family, error: familyError } = await supabase.client
    .from("families")
    .select(
      `
      id,
      family_name,
      status
    `
    )
    .eq("id", familyId);

  if (familyError) return { data: null, error: familyError };

  const { data: familyMembers, error: familyMembersError } =
    await supabase.getFamilyMembers(familyId);
  console.log("familyMembers::", familyMembers);

  if (familyMembersError) return { data: null, error: familyMembersError };

  const headsOfHousehold = [];
  const children = [];

  for (const member of familyMembers) {
    if (member.is_child) {
      children.push(member);
    } else {
      headsOfHousehold.push(member);
    }
  }

  const { data: pets, error: petsError } = await supabase.client
    .from("pets")
    .select()
    .eq("family_id", familyId);

  if (petsError) return { data: null, error: petsError };

  return {
    data: {
      family,
      headsOfHousehold,
      children,
      pets,
    },
    error: null,
  };
}

export default async function FamilyMembers() {
  const user = await getCurrentUser();
  const familyId = user.family.id;
  if (!familyId) return redirect("/join/get-started");

  const { data, error } = await getFamilyMembers(familyId);

  if (error) {
    console.error("ERROR - getFamilyMembers:", error);
    return <ErrorBox />;
  }

  if (data.family.status === "Onboarding") {
    return redirect("/join/get-started");
  }

  return (
    <FamilyPage
      familyName={data.family.family_name}
      headsOfHousehold={data.headsOfHousehold}
      familyChildren={data.children}
      pets={data.pets}
    />
  );
}
