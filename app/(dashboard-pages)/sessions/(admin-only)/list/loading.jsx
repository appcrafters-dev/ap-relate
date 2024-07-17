import DocTableLoading from "@/app/components/doc-table-loading";

export default async function SessionListPage() {
  return (
    <DocTableLoading
      heading="Session List"
      subheading={`Loading sessions...`}
      columns={[
        {
          name: "session",
          displayName: "Session",
        },
        {
          name: "family",
          displayName: "Family",
          filterConfig: {
            key: "family_id",
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
            key: "coach_id",
          },
        },
        {
          name: "scheduled_time",
          displayName: "Scheduled Time",
          filterConfig: {
            key: "scheduled_time",
          },
        },
      ]}
    />
  );
}
