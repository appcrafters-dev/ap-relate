"use client";

import { classNames } from "lib/utils";
import {
  BanknotesIcon,
  BuildingLibraryIcon,
  CalendarIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRoles } from "lib/models/enums";

export default function SettingsLayout({ children, user }) {
  const pathname = usePathname();

  const nav = [
    {
      name: "My Profile",
      href: "/settings/profile",
      icon: UserCircleIcon,
    },
    {
      name: "Billing",
      href: "/settings/billing",
      icon: CreditCardIcon,
    },
  ];

  const hasFamilyMembersRole = UserRoles.FamilyMembers.includes(
    user.profile.role
  );

  const hasParnerAdminRole = UserRoles.PartnerAdmin === user.profile.role;

  const hasCoachesAndAdminsRole = user.profiles.some((p) =>
    UserRoles.CoachesAndAdmins.includes(p.role)
  );

  const hasAdminRole = UserRoles.Admin === user.profile.role;

  if (hasFamilyMembersRole) {
    nav.splice(1, 0, {
      name: "Family Details",
      href: "/settings/family",
      icon: UsersIcon,
    });
  }

  if (hasParnerAdminRole) {
    nav.splice(
      1,
      0,
      {
        name: "Partner Details",
        href: "/settings/partner",
        icon: BuildingLibraryIcon,
      },
      {
        name: "Users",
        href: "/settings/users",
        icon: UsersIcon,
      }
    );
  }

  if (hasCoachesAndAdminsRole) {
    nav.pop();
    nav.push({
      name: "Calendar",
      href: "/settings/calendar",
      icon: CalendarIcon,
    });
    nav.push({
      name: "Payments",
      href: "/settings/payments",
      icon: CurrencyDollarIcon,
    });
  }

  if (hasAdminRole) {
    nav.push({
      name: "Run Payments",
      href: "/settings/payments/admin",
      icon: BanknotesIcon,
    });
  }

  return (
    <>
      <h1 className="mb-2 font-brand text-4xl text-gray-900">Settings</h1>
      <div className="border-b border-gray-200">
        <nav
          className="-mb-px flex flex-wrap justify-center space-x-4 md:justify-start md:space-x-8"
          aria-label="Settings Navigation"
        >
          {nav.map((tab) => (
            <Link
              href={tab.href}
              key={tab.name}
              className={classNames(
                pathname === tab.href
                  ? "border-tfm-secondary text-gray-900"
                  : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700",
                "inline-flex items-center justify-center whitespace-nowrap border-b-2 p-2 font-subheading text-sm font-semibold transition-colors duration-300 ease-in-out focus:outline-none md:px-1 md:py-4"
              )}
            >
              {tab.icon && (
                <tab.icon className="mr-2 h-4 w-4" aria-hidden={true} />
              )}
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-6">{children}</div>
    </>
  );
}
