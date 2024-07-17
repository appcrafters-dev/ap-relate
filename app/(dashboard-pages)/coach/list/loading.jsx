import DocTableLoading from "@/app/components/doc-table-loading";

export default function Loading() {
  return (
    <DocTableLoading
      heading="Coach List"
      subheading={`Showing 0 coaches`}
      columns={[
        {
          name: "coach",
          displayName: "Coach",
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
