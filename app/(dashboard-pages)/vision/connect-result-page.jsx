"use client";

import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { classNames } from "lib/utils";

function PersonCard({ person }) {
  return (
    <li className="group my-auto flex flex-col justify-center space-y-6 rounded bg-white p-6 py-10 text-center align-middle shadow-xl transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
      <div className="flex flex-col items-center justify-center">
        {person && person.avatar_url ? (
          <img
            className="mx-auto h-24 w-24 rounded-full object-cover"
            src={person.avatar_url}
            alt={person.first_name + " avatar"}
          />
        ) : (
          <span className="inline-block h-20 w-20 overflow-hidden rounded-full bg-gray-100">
            <svg
              className="h-full w-full text-gray-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </span>
        )}
      </div>

      <div className="space-y-2 text-center font-medium leading-6">
        <h3 className="font-subheading text-xl font-semibold text-tfm-primary">
          {person && person.first_name}
        </h3>
        {person.roles && (
          <ul className="font-accent uppercase tracking-widest text-gray-600">
            {person.roles.map((role, idx) => (
              <li key={idx} className="text-wrap">
                {role}
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

export default function ConnectResults({ family }) {
  const children = [];
  const heads_of_households = [];

  family.family_members.forEach((member) => {
    if (member.is_child) {
      children.push(member);
    } else {
      heads_of_households.push(member);
    }
  });

  return (
    <main className="space-y-5">
      <div className="py-4 text-center">
        <h1 className="font-brand text-4xl font-bold text-tfm-primary-900 sm:text-6xl">
          The {family.family_name} Family
        </h1>
        {heads_of_households[0].relationship_anniversary && (
          <h2 className="mt-2 font-accent text-lg uppercase tracking-widest text-tfm-secondary">
            Est.{" "}
            {new Date(
              heads_of_households[0].relationship_anniversary
            ).getFullYear()}
          </h2>
        )}
      </div>
      <div className="grid gap-8 print:grid-cols-2 xl:grid-cols-2">
        <div className="group relative overflow-hidden rounded pb-10 pt-64 shadow-xl transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl print:order-last xl:order-last">
          {family.family_photo_url ? (
            <img
              className="absolute inset-0 h-full w-full object-contain object-center"
              src={family.family_photo_url}
              alt="family photo"
            />
          ) : (
            <img
              className="absolute inset-0 h-full w-full object-cover"
              src="/img/family-tree.png"
              alt="family photo"
            />
          )}
          <div className="absolute inset-0 bg-tfm-secondary bg-opacity-30 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-tfm-secondary via-tfm-sand opacity-70" />
          {family.family_mantra && (
            <div className="relative px-8">
              <blockquote className="mt-8 text-xl transition-all duration-300 ease-in-out group-hover:text-2xl">
                <div className="relative font-brand font-bold tracking-wide text-white  md:flex-grow">
                  <svg
                    className="absolute left-0 top-0 h-8 w-8 -translate-x-3 -translate-y-2 transform text-tfm-secondary"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="relative">{family.family_mantra}</p>
                </div>
              </blockquote>
            </div>
          )}
        </div>
        <div className="space-y-8">
          <p className="rounded bg-tfm-primary p-4 text-center font-subheading text-lg font-bold uppercase tracking-wider text-tfm-gray">
            {family.life_phase?.title}
          </p>
          <ul
            role="list"
            className="flex flex-wrap justify-center gap-8 print:grid-cols-2 sm:grid-cols-2"
          >
            {heads_of_households.map((person) => (
              <PersonCard key={person.first_name} person={person} />
            ))}
          </ul>
        </div>
      </div>
      <div className="grid gap-8 print:grid-cols-2 xl:grid-cols-2">
        <ul
          role="list"
          className="flex flex-wrap justify-center gap-8 print:grid-cols-2 sm:grid-cols-2"
        >
          {children.map((person) => (
            <PersonCard key={person.first_name} person={person} />
          ))}
        </ul>
        <div className="space-y-4">
          <p className="p-4 text-center font-brand text-3xl text-tfm-primary">
            Family Values
          </p>
          <ul className="flex flex-wrap justify-center gap-8">
            {family.family_value_actions.map((value, index) => (
              <Popover
                key={index}
                className="flex-auto basis-1/2 flex-col justify-center text-center align-middle print:basis-1/4 sm:basis-1/3 xl:basis-1/4"
              >
                {({ open }) => (
                  <>
                    <Popover.Button
                      className={classNames(
                        "group w-full rounded p-4 py-6 font-accent text-xl shadow-lg ring-tfm-secondary transition duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-tfm-secondary focus-visible:ring-opacity-75",
                        value.index % 2 ? "bg-tfm-yellow" : "bg-tfm-gray",
                        open
                          ? "scale-105 shadow-xl"
                          : "hover:scale-105 hover:shadow-xl"
                      )}
                    >
                      <div>{value.value_name}</div>
                    </Popover.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-300"
                      enterFrom="opacity-0 -translate-y-6"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-200"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 -translate-y-6"
                    >
                      <Popover.Panel
                        className="mt-6 text-center text-sm font-medium uppercase text-gray-500"
                        as="p"
                      >
                        {value.action}
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
