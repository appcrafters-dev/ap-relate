import Link from "next/link";
import DocTable from "@/app/components/doc-table";
import Badge from "@/components/ui/badge";
import { buildQuery } from "lib/supabase/supabase";
import {
  getCurrentUser,
  getSupabaseServerComponentClient,
  isUserRoleRestricted,
} from "lib/supabase/supbase.server";
import { notFound } from "next/navigation";
import { UserRoles } from "lib/models/enums";
import MembershipRequired from "@/app/components/membership-required";
import NewFamilyModal from "../../components/new-family-modal";

export default async function PartnerFamilyListPage({ searchParams = {} }) {
  if (await isUserRoleRestricted(UserRoles.Partners)) return notFound();

  const user = await getCurrentUser();
  const partner = user.partner;
  const supabase = getSupabaseServerComponentClient();

  const fields = `
  id,
  family_name,
  status,
  coach:assigned_coach_id("id", ...user_roles(...user_profiles(first_name, last_name))),
  heads_of_household:family_members("id", ...user_roles(...user_profiles(first_name, last_name)))
  `;

  let query = supabase.client
    .from("families")
    .select(fields)
    .eq("partner_id", partner.id);

  query = buildQuery(query, searchParams);

  const { data: families, error } = await query;

  const { data: lifePhases = [], error: lifePhasesError } =
    await supabase.client.from("life_phases").select("*");

  if (error || lifePhasesError)
    return (
      error.message ||
      lifePhasesError.message ||
      "Something went wrong, please try again later."
    );

  if (!Object.keys(searchParams).length && families.length === 0)
    return (
      <MembershipRequired
        heading="Nothing here yet!"
        message={`You don't have any families connected to ${partner.company_legal_name}. Get started now by purchasing a TFM subscription for your first family.`}
        hideLink
      >
        <NewFamilyModal partnerId={partner.id} lifePhases={lifePhases} />
      </MembershipRequired>
    );

  return (
    <div className="space-y-8">
      <DocTable
        heading="Family List"
        subheading={`Showing ${families.length} families`}
        docList={families}
        route="/partners/families"
        // rowLink={(doc) => `/family/${doc.id}`}
        searchParams={searchParams}
        mobileColumn={{
          displayName: "Family",
          format: (doc) => (
            <div>
              <p className="font-bold text-tfm-primary">{doc.family_name}</p>
              <p>{doc.status}</p>
              <Link href={`/partners/families/${doc.id}`}>Details</Link>
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
            // format: async (value, column, row) => {
            //   "use server";
            //   return (
            //     <Link
            //       href={`/family/${row.id}`}
            //       className="font-bold text-tfm-primary hover:underline"
            //     >
            //       {value}
            //     </Link>
            //   );
            // },
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
                ? value?.first_name + " " + value?.last_name
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
      <NewFamilyModal partnerId={partner.id} lifePhases={lifePhases} />
    </div>
  );
}
