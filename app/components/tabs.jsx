"use client";

import { Fragment } from "react";
import { Tab } from "@headlessui/react";
import { classNames } from "lib/utils";

export default function TfmTabs({ tabs }) {
  return (
    <Tab.Group>
      <div className="border-b border-gray-200">
        <Tab.List className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <Tab as={Fragment} key={tab.name}>
              {({ selected }) => (
                <button
                  className={classNames(
                    selected
                      ? "border-tfm-secondary text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700",
                    "inline-flex items-center justify-center whitespace-nowrap border-b-2 p-2 font-subheading text-sm font-semibold transition-colors duration-300 ease-in-out focus:outline-none sm:text-base md:px-1 md:py-4"
                  )}
                  aria-current={selected ? "page" : undefined}
                >
                  {tab.icon && (
                    <tab.icon className="mr-2 h-4 w-4" aria-hidden={true} />
                  )}
                  {tab.name}
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>
      </div>
      <Tab.Panels className="py-6">
        {tabs.map((tab) => (
          <Tab.Panel key={tab.name}>{tab.content}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
