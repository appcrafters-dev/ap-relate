import DocTableLoading from "@/app/components/doc-table-loading";

export default async function PartnerLoadingPage() {
  return (
    <DocTableLoading
      heading="Partner List"
      subheading={`Loading partners...`}
      columns={[
        {
          name: "company_legal_name",
          displayName: "Legal Name",
          filterConfig: {
            key: "company_legal_name",

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
          name: "anniversary",
          displayName: "Anniversary",
          filterConfig: {
            key: "anniversary",
          },
        },
        {
          name: "address",
          displayName: "Location",
        },
      ]}
    />
  );
}
