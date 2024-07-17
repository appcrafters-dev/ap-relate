import { LinkButton } from "@/components/ui/buttons";
import { CreditCardIcon } from "@heroicons/react/20/solid";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";

export default function MembershipRequired({
  heading = "Membership Required",
  message = "You need to be a member to access this page. Subscribe now to unlock the full experience.",
  link = {
    href: "/settings/billing",
    text: "Go to Billing",
    Icon: CreditCardIcon,
  },
  hideLink = false,
  children = null,
}) {
  return (
    <div className="mx-auto my-8 rounded bg-white px-4 pb-4 pt-5 text-left shadow transition-all sm:my-16 sm:max-w-sm sm:p-6">
      <div>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
          <ShieldExclamationIcon
            className="h-6 w-6 text-orange-600"
            aria-hidden="true"
          />
        </div>
        <div className="mt-3 text-center sm:mt-5">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            {heading}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{message}</p>
          </div>
        </div>
      </div>
      {children}
      <div className="mt-5 sm:mt-6">
        {!hideLink && (
          <LinkButton href={link.href} Icon={link.Icon} fullWidth primary>
            {link.text}
          </LinkButton>
        )}
      </div>
    </div>
  );
}
