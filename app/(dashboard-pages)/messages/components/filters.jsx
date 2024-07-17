"use client";

import { Fragment, useState } from "react";
import {
  Dialog,
  Disclosure,
  Menu,
  Popover,
  Transition,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { classNames, isAdminRole } from "lib/utils";
import Link from "next/link";

const sortOptions = [
  { name: "Latest Update", value: "desc" },
  { name: "Oldest", value: "asc" },
];

function IndicatorBubble(show = false) {
  return show ? (
    <span className="mr-1.5 rounded-full bg-tfm-secondary p-1 text-xs"> </span>
  ) : null;
}

export default function ConversationFilters({
  user,
  searchParams,
  conversations,
  agents,
}) {
  function getAgentName(id) {
    const agent = agents.find((agent) => agent.user_profile_id === id);
    return agent ? agent.first_name : agent.email;
  }

  const filters = [
    {
      id: "assigned_to",
      name: "Assigned to",
      options: [
        { value: user.id, label: "Assigned to me" },
        { value: "none", label: "Not assigned" },
        ...conversations.reduce((acc, conversation) => {
          if (!conversation.assigned_to_user_profile_id) {
            return acc;
          }
          if (conversation.assigned_to_user_profile_id === user.id) {
            return acc;
          }
          const agent = acc.find(
            (item) => item.value === conversation.assigned_to_user_profile_id
          );
          if (agent) return acc;
          acc.push({
            value: conversation.assigned_to_user_profile_id,
            label: getAgentName(conversation.assigned_to_user_profile_id),
          });
          return acc;
        }, []),
      ],
    },
    {
      id: "status",
      name: "Status",
      options: [
        { value: "open", label: "Open" },
        { value: "archived", label: "Archived" },
      ],
    },
  ];

  const isAdmin = isAdminRole(user.app_metadata.role);

  if (!isAdmin) {
    // remove assigned_to filter
    filters.shift();
  }

  const [open, setOpen] = useState(false);
  const showClearFilters = Object.keys(searchParams).length > 0;

  function getNewUrl(key, value) {
    const params = new URLSearchParams(searchParams);
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    return "/messages?" + params.toString();
  }

  return (
    <div>
      {/* Mobile filter dialog */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 sm:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded bg-white p-2 text-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-tfm-primary"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Filters */}

                {filters.map((section) => (
                  <Disclosure
                    as="div"
                    key={section.name}
                    className="border-t border-gray-200 px-4 py-6"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-mx-2 -my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400">
                            <div className="inline-flex items-center">
                              {IndicatorBubble(searchParams[section.id])}
                              <span className="font-medium text-gray-900">
                                {section.name}
                              </span>
                            </div>
                            <span className="ml-6 flex items-center">
                              <ChevronDownIcon
                                className={classNames(
                                  open ? "-rotate-180" : "rotate-0",
                                  "h-5 w-5 transform"
                                )}
                                aria-hidden="true"
                              />
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="grid space-y-6">
                            {section.options.map((option) => (
                              <Link
                                key={option.value}
                                href={getNewUrl(section.id, option.value)}
                                className="ml-4 inline-flex items-center whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                              >
                                {searchParams[section.id] === option.value && (
                                  <CheckIcon
                                    className="absolute -ml-5 h-4 w-4 text-tfm-secondary"
                                    aria-hidden="true"
                                  />
                                )}
                                {option.label}
                              </Link>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
                {showClearFilters && (
                  <div className="block border-t pl-4 pt-4">
                    <Link
                      href="/messages"
                      className="text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      Clear filters
                    </Link>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="text-center">
        <div className="py-12">
          <h1 className="font-brand text-5xl font-semibold italic tracking-tight text-gray-900">
            Messages
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base text-gray-500">
            Secure conversations with your TFM team
          </p>
        </div>

        <section
          aria-labelledby="filter-heading"
          className="border-t border-gray-200 pt-4"
        >
          <h2 id="filter-heading" className="sr-only">
            Message filters
          </h2>

          <div className="flex items-center justify-between">
            <button
              type="button"
              className="inline-flex items-center font-subheading text-sm font-semibold uppercase text-gray-700 hover:text-gray-900 sm:hidden"
              onClick={() => setOpen(true)}
            >
              {IndicatorBubble(showClearFilters)}
              Filters
            </button>

            <Popover.Group className="hidden sm:flex sm:items-baseline sm:space-x-8">
              {filters.map((section, sectionIdx) => (
                <Popover
                  as="div"
                  key={section.name}
                  id={`desktop-menu-${sectionIdx}`}
                  className="relative inline-block text-left"
                >
                  <div>
                    <Popover.Button className="group inline-flex items-center justify-center font-subheading text-sm font-semibold uppercase text-gray-700 hover:text-gray-900">
                      {IndicatorBubble(searchParams[section.id])}
                      <span>{section.name}</span>
                      <ChevronDownIcon
                        className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                    </Popover.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Popover.Panel className="absolute left-0 z-10 mt-2 grid origin-top-right space-y-4 rounded bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {section.options.map((option) => (
                        <Link
                          key={option.value}
                          className="ml-4 inline-flex items-center whitespace-nowrap pr-6 font-subheading text-sm font-semibold uppercase text-gray-900"
                          href={getNewUrl(section.id, option.value)}
                        >
                          {searchParams[section.id] === option.value && (
                            <CheckIcon
                              className="absolute -ml-5 h-4 w-4 text-tfm-secondary"
                              aria-hidden="true"
                            />
                          )}
                          {option.label}
                        </Link>
                      ))}
                    </Popover.Panel>
                  </Transition>
                </Popover>
              ))}
              {showClearFilters && (
                <div className="hidden sm:block">
                  <Link
                    href="/messages"
                    className="font-subheading text-sm font-semibold uppercase text-gray-700 hover:text-gray-900"
                  >
                    Clear filters
                  </Link>
                </div>
              )}
            </Popover.Group>

            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="group inline-flex justify-center font-subheading text-sm font-semibold uppercase text-gray-700 hover:text-gray-900">
                  Sort by
                  <ChevronDownIcon
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-left rounded bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <Menu.Item key={option.value}>
                        <Link
                          href={getNewUrl("sort", option.value)}
                          className="inline-flex w-full items-center px-4 py-2 pl-8 font-subheading text-sm font-semibold uppercase text-gray-900"
                        >
                          {(searchParams.sort === option.value ||
                            (!searchParams.sort &&
                              option.value === "desc")) && (
                            <CheckIcon
                              className="absolute -ml-5 h-4 w-4 text-tfm-secondary"
                              aria-hidden="true"
                            />
                          )}
                          {option.name}
                        </Link>
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </section>
      </div>
    </div>
  );
}
