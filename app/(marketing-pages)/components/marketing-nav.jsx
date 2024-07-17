"use client";

import Logo from "@/components/logo";
import { LinkButton } from "@/components/ui/buttons";
import Link from "next/link";
import { BorderlessButton } from "@/components/ui/buttons";
import { Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Fragment, Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";
import { classNames } from "lib/utils";
import { UserPlusIcon } from "@heroicons/react/20/solid";
import { ArrowLeftOnRectangleIcon, HomeIcon } from "@heroicons/react/24/solid";
// import { GuideNavigation } from "../(guide-pages)/components/navigation";

function CloseOnNavigation({ close, pathname }) {
  useEffect(() => {
    !pathname.startsWith("/guide") && close();
  }, [pathname, close]);

  return null;
}

export default function MarketingNav({
  user = null,
  // categories = [],
  // articles = [],
}) {
  const pathname = usePathname();
  const navItems = [
    { label: "About TFM", href: "/about" },
    { label: "Journal", href: "/journal" },
    // {
    //   label: "Guide",
    //   href: "/guide",
    //   flyoutMenu: () => (
    //     <GuideNavigation {...{ articles, categories, hideSearch: true }} />
    //   ),
    // },
    { label: "FAQ", href: "/frequently-asked-questions" },
    { label: "Contact", href: "/contact-us" },
  ];
  const NavItem = ({ item, showFlyouts = false }) => {
    if (item.flyoutMenu && showFlyouts) {
      return (
        <Menu>
          {/* TODO: handle open/close navigation */}
          {({ open }) => (
            <>
              <Menu.Button
                className={classNames(
                  "inline-flex items-center space-x-2 font-subheading uppercase text-tfm-primary transition-colors hover:text-tfm-primary-900",
                  pathname.startsWith(item.href) ? "font-bold" : "font-semibold"
                )}
              >
                {item.label}
                <ChevronDownIcon
                  className={classNames(
                    "ml-1.5 h-4 w-4",
                    "transform text-tfm-primary transition-transform",
                    open
                      ? "rotate-180 text-tfm-primary-500"
                      : "group-hover:rotate-180 group-hover:text-tfm-primary-900"
                  )}
                />
              </Menu.Button>
              <Menu.Items className="mx-auto w-full max-w-sm border-y py-4">
                {item.flyoutMenu()}
              </Menu.Items>
            </>
          )}
        </Menu>
      );
    } else {
      return (
        <Link
          className={classNames(
            "font-subheading uppercase text-tfm-primary transition-colors hover:text-tfm-primary-900",
            pathname.startsWith(item.href) ? "font-bold" : "font-semibold"
          )}
          href={item.href}
        >
          {item.label}
        </Link>
      );
    }
  };

  const AuthButtons = ({ user }) => (
    <>
      {!user && (
        <LinkButton href="/login" Icon={ArrowLeftOnRectangleIcon}>
          Sign in
        </LinkButton>
      )}
      <LinkButton
        href={user ? "/dashboard" : "/join"}
        Icon={user ? HomeIcon : UserPlusIcon}
        primary
      >
        {user ? "Dashboard" : "Get Started"}
      </LinkButton>
    </>
  );
  return (
    <header className="fixed inset-x-0 top-2 z-10 mx-auto flex w-full max-w-5xl flex-none flex-wrap items-center justify-between">
      <nav className="mx-2 flex w-full flex-wrap items-center justify-between gap-2 rounded bg-white bg-opacity-80 p-2 shadow backdrop-blur">
        <Logo width={35} height={35} href="/" />
        <div className="my-2 hidden items-center space-x-8 lg:flex">
          {navItems.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </div>
        <div className="mr-1 hidden items-center gap-2 lg:flex">
          <AuthButtons user={user} />
        </div>
        <Menu>
          {({ open, close }) => (
            <>
              <div className="flex items-center gap-2 lg:hidden">
                <Menu.Button
                  as={BorderlessButton}
                  aria-label="Open menu"
                  srOnly="Open menu"
                  Icon={open ? XMarkIcon : Bars3Icon}
                />
              </div>
              <Suspense fallback={null}>
                <CloseOnNavigation close={close} pathname={pathname} />
              </Suspense>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0"
                enterTo="transform opacity-100"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100"
                leaveTo="transform opacity-0"
              >
                <Menu.Items
                  as="nav"
                  className="flex max-h-[calc(100vh-6rem)] w-full flex-col items-center justify-center gap-2 space-y-4 overflow-y-auto p-2 lg:hidden"
                >
                  {navItems.map((item) => (
                    <Menu.Item
                      key={item.label}
                      as={NavItem}
                      item={item}
                      showFlyouts
                    />
                  ))}
                  <div className="mx-auto flex w-full max-w-sm flex-wrap justify-center gap-2 pt-4">
                    <Menu.Item as={AuthButtons} user={user} />
                  </div>
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      </nav>
    </header>
  );
}
