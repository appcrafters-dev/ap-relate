import { UserRoles } from "lib/models/enums";
import { getSupabaseRouteHandlerSecretClient } from "lib/supabase/supabase.edge";
import { isUserRoleRestricted } from "lib/supabase/supbase.server";
import { notFound } from "next/navigation";

export default async function RolesPage() {
  if (await isUserRoleRestricted(UserRoles.CoachesAndAdmins)) notFound();

  const supabase = getSupabaseRouteHandlerSecretClient();

  const { data, error } = await supabase.client
    .from("family_values")
    .select("actions");

  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  const roles = data.map((role) => role.actions).flat();

  //   count the number of times each value_name appears
  const roleCounts = roles.reduce((acc, role) => {
    acc[role.value_name] = acc[role.value_name] ? acc[role.value_name] + 1 : 1;
    return acc;
  }, {});

  const roleCountList = Object.entries(roleCounts)
    .map(([role, count]) => ({
      role,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <table className="table-auto">
      <caption className="font-brand text-2xl">Most Popular Values</caption>
      <thead className="border-b text-left">
        <tr>
          <th className="p-2">Value</th>
          <th className="p-2 text-right">Count</th>
        </tr>
      </thead>
      <tbody>
        {roleCountList.map((role) => (
          <tr key={role.role}>
            <td className="p-2">{role.role}</td>
            <td className="p-2 text-right">{role.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
