"use client";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { prettyDate } from "lib/date";
import { classNames } from "lib/utils";
import Link from "next/link";

function TodoCard({ todo }) {
  return (
    <div
      className={
        "relative flex max-w-lg items-center space-x-3 rounded border border-gray-100 bg-white px-6 py-5 shadow-sm transition-colors duration-200 ease-in-out focus-within:ring-2 focus-within:ring-tfm-secondary focus-within:ring-offset-2 hover:border-gray-200"
      }
    >
      <div className="flex-shrink-0">
        <span
          className={classNames(
            "inline-flex rounded-full p-1.5 font-subheading text-xs font-semibold uppercase",
            todo.completed
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          )}
        >
          <span className="sr-only">
            {todo.completed ? "Completed" : "Not completed"}
          </span>
          {todo.completed ? (
            <CheckIcon className="h-4 w-4" />
          ) : (
            <XMarkIcon className="h-4 w-4" />
          )}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <Link href={todo.link} className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <p className="font-subheading font-semibold text-gray-900">
            {todo.title}
          </p>
        </Link>
        <p className="truncate text-sm text-gray-500">{todo.description}</p>
      </div>
      {todo.completed ? null : (
        <a className="focus:outline-none print:hidden">
          <span className="sr-only">Open link to {todo.title}</span>
          <ChevronRightIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </a>
      )}
    </div>
  );
}

export default function Dashboard({
  user,
  sessions,
  coach,
  familyMembers,
  partner,
  familyStatus,
  quoteOfTheDay: randomQuote,
}) {
  // combine children and heads of household into one array, add the doctype to each
  familyMembers = familyMembers.map((member) => {
    return {
      ...member,
      doctype: member.is_child ? "child" : "head-of-household",
    };
  });

  const familyMembersWithoutAvatar = familyMembers.filter(
    (member) => !member.avatar
  );

  const todoList = [
    {
      title: "Complete the onboarding process",
      description: "Help us get to know you better",
      link: "/settings/profile",
      completed: familyStatus !== "Onboarding",
    },
    {
      title: "Add photos of your family members",
      description: "Enhance your experience within the app",
      link: "/family",
      completed: familyMembersWithoutAvatar.length === 0,
    },
    {
      title: "Schedule your first session",
      description: "Meet your coach and begin your journey with TFM",
      link: "/sessions",
      completed:
        sessions.filter((w) => {
          // if the session is scheduled or completed, then it's done
          return w.status === "Scheduled" || w.status === "Completed";
        }).length > 0,
    },
  ];

  return (
    <>
      <h1 className="mb-4 font-brand text-4xl text-tfm-primary">Dashboard</h1>
      <div className="flex flex-col space-y-12">
        <p className="text-gray-500">
          {"Welcome to TFM! We're so glad you're here."}
        </p>
        {todoList.filter((todo) => !todo.completed).length > 0 ? (
          <div className="flex flex-col space-y-2">
            <h2 className="font-brand text-3xl text-tfm-primary-900">
              Your Tasks
            </h2>
            <div className="flex flex-col space-y-2">
              {todoList
                .filter((todo) => !todo.completed)
                .map((todo) => (
                  <TodoCard todo={todo} key={todo.title} />
                ))}
            </div>
          </div>
        ) : null}
        {randomQuote ? (
          <div className="flex flex-col space-y-4">
            <h2 className="font-brand text-2xl text-tfm-primary-900">
              Quote of the Day
            </h2>
            <Link href="/quotes">
              <blockquote className="max-w-xl rounded bg-white p-6 shadow">
                <div className="text-lg text-gray-600">
                  <p>
                    &quot;
                    <span
                      dangerouslySetInnerHTML={{ __html: randomQuote.quote }}
                    />
                    &quot;
                  </p>
                </div>
                <footer className="mt-8">
                  <div className="flex justify-end">
                    <div className="ml-4 lg:ml-0">
                      <div className="font-subheading text-base font-bold text-gray-900">
                        - {randomQuote.family_member.first_name}
                      </div>
                      <div className="font-accent text-xs text-opacity-50">
                        {prettyDate(randomQuote.date)}
                      </div>
                    </div>
                  </div>
                </footer>
              </blockquote>
            </Link>
          </div>
        ) : null}

        {coach && (
          <div className="flex flex-col space-y-4">
            <h2 className="font-brand text-3xl text-tfm-primary-900">
              Meet your Coach
            </h2>
            <div
              key={coach.first_name}
              className="flex flex-col gap-8 sm:flex-row"
            >
              {coach?.avatar_url ? (
                <img
                  className="aspect-[4/5] w-52 flex-none rounded object-cover"
                  src={coach.avatar_url}
                  alt=""
                />
              ) : null}
              <div className="max-w-xl flex-auto">
                <h3 className="font-subheading text-lg font-semibold leading-8 text-gray-900">
                  {coach.first_name}
                </h3>
                <a
                  className="text-base text-gray-600"
                  href="mailto:hello@totalfamily.io"
                >
                  hello@totalfamily.io
                </a>
                <p className="mt-6 text-base text-gray-600">
                  {coach.short_bio}
                </p>
              </div>
            </div>
          </div>
        )}
        {partner && (
          <div className="flex flex-col space-y-4">
            <h2 className="font-brand text-3xl text-tfm-primary-900">
              In partnership with
            </h2>
            <div className="flex flex-col gap-4">
              {partner.company_logo_url ? (
                <img
                  className="w-64 flex-none rounded object-contain"
                  src={partner.company_logo_url}
                  alt=""
                />
              ) : null}
              <h3 className="font-semibold tracking-tight text-gray-900">
                {partner.company_legal_name}
              </h3>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
