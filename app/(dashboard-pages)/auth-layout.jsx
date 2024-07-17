"use client";

import { Fragment, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import {
  AcademicCapIcon,
  Bars3Icon,
  BuildingLibraryIcon,
  ChatBubbleBottomCenterTextIcon,
  CogIcon,
  DocumentMagnifyingGlassIcon,
  HeartIcon,
  HomeIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { classNames } from "lib/utils";
import { UserRoles } from "lib/models/enums";
import TfmNotificationCenter from "../components/notification-center";
import { UserAvatar } from "../components/avatar";
import { UserCircleIcon } from "@heroicons/react/20/solid";
import SliderSidebar from "./components/slider-sidebar";
import FamilySelector from "./components/family-selector";
import { ViewLogger } from "./components/view-logger";

export function LogoHeader({ text = "TFM" }) {
  return (
    <div className="inline-flex flex-shrink-0 items-center px-4">
      <img
        className="h-8 w-auto"
        src="/img/tfm-logo.png"
        alt="Total Family Management"
      />
      <span className="font-italic pl-2 pt-1 font-brand text-3xl italic text-gray-400">
        {text}
      </span>
    </div>
  );
}

export default function AuthLayout({ user, children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const includesRole = (roles = []) => {
    if (!Array.isArray(roles)) roles = [roles];
    return user.profiles.some((p) => roles.includes(p.role));
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: HomeIcon,
    },
    {
      name: "Resources",
      href: "/resources",
      icon: DocumentMagnifyingGlassIcon,
    },
    // {
    //   name: "Messages",
    //   href: "/messages",
    //   icon: InboxIcon,
    // },
    {
      name: "Settings",
      href: "/settings/profile",
      icon: CogIcon,
    },
  ];

  if (
    includesRole(UserRoles.FamilyMembers) &&
    !UserRoles.Partners.includes(user.profile.role) && // Exclude partners
    !UserRoles.CoachesAndAdmins.includes(user.profile.role) // Exclude coaches and admins
  ) {
    navigation.splice(
      1,
      0,
      {
        name: "Vision",
        href: "/vision",
        icon: HeartIcon,
      },
      {
        name: "Sessions",
        href: "/sessions",
        icon: AcademicCapIcon,
      },
      {
        name: "Quotes",
        href: "/quotes",
        icon: ChatBubbleBottomCenterTextIcon,
      },
      {
        name: "My Family",
        href: "/family",
        icon: UsersIcon,
      }
    );
  }

  if (includesRole(UserRoles.CoachesAndAdmins)) {
    navigation.splice(
      1,
      0,
      {
        name: "Families",
        href: "/family/list",
        icon: UserGroupIcon,
      },
      {
        name: "Partners",
        href: "/partner/list",
        icon: BuildingLibraryIcon,
      },
      {
        name: "Coaches",
        href: "/coach/list",
        icon: UsersIcon,
      },
      {
        name: "Sessions",
        href: "/sessions/list",
        icon: AcademicCapIcon,
      }
    );
  }

  if (includesRole(UserRoles.Partners)) {
    navigation.splice(1, 0, {
      name: "Families",
      href: "/partners/families",
      icon: UserGroupIcon,
    });
  }

  if (includesRole([UserRoles.Admin])) {
    navigation.splice(navigation.length - 1, 0, {
      name: "Guide Admin",
      href: "/admin/guide",
      icon: QuestionMarkCircleIcon,
    });
  }

  const fullWidthPaths = [
    "/sessions/",
    "/family/head-of-household",
    "/family/child",
    "/family/pet",
  ];

  const fullWidth = fullWidthPaths.some(
    (path) =>
      pathname.startsWith(path) &&
      !["/sessions/library", "/sessions/list"].includes(pathname)
  );

  function NavigationLinks() {
    return (
      <nav className="mt-5 flex-1 space-y-1 px-2">
        {navigation.map((item) => {
          // Extract the base path segment from both the item's href and the current pathname
          const basePathOfHref = item.href.split("/")[1];
          const basePathOfPathname = pathname.split("/")[1];

          // Determine if the current item should be marked as active
          const isActive = basePathOfPathname === basePathOfHref;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={classNames(
                isActive
                  ? "bg-tfm-primary text-white"
                  : "text-gray-300 hover:bg-tfm-primary hover:text-white",
                "group flex items-center rounded p-2 font-subheading text-sm font-bold transition-all duration-200 ease-in-out sm:p-3"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon
                className={classNames(
                  isActive
                    ? "text-gray-300"
                    : "text-gray-400 group-hover:text-gray-300",
                  "mr-2 h-5 w-5 flex-shrink-0"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    );
  }

  function SideBar() {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-tfm-primary-900 print:hidden">
        <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
          <LogoHeader />
          <NavigationLinks />
        </div>
        <div className="w-full bg-tfm-primary p-4">
          <FamilySelector user={user} />

          {/* <p className="mb-1.5 text-center text-xs text-gray-300">
            Need help?{" "}
            <Link href="/guide" className="font-semibold hover:underline">
              Read the Guide &rarr;
            </Link>
          </p> */}
          <p className="text-center text-[.625rem] text-gray-300">
            &copy; {new Date().getFullYear()} Total Family Management, LLC
          </p>
        </div>
      </div>
    );
  }

  function UserNav() {
    return (
      <nav className="fixed top-0 z-10 flex h-[3.25rem] w-full items-center justify-between bg-tfm-primary p-1 text-white print:hidden">
        <button
          type="button"
          className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded text-gray-200 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-300 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="lg:flex" aria-hidden="true" />
        <div className="inline-flex items-center justify-between space-x-3 divide-x divide-gray-500">
          <TfmNotificationCenter user={user} />
          <Menu as="div" className="relative pl-1.5">
            <Menu.Button className="flex items-center p-1.5 pl-2">
              <span className="sr-only">Open user menu</span>
              <UserAvatar profile={user.profile} />
              <span className="hidden lg:flex lg:items-center">
                <span
                  className="ml-4 text-sm font-semibold leading-6 text-white"
                  aria-hidden="true"
                >
                  {user.profile?.first_name || user.email}{" "}
                  {user.profile?.last_name || ""}
                </span>
                <ChevronDownIcon
                  className="ml-2 h-4 w-4 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-1 z-10 mt-2.5 w-auto rounded border bg-white py-2 shadow-lg focus:outline-none">
                <p className="mb-2 w-full border-b px-4 pb-3 pt-2 font-subheading text-xs font-semibold uppercase text-gray-900">
                  {user.email}
                </p>
                {[
                  {
                    name: "Edit Profile",
                    href: "/settings/profile",
                    icon: UserCircleIcon,
                  },
                  {
                    name: "Sign Out",
                    href: "/logout",
                    icon: ArrowRightOnRectangleIcon,
                  },
                ].map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <Link
                        href={item.href}
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "inline-flex w-full items-center px-4 py-2 text-sm font-medium leading-6 text-gray-900"
                        )}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </Link>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </nav>
    );
  }

  return (
    <>
      <SliderSidebar {...{ sidebarOpen, setSidebarOpen }}>
        <SideBar />
      </SliderSidebar>

      <aside className="z-20 hidden print:hidden print:w-0 lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <SideBar />
      </aside>

      <UserNav />

      <main className="relative top-[3.25rem] h-[calc(100vh-3.25rem)] flex-1 overflow-y-auto print:top-0 print:block print:h-full print:bg-white lg:pl-64 print:lg:pl-0">
        <div
          className={
            fullWidth
              ? "w-full py-4 pb-8"
              : "mx-auto max-w-7xl p-4 pb-8 sm:px-6 md:px-8"
          }
        >
          {children}
        </div>
      </main>

      <ViewLogger user={user} />
    </>
  );
}
