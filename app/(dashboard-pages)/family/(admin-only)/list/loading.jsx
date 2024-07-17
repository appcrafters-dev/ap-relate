import DocTableLoading from "@/app/components/doc-table-loading";

export default function Loading() {
  return (
    <DocTableLoading
      heading="Family List"
      subheading={`Loading families...`}
      columns={[
        {
          name: "family_name",
          displayName: "Family Name",
          filterConfig: {
            key: "family_name",

            unTyped: true,
          },
        },
        {
          name: "status",
          displayName: "Status",
          filterConfig: {
            key: "status",
          },
        },
        {
          name: "coach",
          displayName: "Coach",

          filterConfig: {
            key: "assigned_coach_id",
          },
        },
        {
          name: "partner",
          displayName: "Partner",

          filterConfig: {
            key: "partner_id",
          },
        },
        {
          name: "heads_of_household",
          displayName: "Family Members",
        },
      ]}
    />
  );
}
