"use client";

import { Fragment } from "react";
import Link from "next/link";
import { localDateTime } from "lib/date";
import { classNames, getFullName } from "lib/utils";
import { Tab } from "@headlessui/react";
import { LinkButton } from "@/components/ui/buttons";
import { CalendarDaysIcon } from "@heroicons/react/20/solid";

export function getNextScheduledSession(sessions) {
  const orderedSessions = [1001, 1002, 1003, 1004];
  for (let i = 0; i < orderedSessions.length; i++) {
    const session = sessions.find(
      (w) =>
        w.session.number === orderedSessions[i] &&
        (w.status === "Planned" || w.status === "Scheduled")
    );
    if (session) return session;
  }
}

export default function Sessions({ familySessions }) {
  const upNext = getNextScheduledSession(familySessions);

  // TODO: fix sorting
  const upcomingSessions = familySessions
    .filter(
      // show only scheduled or planned sessions
      (session) =>
        session.status === "Scheduled" || session.status === "Planned"
    )
    .filter(
      // if upNext, then remove it from the list of sessions
      (session) => session.id !== upNext?.id
    )
    .sort((a, b) =>
      a.session.number <= 1004 && b.session.number >= 1004
        ? -1
        : a.session.number >= 1004 && b.session.number <= 1004
        ? 1
        : a.status === "Planned"
        ? new Date(a.planned_for_quarter?.starts_on) -
          new Date(b.planned_for_quarter?.starts_on)
        : new Date(a.scheduled_time) - new Date(b.scheduled_time)
    );

  const completedSessions = familySessions
    .filter(
      // show sessions that are not scheduled or planned
      (session) =>
        session.status !== "Scheduled" && session.status !== "Planned"
    )
    .sort(
      // sort by completed date, descending
      (a, b) => new Date(b.scheduled_time) - new Date(a.scheduled_time)
    );

  const tabs = [
    {
      name: "Upcoming",
      sessions: upcomingSessions,
      upNext: upNext,
    },
    {
      name: "Completed",
      sessions: completedSessions,
    },
  ];

  return (
    <>
      <h1 className="mb-4 font-brand text-4xl text-tfm-primary">Sessions</h1>

      {/* <pre>{JSON.stringify(sessions, null, 2)}</pre> */}
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
                      "whitespace-nowrap border-b-2 px-1 py-4 font-subheading font-bold transition-colors duration-300 ease-in-out focus:outline-none"
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
        <Tab.Panels className="py-6">
          {tabs.map((tab) => (
            <Tab.Panel key={tab.name}>
              {tab.upNext && (
                <div className="mb-6">
                  <h2 className="mb-3 font-accent text-base uppercase tracking-wide text-gray-600">
                    Coming up next...
                  </h2>
                  <div className="grid gap-6 lg:grid-cols-2">
                    <FamilySessionCard familySession={tab.upNext} />
                  </div>
                </div>
              )}
              {tab.upNext && (
                <h2 className="mb-3 font-accent text-base uppercase tracking-wide text-gray-600">
                  Future sessions...
                </h2>
              )}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {tab.sessions.length ? (
                  tab.sessions.map((session) => (
                    <FamilySessionCard
                      key={session.id}
                      familySession={session}
                      hideScheduleButtons={
                        upNext && upNext?.status != "Scheduled"
                      }
                    />
                  ))
                ) : (
                  <div className="text-gray-500">
                    No {tab.name.toLowerCase()} sessions
                  </div>
                )}
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}

function FamilySessionCard({ familySession, hideScheduleButtons = false }) {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded bg-gray-50 shadow">
      <div className="inline-flex w-full items-center justify-between bg-white px-4 py-5 sm:px-6">
        <h3 className="font-subheading text-lg font-bold leading-6 text-tfm-primary">
          <Link href={`/sessions/${familySession.id}`} legacyBehavior>
            {familySession.session.title}
          </Link>
        </h3>
        <div className="flex items-center text-sm font-medium">
          <span
            className={classNames(
              "inline-flex rounded px-3 py-1 font-accent text-sm uppercase tracking-wide",
              familySession.status === "Scheduled"
                ? "bg-green-100 text-green-800"
                : familySession.status === "Completed"
                ? "bg-green-100 text-green-800"
                : familySession.status === "Canceled"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            )}
          >
            {familySession.status}
          </span>
        </div>
      </div>

      {/* {familySession.session.description &&
          (familySession.status === "Scheduled" ||
            familySession.status === "Planned") && (
            <div
              className="prose prose-sm max-w-none px-4 leading-tight text-gray-900 sm:col-span-2 sm:mt-0"
              dangerouslySetInnerHTML={{
                __html: familySession.session.description,
              }}
            />
          )} */}

      <div className="flex">
        <dl className="grid flex-auto p-4 lg:grid-cols-2">
          <dt className="text-sm font-medium text-gray-500">
            {familySession.status == "Planned" ? "Planned for" : "Date"}
          </dt>
          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            {familySession.status == "Planned" &&
            familySession.planned_for_quarter
              ? familySession.planned_for_quarter.id
              : familySession.scheduled_time
              ? localDateTime(familySession.scheduled_time + "Z")
              : "TBD"}
          </dd>
        </dl>
        {familySession.coach && (
          <dl className="grid flex-auto p-4 lg:grid-cols-2">
            <dt className="text-sm font-medium text-gray-500">Coach</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {(familySession.coach &&
                getFullName(
                  familySession.coach.first_name,
                  familySession.coach.last_name
                )) ||
                "TBD"}
            </dd>
          </dl>
        )}
      </div>
      {(familySession.status === "Scheduled" ||
        (familySession.status === "Planned" && !hideScheduleButtons)) && (
        <div className="space-y-2 p-4 pt-2 text-center">
          <LinkButton
            fullWidth
            href={`/sessions/${familySession.id}/schedule`}
            primary={familySession.status === "Planned"}
            Icon={CalendarDaysIcon}
          >
            {familySession.status === "Scheduled" ? "Reschedule" : "Schedule"}
          </LinkButton>
        </div>
      )}
    </div>
  );
}
