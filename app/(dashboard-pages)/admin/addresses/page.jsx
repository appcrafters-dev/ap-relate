import DocTable from "@/app/components/doc-table";
import Badge from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/buttons";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { UserRoles } from "lib/models/enums";
import { getSupabaseRouteHandlerSecretClient } from "lib/supabase/supabase.edge";
import { isUserRoleRestricted } from "lib/supabase/supbase.server";
import { notFound } from "next/navigation";

export default async function RolesPage({ searchParams }) {
  if (await isUserRoleRestricted(UserRoles.Admins)) notFound();

  const supabase = getSupabaseRouteHandlerSecretClient();

  const { data, error } = await supabase.client
    .from("families")
    .select(
      "id, status, family_name, ...addresses(address_line1, address_line2, city, state, pincode, country)"
    )
    .order("family_name", { ascending: true });

  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  return (
    <div className="space-y-8">
      <DocTable
        heading="Address List"
        docList={data}
        route="/families/"
        rowLink={(doc) => `/family/${doc.id}`}
        searchParams={searchParams}
        mobileColumn={{
          displayName: "Family",
          format: (doc) => (
            <div>
              <p className="font-bold text-tfm-primary">{doc.family_name}</p>
              <p>{doc.status}</p>
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
            name: "address_line1",
            displayName: "Address",
          },
          {
            name: "address_line2",
            displayName: "Apt/Suite",
          },
          {
            name: "city",
            displayName: "City",
          },
          {
            name: "state",
            displayName: "State",
          },
          {
            name: "pincode",
            displayName: "Pincode",
          },
        ]}
      />
      <LinkButton
        href="/admin/addresses/download"
        primary
        newTab
        Icon={ArrowDownTrayIcon}
      >
        Download as CSV
      </LinkButton>
    </div>
  );
}
