import Link from "next/link";
import DocTable from "@/app/components/doc-table";
import Badge from "@/components/ui/badge";
import { prettyDate } from "lib/date";
import { buildQuery } from "lib/supabase/supabase";
import {
  getSupabaseServerComponentClient,
  isUserRoleRestricted,
} from "lib/supabase/supbase.server";
import { UserRoles } from "lib/models/enums";
import { notFound } from "next/navigation";
import { LinkButton } from "@/components/ui/buttons";
import { UserGroupIcon } from "@heroicons/react/20/solid";

export default async function PartnerListPage({ searchParams = {} }) {
  if (await isUserRoleRestricted(UserRoles.CoachesAndAdmins)) return notFound();

  const supabase = getSupabaseServerComponentClient();

  let query = supabase.client
    .from("partners")
    .select(
      `id, company_legal_name, status, anniversary, address:billing_address_id(*)`
    );

  query = buildQuery(query, searchParams);

  const { data: partners, error } = await query;

  if (error)
    return error.message || "Something went wrong, please try again later.";

  return (
    <DocTable
      heading="Partner List"
      subheading={`Showing ${partners.length} partners`}
      docList={partners}
      route="/partner/list"
      rowLink={(doc) => `/partner/${doc.id}`}
      searchParams={searchParams}
      mobileColumn={{
        displayName: "Partner",
        format: (doc) => (
          <div>
            <p className="font-bold text-tfm-primary">{doc.family_name}</p>
            <p>{doc.status}</p>
            <Link href={`/partner/${doc.id}`}>Details</Link>
          </div>
        ),
      }}
      columns={[
        {
          name: "company_legal_name",
          displayName: "Legal Name",
          filterConfig: {
            key: "company_legal_name",
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
                href={`/partner/${row.id}`}
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
                    : value === "Prospect"
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
          name: "families",
          displayName: "Families",
          format: async (value, column, row) => {
            "use server";
            return (
              <LinkButton
                extraSmall
                href={`/family/list?partner_id.eq=${row.id}`}
                Icon={UserGroupIcon}
              >
                Families
              </LinkButton>
            );
          },
        },
        {
          name: "anniversary",
          displayName: "Anniversary",
          filterConfig: {
            key: "anniversary",
          },
          format: async (value) => {
            "use server";
            return prettyDate(value);
          },
        },
        {
          name: "address",
          displayName: "Location",
          format: async (value) => {
            "use server";
            return value ? (
              <p className="text-xs text-gray-600">
                {value.city}, {value.state} {value.zip}
              </p>
            ) : null;
          },
        },
      ]}
    />
  );
}
