"use client";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { FamilyPartnerStatus } from "lib/models/enums";
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

export default function PartnerDashboard({ partner, families }) {
  const todoList = [
    {
      title: "Complete the onboarding process",
      description: "Help us get to know your firm better",
      link: "/settings/profile",
      completed: partner.status !== FamilyPartnerStatus.Active,
    },
    {
      title: "Add a company logo",
      description: "Provide a personalized experience for your clients",
      link: "/settings/partner",
      completed: partner.company_logo_url !== null,
    },
    {
      title: "Invite your first family",
      description: "Start helping families today",
      link: "/partners/families",
      completed: families.length > 0,
    },
  ];

  return (
    <>
      <h1 className="mb-4 font-brand text-4xl text-tfm-primary">Dashboard</h1>
      <div className="flex flex-col space-y-12">
        <p className="text-gray-500">
          {"Welcome to TFM! We're so glad you're here."}
        </p>

        <div className="flex flex-col space-y-2">
          <h2 className="font-brand text-3xl text-tfm-primary-900">
            Your Tasks
          </h2>
          <div className="flex flex-col space-y-2">
            {todoList.filter((todo) => !todo.completed).length === 0 ? (
              <p className="text-gray-500">
                You are all caught up! Check back later for more.
              </p>
            ) : (
              todoList
                .filter((todo) => !todo.completed)
                .map((todo) => <TodoCard todo={todo} key={todo.title} />)
            )}
          </div>
        </div>
        {partner && (
          <div className="flex flex-col space-y-4">
            <h2 className="font-brand text-3xl text-tfm-primary-900">
              Your Company
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
