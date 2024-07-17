"use client";

import Highlighter from "react-highlight-words";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useState, useEffect, forwardRef } from "react";
import { useDebounce } from "use-debounce";
import { getSupabaseClientComponentClient } from "lib/supabase/supabase.client";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import {
  MagnifyingGlassIcon,
  ChevronRightIcon,
  DocumentTextIcon,
} from "@heroicons/react/20/solid";
import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { classNames, getSnippet } from "lib/utils";
import { LinkButton } from "@/components/ui/buttons";

const defaultSearchState = {
  loading: false,
  status: "Search for articles",
  description:
    "The TFM Guide is a collection of articles to help you get the most out of our platform, life, and everything in between.",
};

export default function GuideSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = getSupabaseClientComponentClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 777);
  const [searchResults, setSearchResults] = useState([]);
  const [searchState, setSearchState] = useState(defaultSearchState);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (debouncedSearchTerm) performSearch();
    else {
      setSearchResults([]);
      setSearchState(defaultSearchState);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (open) setOpen(false);
  }, [pathname]);

  const performSearch = async () => {
    setSearchState({
      loading: true,
      status: "Searching...",
      description: "Just a moment while we find relevant articles.",
    });
    const searchTerms = searchTerm
      .split(" ")
      .map((word) => `'${word}'`)
      .join(" | ");
    const { data, error } = await supabase.client
      .from("guide_articles")
      .select(
        "id, category:category_id(id, title, slug_path), content, slug_path, title"
      )
      .textSearch("content", searchTerms, { type: "websearch" });

    if (error)
      setSearchState({
        loading: false,
        status: "Oops!",
        description:
          error.message ||
          "Sorry, it appears something went wrong with the seach engine.",
      });
    else {
      setSearchState(
        data.length
          ? defaultSearchState
          : {
              loading: false,
              status: "No results",
              description: `We couldn't find anything with the term "${searchTerm}". Please try again.`,
            }
      );
      setSearchResults(data);
    }
  };

  const ForwardRefLink = forwardRef(function ForwardRefLink(
    { href, children, ...props },
    ref
  ) {
    return (
      <Link href={href} ref={ref} {...props}>
        {children}
      </Link>
    );
  });

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
        }}
        className="focus:ring-none inline-flex w-full items-center rounded border bg-white p-2 px-3 text-sm text-gray-500 transition-colors duration-200 ease-in-out hover:bg-gray-50 focus:outline-none"
      >
        <MagnifyingGlassIcon className="mr-2 h-4 w-4" aria-hidden="true" />
        Search the Guide...
      </button>
      <Transition.Root
        show={open}
        as={Fragment}
        afterLeave={() => setSearchTerm("")}
        appear
      >
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-tfm-primary bg-opacity-50 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 pt-8 sm:p-12 md:p-20 md:pt-24">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="mx-auto max-w-3xl transform divide-y divide-gray-100 overflow-hidden rounded bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
                <Combobox
                  onChange={(r) => router.push("/guide/" + r.slug_path)}
                >
                  {({ activeOption }) => (
                    <>
                      <div className="relative">
                        <MagnifyingGlassIcon
                          className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <Combobox.Input
                          className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                          placeholder="Search the Guide..."
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      {searchResults.length > 0 && (
                        <Combobox.Options
                          as="div"
                          static
                          hold
                          className="flex transform-gpu divide-x divide-gray-100"
                        >
                          <div
                            className={classNames(
                              "max-h-96 min-w-0 flex-auto scroll-py-4 overflow-y-auto px-6 py-4",
                              activeOption && "sm:h-96"
                            )}
                          >
                            <div className="-mx-2 text-sm text-gray-700">
                              {searchResults.map((result) => (
                                <Combobox.Option
                                  as={ForwardRefLink}
                                  key={result.id}
                                  value={result}
                                  href={`/guide/${result.slug_path}`}
                                  className={({ active }) =>
                                    classNames(
                                      "flex items-center rounded p-2",
                                      active && "bg-gray-100 text-gray-900"
                                    )
                                  }
                                >
                                  {({ active }) => (
                                    <>
                                      <span className="ml-3 flex-auto truncate">
                                        {result.title}
                                      </span>
                                      {active && (
                                        <ChevronRightIcon
                                          className="ml-3 h-5 w-5 flex-none text-gray-400"
                                          aria-hidden="true"
                                        />
                                      )}
                                    </>
                                  )}
                                </Combobox.Option>
                              ))}
                            </div>
                          </div>
                          {activeOption && (
                            <div className="hidden h-96 w-1/2 flex-none flex-col divide-y divide-gray-100 overflow-y-auto sm:flex">
                              <div className="flex-auto p-6">
                                <h2 className="font-accent text-xs tracking-wide text-tfm-secondary">
                                  {activeOption.category?.title ||
                                    "Uncategorized"}
                                </h2>
                                <h2 className="mt-1 font-brand text-2xl text-tfm-primary">
                                  {activeOption.title}
                                </h2>
                                <p className="text-sm leading-6 text-gray-500">
                                  <Highlighter
                                    highlightClassName="Your-Highlight-Class"
                                    searchWords={[searchTerm]}
                                    autoEscape={true}
                                    textToHighlight={getSnippet(
                                      activeOption.content.replace(
                                        /<[^>]*>?/gm,
                                        " "
                                      ),
                                      searchTerm
                                    )}
                                  />
                                </p>
                              </div>
                              <div className="flex flex-shrink flex-col justify-between p-6">
                                <LinkButton
                                  href={`/guide/${activeOption.slug_path}`}
                                  primary
                                  Icon={DocumentTextIcon}
                                  fullWidth
                                  small
                                >
                                  Read Article
                                </LinkButton>
                              </div>
                            </div>
                          )}
                        </Combobox.Options>
                      )}
                      {!searchResults.length && (
                        <div
                          className={classNames(
                            "px-6 py-14 text-center text-sm sm:px-14",
                            searchState.loading && "animate-pulse"
                          )}
                        >
                          <DocumentMagnifyingGlassIcon
                            className="mx-auto h-6 w-6 text-gray-400"
                            aria-hidden="true"
                          />
                          <p className="mt-4 font-brand text-2xl">
                            {searchState.status}
                          </p>
                          {searchState.description && (
                            <p className="mx-auto mt-2 max-w-md text-gray-500">
                              {searchState.description}
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </Combobox>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
