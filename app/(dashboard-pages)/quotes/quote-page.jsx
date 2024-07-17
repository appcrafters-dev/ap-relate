"use client";
import { Fragment } from "react";
import { Tab } from "@headlessui/react";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";

// import AuthLayout from "app/auth/auth-layout";
import FamilyQuote from "@/components/family-quote";
import { LinkButton } from "@/components/ui/buttons";
import { classNames } from "lib/utils";

export default function Quotes({ quotes, showAddQuoteButton = false }) {
  if (!quotes.length)
    return (
      <div className="mx-auto flex min-h-96 max-w-sm flex-col items-center justify-center space-y-4 py-2">
        <div className="space-y-2 text-center">
          <ChatBubbleBottomCenterTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="font-brand text-sm font-bold text-gray-900">
            Nothing here yet
          </h3>
          <p className="text-sm italic text-gray-500">
            &quot;Even if you are on the right track, you will get run over if
            you just sit there.&quot; - Will Rogers
          </p>
          {/* <p className="mt-4 text-xs text-gray-500">
            Isn&apos;t that the truth? We can&apos;t wait to hear what you have
            to say in Sessions and will add your family quotes here soon.
          </p> */}
        </div>
        {showAddQuoteButton && (
          <LinkButton href="/quotes/new" primary>
            <LockClosedIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
            Add a Quote
          </LinkButton>
        )}
      </div>
    );

  const themes = quotes.reduce((acc, quote) => {
    const themes = quote.themes || [];
    themes.forEach(({ title: theme }) => {
      if (!acc[theme]) acc[theme] = [];
      acc[theme].push(quote);
    });
    if (!acc.All) acc.All = [];
    acc.All.push(quote);
    return acc;
  }, {});

  const tabs = Object.keys(themes)
    .map((theme) => ({
      name: theme,
      quotes: themes[theme],
    }))
    .sort((a, b) =>
      a.name === "all"
        ? -1
        : b.name === "all"
        ? 1
        : a.name.localeCompare(b.name)
    );

  return (
    <>
      <div className="inline-flex w-full items-center justify-between">
        <h1 className="py-6 font-brand text-4xl text-tfm-primary">Quotes</h1>
        {showAddQuoteButton && (
          <LinkButton href="/quotes/new" primary>
            <LockClosedIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
            Add a Quote
          </LinkButton>
        )}
      </div>
      <Tab.Group>
        <h2 className="mb-2 text-center font-accent text-base uppercase tracking-widest text-tfm-secondary">
          Themes
        </h2>
        <div className="border-b border-gray-200">
          <Tab.List
            className="-mb-px flex flex-wrap items-center justify-center"
            aria-label="Tabs"
          >
            {tabs.map((tab) => (
              <Tab as={Fragment} key={tab.name}>
                {({ selected }) => (
                  <button
                    className={classNames(
                      selected
                        ? "border-tfm-secondary text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700",
                      "whitespace-nowrap border-b-2 px-5 py-3 font-subheading text-xs font-bold uppercase transition-colors duration-300 ease-in-out focus:outline-none"
                    )}
                    aria-current={selected ? "page" : undefined}
                  >
                    {tab.name}
                  </button>
                )}
              </Tab>
            ))}
          </Tab.List>
        </div>
        <Tab.Panels className="py-12">
          {tabs.map((tab) => (
            <Tab.Panel key={tab.name}>
              <div className="flex flex-wrap gap-8 lg:gap-12">
                {tab.quotes.map((quote, idx) => (
                  <FamilyQuote
                    key={quote.id}
                    quote={quote}
                    rightAlign={idx % 2 !== 0}
                  />
                ))}
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}
