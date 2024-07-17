"use client";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import Badge from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/buttons";
import { prettyDate } from "lib/date";
import { moneyFormat } from "lib/utils";
import Link from "next/link";

export default function Billing({
  family,
  subscriptions,
  portal_url,
  isPartner,
}) {
  return subscriptions && subscriptions.length ? (
    <div className="grid grid-cols-1 gap-4">
      {subscriptions.map((subscription) => (
        <SubscriptionPreview
          key={subscription.id}
          subscription={subscription}
          portal_url={portal_url}
        />
      ))}
    </div>
  ) : family?.id && family?.billing_method == "Partner" && !isPartner ? (
    <p>
      Your billing is managed by {family.partner.company_legal_name}. Please
      contact them if you need to make changes.
    </p>
  ) : family?.id && family?.billing_method == "Manual" ? (
    <p>
      You are set up with manual billing. Please{" "}
      <Link
        href="/contact-us"
        className="hover:text-tfm-primary-dark text-tfm-primary hover:underline"
      >
        contact us
      </Link>{" "}
      to make changes.
    </p>
  ) : (
    <p>
      {"You don't have any active memberships."} Please{" "}
      <Link
        href="/settings/billing/setup"
        className="hover:text-tfm-primary-dark font-bold text-tfm-primary hover:underline"
      >
        set up your billing
      </Link>{" "}
      to get started.
    </p>
  );
}

function SubscriptionPreview({ subscription, portal_url }) {
  const {
    status,
    current_period_end,
    items: { data },
    product: { name },
    discount,
  } = subscription;
  const originalAmount = data[0].price.unit_amount / 100;
  const quantity = data[0].quantity || 1;

  let discountedAmount;
  if (discount) {
    if (discount.coupon.percent_off) {
      const discountValue =
        (originalAmount * discount.coupon.percent_off) / 100;
      discountedAmount = originalAmount - discountValue;
    } else if (discount.coupon.amount_off) {
      const discountValue = discount.coupon.amount_off / 100;
      discountedAmount = originalAmount - discountValue;
    }
  }

  return (
    <div className="max-w-lg rounded bg-white p-6 shadow">
      <h1 className="mb-4 text-2xl font-semibold">Your plan with TFM</h1>
      <div className="mb-4">
        <h2 className="mb-2 inline-flex items-center space-x-2 text-lg font-medium">
          <span>{name}</span>
          <Badge
            color={
              status === "active"
                ? "green"
                : status === "trialing"
                ? "blue"
                : "gray"
            }
          >
            {status}
          </Badge>
        </h2>
        <p className="text-gray-600">
          Amount:{" "}
          {discountedAmount ? (
            <span>
              <span className="line-through">
                {moneyFormat(originalAmount * quantity)}
              </span>{" "}
              {moneyFormat(discountedAmount * quantity)}
            </span>
          ) : (
            moneyFormat(originalAmount * quantity)
          )}{" "}
          per {subscription.plan.interval}
        </p>
        <p className="text-gray-600">
          Next Billing Date: {prettyDate(new Date(current_period_end * 1000))}
        </p>
      </div>
      <p className="mb-4 text-sm text-gray-600">
        Need to make changes? Use the billing portal to update payment details,
        review past invoices, or manage your subscription.
      </p>
      <LinkButton href={portal_url} Icon={ArrowTopRightOnSquareIcon} primary>
        Open Billing Portal
      </LinkButton>
      {/* <pre>{JSON.stringify(subscription, null, 2)}</pre> */}
    </div>
  );
}
