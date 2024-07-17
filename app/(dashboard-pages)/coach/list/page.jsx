import Link from "next/link";
import DocTable from "@/app/components/doc-table";
import { LinkButton } from "@/components/ui/buttons";
import { UserGroupIcon } from "@heroicons/react/20/solid";
import { buildQuery } from "lib/supabase/supabase";
import {
  isUserRoleRestricted,
  getSupabaseServerComponentClient,
} from "lib/supabase/supbase.server";
import { UserRoles } from "lib/models/enums";
import { notFound } from "next/navigation";

export function getAvatar(row) {
  return (
    <Link href={`/coach/${row?.id}`}>
      {row?.avatar_url ? (
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
      )}
    </Link>
  );
}

export default async function CoachListPage({ searchParams = {} }) {
  if (await isUserRoleRestricted(UserRoles.CoachesAndAdmins)) return notFound();

  const supabase = getSupabaseServerComponentClient();

  let query = supabase.client.from("coaches").select(`
    id,
    ...user_roles(...user_profiles(first_name, last_name, email, phone, avatar_url))`);

  query = buildQuery(query, searchParams);

  const { data: coaches, error } = await query;

  if (error)
    return error.message || "Something went wrong, please try again later.";

  return (
    <DocTable
      heading="Coach List"
      subheading={`Showing ${coaches.length} coaches`}
      docList={coaches}
      route="/coach/list"
      searchParams={searchParams}
      rowLink={(doc) => `/coach/${doc.id}`}
      mobileColumn={{
        displayName: "Coach",
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
          name: "coach",
          displayName: "Coach",
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
          name: "families",
          displayName: "Families",
          format: async (value, column, row) => {
            "use server";
            return (
              <LinkButton
                extraSmall
                href={`/family/list?assigned_coach_id.eq=${row.id}`}
                Icon={UserGroupIcon}
              >
                Families
              </LinkButton>
            );
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
      ]}
    />
  );
}
