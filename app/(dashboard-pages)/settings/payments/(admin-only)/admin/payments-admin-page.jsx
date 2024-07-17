import { UserAvatar } from "@/app/components/avatar";
import Badge from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/buttons";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { prettyDate } from "lib/date";
import { moneyFormat } from "lib/utils";
import AddManualTransaction from "./add-manual-transaction";
import RunPayments from "./run-payments";
import { ErrorBox } from "@/components/ui/errors";

export default function PaymentsAdminPage({ coaches, allCoaches, balance }) {
  const stripeBalance = balance.available[0].amount / 100;
  const totalPaymentsDue = coaches
    .filter(
      (coach) => coach.stripe_connected_account_id && coach.enable_payouts
    )
    .reduce(
      (acc, coach) =>
        acc +
        coach.coach_payments.reduce((acc, payment) => acc + payment.amount, 0),
      0
    );

  return (
    <div className="space-y-8">
      <h1 className="sr-only">Payments Admin</h1>

      <h2 className="font-brand text-3xl">Payments Due</h2>
      <ul className="space-y-6">
        {coaches.map((coach) => (
          <li
            key={coach.id}
            className="rounded bg-white p-4 shadow"
            id={coach.id}
          >
            <div className="flex w-full justify-between space-x-8">
              <div className="flex flex-col justify-between space-y-4">
                {/* <h2 className="font-subheading text-lg font-bold">
                  {coach.role}
                </h2> */}
                <div className="flex items-center space-x-2">
                  <UserAvatar profile={coach} />
                  <div>
                    <h2
                      className="mb-1 inline-flex items-center space-x-2 text-lg font-bold"
                      coach-id={coach.id}
                      title={coach.id}
                    >
                      <span>
                        {coach.first_name} {coach.last_name}
                      </span>
                      <Badge>{coach.role}</Badge>
                    </h2>
                    <p className="text-sm font-bold">
                      <span className="mr-2 font-subheading text-xs font-semibold uppercase">
                        Session Rate
                      </span>
                      {moneyFormat(coach.payout_rate)}
                    </p>
                  </div>
                </div>
                {!coach.stripe_connected_account_id && (
                  <ErrorBox
                    msg={
                      coach.first_name +
                      " must complete onboarding before payments can be run."
                    }
                  />
                )}
                {!coach.enable_payouts && (
                  <ErrorBox
                    msg={
                      "Payouts currently disabled for " + coach.first_name + "."
                    }
                  />
                )}
              </div>
              <div className="max-w-md flex-auto">
                <h2 className="mb-4 inline-flex w-full items-center justify-between pl-2 text-lg font-bold">
                  Unpaid Transactions
                  <AddManualTransaction
                    coaches={allCoaches}
                    preselectedCoach={coach}
                  />
                </h2>
                <table className="w-full space-y-2 p-2">
                  <thead>
                    <tr>
                      <th className="px-2 text-left font-subheading text-xs font-semibold uppercase">
                        Date
                      </th>
                      <th className="px-2 text-right font-subheading text-xs font-semibold uppercase">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {coach.coach_payments.map((payment) => (
                      <tr key={payment.id} title={payment.id}>
                        <td className="p-2">
                          <b>{prettyDate(payment.created_at)}</b>
                          <p
                            className="max-w-xs text-xs text-gray-500"
                            payment-id={payment.id}
                          >
                            {payment.description}
                          </p>
                        </td>
                        <td className="p-2 text-right">
                          {moneyFormat(payment.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="mt-2 border-t border-gray-200">
                    <tr>
                      <td colSpan={2} className="p-2 text-right font-bold">
                        <span className="mr-2 font-subheading text-xs font-semibold uppercase">
                          Total Due to {coach.first_name}
                        </span>
                        {moneyFormat(
                          coach.coach_payments.reduce(
                            (acc, payment) => acc + payment.amount,
                            0
                          )
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex w-full justify-between space-x-8">
        <dl>
          <dt className="font-subheading text-sm font-semibold uppercase tracking-wide">
            Stripe Balance
          </dt>
          <dd className="inline-flex items-center space-x-2 text-2xl font-bold">
            <span>{moneyFormat(stripeBalance)}</span>
          </dd>
          <div className="mt-2">
            <LinkButton
              href="https://dashboard.stripe.com/topups"
              Icon={ArrowTopRightOnSquareIcon}
              small
              newTab
            >
              Top-up
            </LinkButton>
          </div>
        </dl>
        <dl>
          <dt className="w-full text-right font-subheading text-sm font-semibold uppercase tracking-wide">
            Total Payments Due
          </dt>
          <dd className="w-full text-right text-2xl font-bold">
            {moneyFormat(totalPaymentsDue)}
          </dd>
          <div className="mt-2">
            <RunPayments {...{ totalPaymentsDue, stripeBalance }} />
          </div>
        </dl>
      </div>
    </div>
  );
}
