import DocTable from "@/app/components/doc-table";
import Badge from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/buttons";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { UserRoles } from "lib/models/enums";
import { getSupabaseRouteHandlerSecretClient } from "lib/supabase/supabase.edge";
import { isUserRoleRestricted } from "lib/supabase/supbase.server";
import { notFound } from "next/navigation";

export default async function PurposeStatementPage({ searchParams }) {
  if (await isUserRoleRestricted(UserRoles.Admins)) notFound();

  const supabase = getSupabaseRouteHandlerSecretClient();

  const { data, error } = await supabase.client
    .from("families")
    .select("id, status, family_name, family_mantra")
    .order("family_name", { ascending: true });

  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  return (
    <div className="space-y-8">
      <DocTable
        heading="Purpose Statements"
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
            name: "family_mantra",
            displayName: "Purpose Statement",
          },
        ]}
      />
      <LinkButton
        href="/admin/purpose-statements/download"
        primary
        newTab
        Icon={ArrowDownTrayIcon}
      >
        Download as CSV
      </LinkButton>
    </div>
  );
}
