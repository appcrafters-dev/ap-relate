import PartnerLayout from "./partner-layout";

export default async function Layout({ children, params }) {
  return <PartnerLayout partnerId={params.id}>{children}</PartnerLayout>;
}
