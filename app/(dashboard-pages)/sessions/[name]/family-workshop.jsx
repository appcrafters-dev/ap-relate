"use client";

import { Fragment } from "react";
import { Tab } from "@headlessui/react";
import { CalendarDaysIcon, LockClosedIcon } from "@heroicons/react/20/solid";
import { localDateTime } from "lib/date";
import AdvisorNotesForm from "@/components/advisor-notes";
import { classNames } from "lib/utils";
import ClientNotesForm from "@/components/client-notes";
import ListRecordings from "@/components/list-recordings";
import Badge from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/buttons";
import Image from "next/image";
import Link from "next/link";
import AdminEditSessionModal from "./admin-edit-session-modal";

function removeEmpty(obj) {
  return Object.entries(obj)
    .filter(([_, v]) => v != null)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
}

export function DescriptionList(fields) {
  return (
    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
      {Object.keys(removeEmpty(fields)).map((field) => (
        <div key={field} className="sm:col-span-1">
          <dt className="font-subheading text-sm font-semibold uppercase tracking-wide">
            {field}
          </dt>
          <dd className="mt-1 text-sm text-gray-900">{fields[field]}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function FamilySession({
  session: familySession,
  isAdmin = false,
  recordings,
}) {
  const tabs = [
    {
      name: "About",
      content: () => (
        <div className="space-y-4">
          {familySession.session.subtitle && (
            <p className="font-medium italic">
              {familySession.session.subtitle}
            </p>
          )}
          {familySession.session.description && (
            <div
              className="prose prose-sm max-w-none text-gray-800"
              dangerouslySetInnerHTML={{
                __html: familySession.session.description.replace(
                  /class=".*?"/g,
                  ""
                ),
              }}
            />
          )}
          {DescriptionList({
            Quadrant: familySession.session.total_family_framework,
            "Applicable Life Phases": familySession.session.life_phases.length
              ? familySession.session.life_phases
                  .map((phase) => phase.title)
                  .join(", ")
              : null,
          })}
        </div>
      ),
    },
    {
      name: "Conference Details",
      content: () =>
        DescriptionList({
          Status: familySession.status,
          "Scheduled for": familySession.scheduled_time
            ? localDateTime(familySession.scheduled_time + "Z")
            : familySession.calendar_quarter?.id,
          Coach: familySession.coach
            ? familySession.coach.first_name
            : "No coach assigned",
          "Meeting Link":
            familySession.status == "Scheduled" &&
            familySession.conferencing_join_url ? (
              <a href={familySession.conferencing_join_url}>
                {familySession.conferencing_join_url}
              </a>
            ) : familySession.status == "Scheduled" ? (
              <Link
                href={"/v/" + familySession.short_id}
                target="_blank"
                rel="noreferrer"
              >
                {"totalfamily.io/v/" + familySession.short_id}
              </Link>
            ) : null,
        }),
    },
    {
      name: "Notes",
      clientOnly: true,
      content: () => <ClientNotesForm session={familySession} />,
    },
    {
      name: "Coach Notes",
      admin: true,
      content: () => <AdvisorNotesForm session={familySession} />,
    },
    {
      name: (
        <span>
          Recordings{" "}
          {recordings?.total_count ? (
            <Badge color="yellow">{recordings.total_count}</Badge>
          ) : null}
        </span>
      ),
      admin: true,
      content: () => <ListRecordings recordings={recordings} />,
    },
  ];

  return (
    <main className="-mt-10">
      <article>
        <div>
          {familySession.session.image_url ? (
            <div className="relative h-32">
              <Image
                className="h-full w-full object-cover"
                src={familySession.session.image_url}
                layout="fill"
                objectFit="cover"
                alt="family session image"
              />
            </div>
          ) : (
            <div className="h-32 bg-gradient-to-r from-tfm-secondary to-tfm-sand" />
          )}
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
              <div className="z-10 flex">
                <span className="z-10 inline-flex h-24 w-24 items-center justify-center rounded-full bg-tfm-sand ring-4 ring-white sm:h-32 sm:w-32">
                  <span className="font-accent text-4xl font-medium uppercase leading-none tracking-widest text-white">
                    {familySession.session.number}
                  </span>
                </span>
              </div>
              <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                <div className="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
                  <h1 className="truncate font-brand text-4xl text-tfm-primary">
                    {familySession.session.title}
                  </h1>
                </div>
                <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                  {(familySession.status === "Scheduled" ||
                    familySession.status === "Planned") && (
                    <LinkButton
                      href={`/sessions/${familySession.id}/schedule`}
                      primary
                      Icon={CalendarDaysIcon}
                    >
                      {familySession.status === "Scheduled"
                        ? "Reschedule"
                        : "Schedule"}
                    </LinkButton>
                  )}
                  {isAdmin && <AdminEditSessionModal session={familySession} />}
                </div>
              </div>
            </div>
            <div className="mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden">
              <h1 className="truncate text-2xl font-bold text-gray-900">
                {familySession.session.title}
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
                  {tabs
                    .filter((tab) => !tab.admin || (tab.admin && isAdmin))
                    .filter((tab) => (isAdmin ? !tab.clientOnly : true))
                    .map((tab, index) => (
                      <Tab as={Fragment} key={index}>
                        {({ selected }) => (
                          <button
                            className={classNames(
                              selected
                                ? "border-tfm-secondary text-gray-900"
                                : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700",
                              "inline-flex items-center justify-center whitespace-nowrap border-b-2 p-2 font-subheading text-sm font-semibold transition-colors duration-300 ease-in-out focus:outline-none md:px-1 md:py-4"
                            )}
                            aria-current={selected ? "page" : undefined}
                          >
                            {tab.admin && (
                              <LockClosedIcon
                                className="mr-2 h-3.5 w-3.5"
                                aria-hidden={true}
                              />
                            )}
                            {tab.name}
                          </button>
                        )}
                      </Tab>
                    ))}
                </Tab.List>
              </div>
            </div>
          </div>

          {/* Tab content */}
          <Tab.Panels className="mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">
            {tabs
              .filter((tab) => !tab.admin || (tab.admin && isAdmin))
              .filter((tab) => (isAdmin ? !tab.clientOnly : true))
              .map((tab, index) => (
                <Tab.Panel key={index}>{tab.content()}</Tab.Panel>
              ))}
          </Tab.Panels>
        </Tab.Group>
      </article>
    </main>
  );
}
