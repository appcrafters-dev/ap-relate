import {
  getSupabaseServerComponentClient,
  isUserRoleRestricted,
} from "lib/supabase/supbase.server";
import { notFound } from "next/navigation";
import { UserRoles } from "lib/models/enums";
import DocTable from "@/app/components/doc-table";
import InviteUserModal from "@/app/(dashboard-pages)/settings/users/invite-user";

function getAvatar(row) {
  return row?.avatar_url ? (
    <img
      src={row?.avatar_url}
      className="h-8 w-8 rounded-full object-cover"
      alt={`${row?.first_name} ${row?.last_name} avatar`}
    />
  ) : (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
      {row?.first_name.charAt(0)}
      {row?.last_name.charAt(0)}
    </span>
  );
}

export const dynamic = "force-dynamic";

export default async function PartnerUsersPage({ searchParams = {}, params }) {
  if (await isUserRoleRestricted(UserRoles.Admin)) notFound();
  const supabase = getSupabaseServerComponentClient();

  const { data: users, error } = await supabase.client
    .from("user_profiles_view")
    .select("*")
    .eq("partner_id", params.id)
    .or(
      `role.eq.${UserRoles.PartnerAdmin}, role.eq.${UserRoles.PartnerAdvisor}`
    );

  if (error)
    return error.message || "Something went wrong, please try again later.";

  return (
    <>
      <DocTable
        docList={users}
        searchParams={searchParams}
        route="/settings/users"
        mobileColumn={{
          displayName: "User",
          format: async (doc) => {
            "use server";
            return (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  {getAvatar(doc)}
                  <div>
                    <span className="text-base font-bold text-tfm-primary">
                      {doc.first_name} {doc.last_name}
                    </span>
                    <p className="text-xs text-gray-600">
                      {doc.email} {doc.phone}
                    </p>
                  </div>
                </div>
              </div>
            );
          },
        }}
        columns={[
          {
            name: "profile",
            displayName: "User",
            format: async (value, column, row) => {
              "use server";
              return getAvatar(row);
            },
          },
          {
            name: "first_name",
            displayName: "First Name",
            filterConfig: {
              key: "first_name",
              unTyped: true,
            },
          },
          {
            name: "last_name",
            displayName: "Last Name",
            filterConfig: {
              key: "last_name",
              unTyped: true,
            },
          },
          {
            name: "email",
            displayName: "Email",
            filterConfig: {
              key: "email",
              unTyped: true,
            },
          },
          {
            name: "phone",
            displayName: "Phone",
            filterConfig: {
              key: "phone",
              unTyped: true,
            },
          },
          {
            name: "role",
            displayName: "Role",
            filterConfig: {
              key: "role",
            },
          },
        ]}
      />
      <InviteUserModal partnerId={params.id} />
    </>
  );
}
