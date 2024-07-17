"use client";

import { Fragment, useState } from "react";
import { Tab } from "@headlessui/react";
import {
  LockClosedIcon,
  PaperClipIcon,
  PencilSquareIcon,
} from "@heroicons/react/20/solid";
import FamilyMemberModal from "./new-family-member-modal";
import TimeWise from "./time-wise";
import { Button, LinkButton } from "@/components/ui/buttons";
import { classNames } from "lib/utils";
import Image from "next/image";

const tabs = {
  "head-of-household": [
    { name: "Profile" },
    { name: "Family Vision" },
    { name: "Time Wise" },
    { name: "Documents" },
  ],
  child: [{ name: "Profile" }, { name: "Documents" }],
  pet: [{ name: "Profile" }, { name: "Documents" }],
};

function hasVision(doctype) {
  return doctype === "head-of-household";
}

function removeEmpty(obj) {
  return Object.entries(obj)
    .filter(([_, v]) => v != null && v !== "")
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
}
export default function FamilyMemberLayout({
  person,
  profile_fields,
  memberType,
  isAdmin = false,
}) {
  const [openEditModal, setOpenEditModal] = useState(false);
  return (
    <main className="-mt-10">
      <FamilyMemberModal
        open={openEditModal}
        setOpen={setOpenEditModal}
        memberType={memberType}
        member={person}
        familyId={person.family_id}
      />
      <article>
        <div>
          <div className="relative h-32">
            <Image
              className="h-full w-full object-cover"
              src="/img/vw-van.jpeg"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
              <div className="flex">
                {person.avatar_url ? (
                  <img
                    className="z-10 h-24 w-24 rounded-full object-cover ring-4 ring-white sm:h-32 sm:w-32"
                    src={person.avatar_url}
                    alt={person.first_name + " Avatar"}
                  />
                ) : (
                  <span className="z-10 inline-flex h-24 w-24 items-center justify-center rounded-full bg-tfm-sand ring-4 ring-white sm:h-32 sm:w-32">
                    <span className="text-4xl font-medium uppercase leading-none tracking-widest text-white">
                      {(person.name && person.name.charAt(0)) ||
                        (person.first_name && person.first_name.charAt(0))}
                      {person.last_name && person.last_name.charAt(0)}
                    </span>
                  </span>
                )}
              </div>
              <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                <div className="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
                  <h1 className="truncate font-brand text-4xl text-gray-900">
                    {person.first_name || person.name} {person.last_name}
                  </h1>
                </div>
                <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Button
                    type="button"
                    Icon={PencilSquareIcon}
                    onClick={() => setOpenEditModal(true)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden">
              <h1 className="truncate font-brand text-4xl text-gray-900">
                {person.first_name || person.name} {person.last_name}
              </h1>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tab.Group>
          <div className="mt-6 sm:mt-2 2xl:mt-5">
            <div className="border-b border-gray-200">
              <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <Tab.List
                  className="-mb-px flex space-x-8 overflow-y-auto"
                  aria-label="Tabs"
                >
                  {tabs[memberType].map((tab) => (
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
                          {tab.name}
                        </button>
                      )}
                    </Tab>
                  ))}
                </Tab.List>
              </div>
            </div>
          </div>

          {/* Description list */}
          <Tab.Panels className="mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">
            <Tab.Panel
              as="dl"
              className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2"
            >
              {Object.keys(removeEmpty(profile_fields)).map((field) => (
                <div key={field} className="sm:col-span-1">
                  <dt className="font-subheading text-sm font-semibold uppercase tracking-wide text-gray-900">
                    {field}
                  </dt>
                  <dd className="mt-1 text-base text-gray-900">
                    {profile_fields[field]}
                  </dd>
                </div>
              ))}
            </Tab.Panel>
            {hasVision(memberType) && (
              <Tab.Panel>
                {person.roles ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium leading-6 text-gray-800">
                      {person.first_name}&lsquo;s Roles
                    </h3>
                    <ol className="list-inside list-decimal font-brand">
                      {person.roles.map((role, idx) => (
                        <li key={idx}>{role}</li>
                      ))}
                    </ol>
                  </div>
                ) : (
                  <p className="text-gray-900">
                    {person.first_name} hasn&lsquo;t completed Family Vision yet
                  </p>
                )}
                {isAdmin && (
                  <div className="mt-6 max-w-xs">
                    <LinkButton
                      href={`/family/${memberType}/${person.id}/roles`}
                      primary
                    >
                      <LockClosedIcon
                        className="-ml-1 mr-2 h-4 w-4"
                        aria-hidden="true"
                      />
                      {person.roles ? "Edit Roles" : "Enter Roles"}
                    </LinkButton>
                  </div>
                )}
              </Tab.Panel>
            )}
            {memberType == "head-of-household" && (
              <Tab.Panel>
                {person.time_wise ? (
                  <TimeWise
                    family_member_name={person.first_name}
                    time_wise={person.time_wise}
                  />
                ) : (
                  // <pre>
                  //   <code>{JSON.stringify(time_wise, null, 2)}</code>
                  // </pre>
                  <p className="text-gray-900">
                    {person.first_name} hasn&lsquo;t completed Time Wise yet
                  </p>
                )}
              </Tab.Panel>
            )}
            <Tab.Panel>
              {person.documents && person.documents.length > 0 ? (
                <div className="space-y-4">
                  <ul
                    role="list"
                    className="max-w-md divide-y divide-gray-200 rounded border border-gray-200"
                  >
                    {person.documents.map((doc) => (
                      <li
                        key={doc.name}
                        className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                      >
                        <div className="flex w-0 flex-1 items-center">
                          <PaperClipIcon
                            className="h-5 w-5 flex-shrink-0 text-gray-400"
                            aria-hidden="true"
                          />
                          <span className="ml-2 w-0 flex-1 truncate">
                            {doc.type}
                          </span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <a
                            href={doc.file}
                            className="font-medium text-tfm-primary transition-colors duration-150 ease-in-out hover:text-tfm-secondary"
                          >
                            Download
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-900">
                  {memberType == "pet"
                    ? "No documents uploaded for " + person.name
                    : person.first_name + " hasn't uploaded any documents yet"}
                </p>
              )}
              {/* <button className="mt-4 inline-flex items-center justify-center rounded border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-tfm-secondary-500 focus:ring-offset-2">
                <PlusIcon
                  className="-ml-1 mr-1.5 h-3.5 w-3.5 text-gray-400"
                  aria-hidden="true"
                />
                <span>Add Document</span>
              </button> */}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </article>
    </main>
  );
}
