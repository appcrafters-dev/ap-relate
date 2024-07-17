import { UserRoles } from "lib/models/enums";
import { getSupabaseRouteHandlerSecretClient } from "lib/supabase/supabase.edge";
import { isUserRoleRestricted } from "lib/supabase/supbase.server";
import { notFound } from "next/navigation";

export default async function RolesPage() {
  if (await isUserRoleRestricted(UserRoles.CoachesAndAdmins)) notFound();

  const supabase = getSupabaseRouteHandlerSecretClient();

  const { data, error } = await supabase.client
    .from("family_member_roles")
    .select("roles");

  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  const roles = data.map((role) => role.roles).flat();

  //   count the number of times each role_title appears
  const roleCounts = roles.reduce((acc, role) => {
    acc[role.role_title] = acc[role.role_title] ? acc[role.role_title] + 1 : 1;
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
      <caption className="font-brand text-2xl">Most Popular Roles</caption>
      <thead className="border-b text-left">
        <tr>
          <th className="p-2">Role</th>
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
