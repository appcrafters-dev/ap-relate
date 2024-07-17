"use client";

import { ChevronRightIcon, PlusIcon } from "@heroicons/react/24/outline";
import { prettyDate } from "lib/date";
import { classNames } from "lib/utils";
import Link from "next/link";
import { useState } from "react";
import FamilyMemberModal from "./new-family-member-modal";

export default function FamilyMemberGrid({
  memberList,
  setMemberList,
  memberType,
  enableLinks = true,
  enableNew = false,
  familyId = null,
}) {
  const [openNewModal, setOpenNewModal] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {memberList.map((member, idx) => (
        <div
          key={idx}
          className={classNames(
            enableLinks &&
              "transition duration-200 ease-in-out hover:border-gray-200",
            "relative flex items-center space-x-3 rounded border border-transparent bg-white px-6 py-5 shadow focus-within:ring-2 focus-within:ring-tfm-secondary focus-within:ring-offset-2"
          )}
        >
          <div className="flex-shrink-0">
            {member && member.avatar_url ? (
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={member.avatar_url}
                alt={member.name || member.first_name + " Avatar"}
              />
            ) : (
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-tfm-secondary">
                <span className="font-medium uppercase leading-none tracking-widest text-white">
                  {(member.name && member.name.charAt(0)) ||
                    (member.first_name && member.first_name.charAt(0))}
                  {member.last_name && member.last_name.charAt(0)}
                </span>
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            {enableLinks ? (
              <Link
                href={`/family/${memberType}/${member.id}`}
                className="focus:outline-none"
              >
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="font-subheading text-base font-semibold text-tfm-primary">
                  {member.name || member.first_name} {member.last_name}
                </p>
                {member.birth_date && (
                  <p className="truncate text-sm text-gray-500">
                    Born {prettyDate(member.birth_date)}
                  </p>
                )}
              </Link>
            ) : (
              <div className="focus:outline-none">
                <p className="text-sm font-medium text-gray-900">
                  {member.name || member.first_name} {member.last_name}
                </p>
                {member.birth_date && (
                  <p className="truncate text-sm text-gray-500">
                    Born {prettyDate(member.birth_date)}
                  </p>
                )}
              </div>
            )}
          </div>
          {enableLinks && (
            <a className="focus:outline-none print:hidden">
              <span className="sr-only">View details for {member.id}</span>
              <ChevronRightIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </a>
          )}
        </div>
      ))}
      {enableNew && (
        <button
          className="relative flex items-center space-x-3 rounded border border-dashed border-gray-200 px-6 py-5 transition-colors duration-200 ease-in-out focus-within:ring-2 focus-within:ring-tfm-secondary focus-within:ring-offset-2 hover:border-gray-300 print:hidden"
          onClick={() => setOpenNewModal(true)}
        >
          <div className="min-w-0 flex-1">
            <div className="focus:outline-none">
              <p className="font-subheading text-sm font-semibold uppercase tracking-wide text-tfm-primary/50">
                Add {memberList.length ? "another" : "your first"} {memberType}
              </p>
            </div>
          </div>

          <div className="focus:outline-none">
            <span className="sr-only">New {memberType}</span>
            <PlusIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        </button>
      )}
      {enableNew && (
        <FamilyMemberModal
          open={openNewModal}
          setOpen={setOpenNewModal}
          memberType={memberType}
          memberList={memberList}
          setMemberList={setMemberList}
          familyId={familyId}
        />
      )}
    </div>
  );
}
