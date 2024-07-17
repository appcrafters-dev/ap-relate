"use client";

import { classNames } from "lib/utils";
import { BuildingLibraryIcon, UsersIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PartnerLayout({ children, partnerId }) {
  const pathname = usePathname();

  const nav = [
    {
      name: "Partner Profile",
      href: `/partner/${partnerId}`,
      icon: BuildingLibraryIcon,
    },
    {
      name: "Users",
      href: `/partner/${partnerId}/users`,
      icon: UsersIcon,
    },
  ];

  return (
    <>
      <h1 className="sr-only">Partner Settings</h1>
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
