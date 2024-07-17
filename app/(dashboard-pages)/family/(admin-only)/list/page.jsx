import Link from "next/link";
import DocTable from "@/app/components/doc-table";
import Badge from "@/components/ui/badge";
import { buildQuery } from "lib/supabase/supabase";
import {
  getSupabaseServerComponentClient,
  isUserRoleRestricted,
} from "lib/supabase/supbase.server";
import { notFound } from "next/navigation";
import { UserRoles } from "lib/models/enums";
import NewFamilyModal from "@/app/(dashboard-pages)/components/new-family-modal";

export const dynamic = "force-dynamic";

export default async function FamilyListPage({ searchParams = {} }) {
  if (await isUserRoleRestricted(UserRoles.CoachesAndAdmins)) return notFound();

  const supabase = getSupabaseServerComponentClient();

  const fields = `
  id,
  family_name,
  status,
  coach:assigned_coach_id("id", ...user_roles(...user_profiles(first_name, last_name))),
  heads_of_household:family_members("id", ...user_roles(...user_profiles(first_name, last_name))),
  partner:partner_id(id, company_legal_name)
  `;

  let query = supabase.client.from("families").select(fields);

  query = buildQuery(query, searchParams);

  const { data: families, error } = await query;

  const { data: lifePhases, error: lifePhasesError } = await supabase.client
    .from("life_phases")
    .select("id, title, description");

  const { data: partners, error: partnersError } = await supabase.client
    .from("partners")
    .select("id, company_legal_name");

  if (error || lifePhasesError || partnersError)
    return (
      error.message ||
      lifePhasesError.message ||
      "Something went wrong, please try again later."
    );

  return (
    <>
      <DocTable
        heading="Family List"
        subheading={`Showing ${families.length} families`}
        docList={families}
        route="/family/list"
        rowLink={(doc) => `/family/${doc.id}`}
        searchParams={searchParams}
        mobileColumn={{
          displayName: "Family",
          format: (doc) => (
            <div>
              <p className="font-bold text-tfm-primary">{doc.family_name}</p>
              <p>{doc.status}</p>
              <Link href={`/family/${doc.id}`}>Details</Link>
            </div>
          ),
        }}
        columns={[
          {
            name: "family_name",
            displayName: "Family Name",
            filterConfig: {
              key: "family_name",
              valueFormat: async (value) => {
                "use server";
                return value;
              },
              unTyped: true,
            },
            format: async (value, column, row) => {
              "use server";
              return (
                <Link
                  href={`/family/${row.id}`}
                  className="font-bold text-tfm-primary hover:underline"
                >
                  {value}
                </Link>
              );
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
                    value === "Active"
                      ? "green"
                      : value === "Onboarding"
                      ? "yellow"
                      : value === "Inactive"
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
                ? value?.first_name + " " + value?.last_name.split("")[0] + "."
                : "Unassigned";
            },
            filterConfig: {
              key: "assigned_coach_id",
              valueFormat: async (value) => {
                "use server";
                return value?.id;
              },
            },
          },
          {
            name: "partner",
            displayName: "Partner",
            format: async (value) => {
              "use server";
              return value?.company_legal_name || null;
            },
            filterConfig: {
              key: "partner_id",
              valueFormat: async (value) => {
                "use server";
                return value?.id;
              },
            },
          },
          {
            name: "heads_of_household",
            displayName: "Family Members",
            format: async (value, column, row) => {
              "use server";
              return value
                .filter(
                  // only show heads of household that are not children
                  (hoh) =>
                    !row.heads_of_household.some(
                      (m) => m.id === hoh.id && m.is_child
                    )
                )
                .map((hoh) => hoh.first_name)
                .join(", ");
            },
          },
        ]}
      />
      <NewFamilyModal lifePhases={lifePhases} partners={partners} />
    </>
  );
}
