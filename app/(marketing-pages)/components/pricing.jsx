import { LinkButton } from "@/components/ui/buttons";
import { CheckIcon } from "@heroicons/react/20/solid";

import { classNames } from "lib/utils";
import Link from "next/link";

const includedFeatures = [
  "8 private, virtual, 90-minute sessions",
  "Dedicated family coach",
  "Access to the TFM platform",
];

export default function Pricing({
  description = null,
  link = { href: "/join", label: "Get Started" },
  price = 2495,
  percent_off = 0,
  amount_off = 0,
}) {
  const discountedPrice = percent_off
    ? price - (price * percent_off) / 100
    : price - amount_off / 100;

  const isDiscounted = discountedPrice !== price;

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-2xl sm:text-center">
        <h2 className="font-brand text-5xl font-semibold italic text-tfm-primary sm:text-4xl">
          Ready to Build Better Family Relationships?
        </h2>
        {/* <p className="mt-6 text-lg leading-8 text-gray-600">
            Distinctio et nulla eum soluta et neque labore quibusdam. Saepe et
            quasi iusto modi velit ut non voluptas in. Explicabo id ut laborum.
          </p> */}
      </div>
      <div className="mx-auto my-16 max-w-2xl items-center rounded bg-white sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
        <div className="p-8 sm:p-10 lg:flex-auto">
          <h3 className="font-brand text-4xl text-tfm-primary">
            First year membership
          </h3>
          <p className="mt-6 text-base leading-7 text-gray-600">
            {description}
          </p>
          <div className="mt-10 flex items-center gap-x-4">
            <h4 className="font-accent uppercase tracking-wider text-tfm-secondary">
              {"What's included"}
            </h4>
            <div className="h-px flex-auto bg-gray-100" />
          </div>
          <ul
            role="list"
            className="mt-8 grid grid-cols-1 gap-4 font-subheading font-semibold uppercase leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
          >
            {includedFeatures.map((feature, idx) => (
              <li key={idx} className="flex gap-x-3">
                <CheckIcon
                  className="h-6 w-5 flex-none text-tfm-primary"
                  aria-hidden="true"
                />
                {feature}
              </li>
            ))}
            <li className="flex gap-x-3">
              <CheckIcon
                className="h-6 w-5 flex-none text-tfm-primary"
                aria-hidden="true"
              />
              <Link href="/promise" className="hover:text-tfm-secondary">
                100% satisfaction guarantee
              </Link>
            </li>
          </ul>
        </div>
        <div className="-mt-2 p-4 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
          <div className="rounded bg-gray-50 py-10 text-center lg:flex lg:flex-col lg:justify-center lg:py-16">
            <div className="mx-auto max-w-xs px-8">
              <p className="text-base font-semibold text-gray-600">
                Total Annual Cost
              </p>
              <p className="my-6 flex items-baseline justify-center gap-x-2">
                <span
                  className={classNames(
                    "tracking-tight",
                    isDiscounted
                      ? "text-3xl text-gray-500 line-through"
                      : "text-5xl font-bold text-gray-900 "
                  )}
                >
                  ${price.toLocaleString()}
                </span>
              </p>
              {isDiscounted && (
                <p className="my-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    ${discountedPrice.toLocaleString()}
                  </span>
                  {/* <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                      USD
                    </span> */}
                </p>
              )}

              <LinkButton href={link.href} primary>
                Get Started &rarr;
              </LinkButton>
              <p className="mt-6 text-xs leading-5 text-gray-600">
                Reduced rates for adult children or additional family members
                available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
