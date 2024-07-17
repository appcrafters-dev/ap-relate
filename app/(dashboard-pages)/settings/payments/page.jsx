import {
  getCurrentUser,
  getSupabaseServerComponentClient,
  isUserRoleRestricted,
} from "lib/supabase/supbase.server";
import { UserRoles } from "lib/models/enums";
import { notFound } from "next/navigation";
import {
  createConnectedAccount,
  getConnectAccountLink,
  getConnectedAccountDetails,
} from "lib/stripe";
import { LinkButton } from "@/components/ui/buttons";
import CoachPaymentsPage from "./payment-page";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { ErrorBox } from "@/components/ui/errors";

export const dynamic = "force-dynamic";

export default async function PaymentPage() {
  if (await isUserRoleRestricted(UserRoles.CoachesAndAdmins)) return notFound();

  const user = await getCurrentUser();

  if (!user.profile.stripe_connected_account_id) {
    const supabase = getSupabaseServerComponentClient();
    const account = await createConnectedAccount(user);
    const { error } = await supabase.client
      .from("coaches")
      .update({
        stripe_connected_account_id: account.id,
      })
      .eq("id", user.profile.id);

    if (error)
      return <ErrorBox msg={error.message ?? "Failed to create account"} />;

    const accountLink = await getConnectAccountLink(account.id);

    return (
      <div>
        <LinkButton Icon={ArrowTopRightOnSquareIcon} href={accountLink.url}>
          Setup Coach Payments
        </LinkButton>
      </div>
    );
  }

  const connectedAccount = await getConnectedAccountDetails(
    user.profile.stripe_connected_account_id ?? ""
  );

  console.log(connectedAccount);

  const shouldOnboard =
    connectedAccount && connectedAccount.account.payouts_enabled === false;

  const accountLink = await getConnectAccountLink(
    user.profile.stripe_connected_account_id ?? "",
    shouldOnboard
  );

  return (
    <CoachPaymentsPage
      connectedAccount={connectedAccount}
      accountLink={accountLink}
    />
  );
}
