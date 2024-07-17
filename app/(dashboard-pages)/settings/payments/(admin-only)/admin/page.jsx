import { UserRoles } from "lib/models/enums";
import { getBalance } from "lib/stripe";
import {
  getSupabaseServerComponentClient,
  isUserRoleRestricted,
} from "lib/supabase/supbase.server";
import { notFound } from "next/navigation";
import PaymentsAdminPage from "./payments-admin-page";

export default async function PaymentsAdmin() {
  if (await isUserRoleRestricted(UserRoles.Admin)) notFound();

  const balance = await getBalance();
  const supabase = getSupabaseServerComponentClient();

  const { data: coaches, error: coachesError } = await supabase.client
    .from("coaches")
    .select(
      `
    *,
    ...user_roles(role, ...user_profiles(first_name, last_name, email, phone, avatar_url)),
    coach_payments(*)
    `
    )
    .eq("coach_payments.paid", false);

  if (coachesError) return <pre>{JSON.stringify(coachesError, null, 2)}</pre>;

  const filteredCoaches = coaches.filter(
    (coach) => coach.coach_payments.length > 0
  );

  const { data: allCoaches, error: allCoachesError } = await supabase.client
    .from("coaches")
    .select(
      `
    *,
    ...user_roles(role, ...user_profiles(first_name, last_name, email, phone, avatar_url))
    `
    )
    .eq("enable_payouts", true);

  if (allCoachesError)
    return <pre>{JSON.stringify(allCoachesError, null, 2)}</pre>;

  return (
    <PaymentsAdminPage
      coaches={filteredCoaches}
      allCoaches={allCoaches}
      balance={balance}
    />
  );
}
