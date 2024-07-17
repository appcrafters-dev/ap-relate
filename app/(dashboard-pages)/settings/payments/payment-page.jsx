import Badge from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/buttons";
import {
  ArrowsRightLeftIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/20/solid";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { prettyDate } from "lib/date";
import { moneyFormat } from "lib/utils";

export default function CoachPaymentsPage({ connectedAccount, accountLink }) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row">
      <div className="rounded bg-white p-6 shadow xl:w-2/3">
        <h1 className="inline-flex items-center space-x-4 font-brand text-4xl">
          Recent Activity
        </h1>
        <ul className="mt-4 space-y-4 divide-y">
          {connectedAccount.recent_activity.length ? (
            connectedAccount.recent_activity
              .sort(
                // created, descending
                (a, b) => b.created - a.created
              )
              .map((transfer) => (
                <li
                  key={transfer.id}
                  className="inline-flex w-full items-center space-x-4 pt-4"
                >
                  <Badge>
                    {transfer.object === "payout" ? (
                      <BuildingLibraryIcon className="h-4 w-4" />
                    ) : (
                      <ArrowsRightLeftIcon className="h-4 w-4" />
                    )}
                  </Badge>
                  <div className="w-full">
                    <h2 className="space-x-2 text-base font-medium">
                      <span>
                        {transfer.object === "payout" ? "Payout" : "Transfer"}{" "}
                        of {moneyFormat(transfer.amount / 100)}
                      </span>
                      <span className="font-subheading text-xs font-semibold uppercase text-gray-500">
                        on {prettyDate(new Date(transfer.created * 1000))}
                      </span>
                    </h2>
                    {transfer.description && (
                      <p className="text-sm font-medium leading-6 text-gray-600">
                        {transfer.description}
                      </p>
                    )}
                  </div>
                </li>
              ))
          ) : (
            <li>
              <p className="font-subheading text-sm font-semibold uppercase tracking-wide text-gray-500">
                No activity yet
              </p>
            </li>
          )}
        </ul>
      </div>

      <div className="max-w-md rounded bg-white p-6 shadow xl:w-1/3">
        <h1 className="mb-4 font-brand text-4xl">My Account</h1>
        <h2 className="font-subheading text-sm font-semibold uppercase tracking-wide">
          Current Balance
        </h2>
        <p className="text-lg text-gray-600">
          {moneyFormat(
            connectedAccount.balance.available[0].amount > 0
              ? connectedAccount.balance.available[0].amount / 100
              : 0
          )}
        </p>
        <div className="my-4 pt-4">
          <h2 className="mb-1 font-subheading text-sm font-semibold uppercase tracking-wide">
            Payout Method
          </h2>
          <p className="inline-flex items-center space-x-2 capitalize text-gray-600">
            <BuildingLibraryIcon className="h-5 w-5" />
            <code>
              {connectedAccount.account?.external_accounts?.data[0]?.bank_name}{" "}
              - {connectedAccount.account?.external_accounts?.data[0]?.last4}
            </code>
          </p>
        </div>
        <p className="mb-4 text-sm text-gray-600">
          Need to make changes? Use the payouts portal to update your bank
          account, tax information, or export a detailed view of all your
          transactions.
        </p>
        <LinkButton
          href={accountLink.url}
          Icon={ArrowTopRightOnSquareIcon}
          primary
          newTab
        >
          Open Payouts Portal
        </LinkButton>
      </div>
    </div>
  );
}
