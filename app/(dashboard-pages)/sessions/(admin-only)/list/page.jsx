import DocTable from "@/app/components/doc-table";
import { SessionDatetime } from "@/app/components/doc-table-client-components";
import Badge from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/buttons";
import { PlusIcon } from "@heroicons/react/24/solid";
import { UserRoles } from "lib/models/enums";
import { buildQuery } from "lib/supabase/supabase";
import {
  getSupabaseServerComponentClient,
  hasRole,
  isUserRoleRestricted,
} from "lib/supabase/supbase.server";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SessionListPage({ searchParams = {} }) {
  if (await isUserRoleRestricted(UserRoles.CoachesAndAdmins)) return notFound();
  const showNew = await hasRole(UserRoles.Admins);

  const supabase = getSupabaseServerComponentClient();

  let query = supabase.client.from("family_sessions").select(
    `id,
    status,
    scheduled_time,
    planned_for_quarter:planned_quarter_id(id, starts_on, ends_on),
    session:sessions(id, number, title, description),
    coach:coaches("id", ...user_roles(...user_profiles(first_name, last_name))),
    family:family_id(id, family_name)
    `
  );

  query = buildQuery(query, searchParams);

  const { data: sessions, error } = await query;

  if (error)
    return error.message || "Something went wrong, please try again later.";

  return (
    <>
      <DocTable
        heading="Session List"
        subheading={`Showing ${sessions.length} sessions`}
        docList={sessions}
        route="/sessions/list"
        searchParams={searchParams}
        rowLink={(doc) => `/sessions/${doc.id}`}
        mobileColumn={{
          displayName: "Session",
          format: async (doc) => {
            "use server";
            return (
              <div>
                <p className="font-bold text-tfm-primary">
                  {doc.session?.number} - {doc.session?.title}
                </p>
                <p>{doc.status}</p>
                <Link href={`/sessions/${doc.id}`}>Details</Link>
              </div>
            );
          },
        }}
        columns={[
          {
            name: "session",
            displayName: "Session",
            format: async (value, column, row) => {
              "use server";
              return (
                <Link
                  href={`/sessions/${row?.id}`}
                  className="font-bold text-tfm-primary hover:underline"
                >
                  {value?.number} - {value?.title}
                </Link>
              );
            },
          },
          {
            name: "family",
            displayName: "Family",
            filterConfig: {
              key: "family_id",
              valueFormat: async (value) => {
                "use server";
                return value?.id;
              },
            },
            format: async (value) => {
              "use server";
              return value?.family_name;
            },
          },
          {
            name: "status",
            displayName: "Status",
            filterConfig: {
              key: "status",
              valueFormat: async (value) => {
                "use server";
                return value;
              },
            },
            format: async (value) => {
              "use server";
              return (
                <Badge
                  color={
                    value === "Scheduled"
                      ? "green"
                      : value === "Planned"
                      ? "yellow"
                      : value === "Canceled"
                      ? "red"
                      : "gray"
                  }
                >
                  {value}
                </Badge>
              );
            },
          },
          {
            name: "coach",
            displayName: "Coach",
            format: async (value) => {
              "use server";
              return value
                ? value.first_name + " " + value.last_name.split("")[0] + "."
                : "Unassigned";
            },
            filterConfig: {
              key: "coach_id",
              valueFormat: async (value) => {
                "use server";
                return value?.id;
              },
            },
          },
          {
            name: "scheduled_time",
            displayName: "Scheduled Time",
            filterConfig: {
              key: "scheduled_time",
              valueFormat: async (value) => {
                "use server";
                return value;
              },
            },
            format: async (value) => {
              "use server";
              let date = value ? new Date(value + "Z") : null;
              return date ? <SessionDatetime date={date} /> : null;
            },
          },
        ]}
      />
      {showNew && (
        <div className="mt-6 text-center">
          <LinkButton href="/sessions/new" Icon={PlusIcon} primary>
            New Session
          </LinkButton>
        </div>
      )}
    </>
  );
}
