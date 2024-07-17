import {
  getCurrentUser,
  getSupabaseServerComponentClient,
  isUserRoleRestricted,
} from "lib/supabase/supbase.server";
import ConnectResults from "./connect-result-page";
import { HeartIcon } from "@heroicons/react/24/outline";
import { UserRoles } from "lib/models/enums";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Connect - Total Family Management",
};

async function getConnectDeliverables(familyId) {
  const supabase = getSupabaseServerComponentClient();

  const { data: family, error } = await supabase.client
    .from("families")
    .select(
      `
        family_name,
        status,
        family_mantra,
        family_photo_url,
        life_phase:life_phases(title),
        family_members(
          *,
          ...user_roles(*, ...user_profiles(*)),
          family_member_roles(*)
        ),
        family_values(*)    
    `
    )
    .eq("id", familyId)
    .limit(1)
    .single();

  if (error) return { data: null, error };

  // filter out historic family_member_roles and sort roles by index
  family.family_members.forEach((member) => {
    if (!member.family_member_roles?.length) return;

    const latest_role_definition = member.family_member_roles.sort(
      (a, b) => b.completed_on - a.completed_on
    )[0];

    member.roles = latest_role_definition.roles.map(
      ({ role_title }) => role_title
    );

    delete member.family_member_roles;
  });

  if (!family.family_values?.length) return { data: family, error: null };

  // filter out historic family_value_actions and sort values by index
  const latestValues = family.family_values.sort(
    (a, b) => b.completed_on - a.completed_on
  )[0];

  family.family_value_actions = latestValues.actions;

  delete family.family_values;

  return { data: family, error: null };
}

export default async function ShowConnectResults() {
  if (await isUserRoleRestricted(UserRoles.FamilyMembers)) return notFound();

  const user = await getCurrentUser();
  const { data, error } = await getConnectDeliverables(user.family?.id);

  if (error) {
    console.error("ERROR - getConnectDeliverables:", error);
    return <p>Something went wrong, please try again later.</p>;
  }

  if (
    !data ||
    !data.family_members?.length ||
    !data.family_value_actions?.length
  ) {
    return (
      <div className="mx-auto flex min-h-96 max-w-sm flex-col items-center justify-center py-2">
        <div className="text-center">
          <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Nothing here yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Once you complete all of the Connect sessions, you&lsquo;ll be able
            to view your Family Vision and Values here.
          </p>
        </div>
      </div>
    );
  }

  console.log("data", JSON.stringify(data, null, 2));

  return <ConnectResults family={data} />;
}
