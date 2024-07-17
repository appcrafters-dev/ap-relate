"use client";

import { LinkButton } from "@/components/ui/buttons";
import {
  ListBulletIcon,
  PencilIcon,
  PhoneIcon,
  UserGroupIcon,
} from "@heroicons/react/20/solid";
import { prettyDate } from "lib/date";

function SessionListItem({ session, link }) {
  return (
    <li className="w-auto space-y-2 rounded bg-white p-3 shadow">
      <p className="font-accent text-xs text-tfm-secondary">
        {prettyDate(session.scheduled_time)}
      </p>
      <h3 className="font-brand text-xl text-tfm-primary">{session.title}</h3>
      <p className="font-subheading text-sm text-tfm-primary">
        with The {session.family_name} Family
      </p>
      <ul className="inline-flex w-full space-x-2">
        {new Date(session.scheduled_time).toDateString() ===
          new Date().toDateString() && (
          <LinkButton
            primary
            href={`/v/${session.short_id}`}
            Icon={PhoneIcon}
            fullWidth
            small
          >
            Join Video
          </LinkButton>
        )}
        <LinkButton
          key={link.href}
          primary={link.primary}
          href={link.href + session.id}
          Icon={link.icon}
          fullWidth
          small
        >
          {link.text}
        </LinkButton>
      </ul>
    </li>
  );
}

function SessionList({ sessions, title, description, emptyMessage, link }) {
  return (
    <div>
      <div className="inline-flex w-full items-center justify-between space-x-2">
        <h2 className="font-brand text-3xl text-tfm-primary">{title}</h2>
        <LinkButton
          href="/sessions/list"
          Icon={ListBulletIcon}
          extraSmall
          primary
        >
          View All
        </LinkButton>
      </div>
      <p className="mt-2 text-base tracking-tight text-gray-500">
        {description}
      </p>
      <hr className="my-4 border-t border-gray-200" />
      <ul className="my-4 grid max-w-2xl gap-4 xl:grid-cols-2">
        {sessions.length ? (
          sessions.map((session) => (
            <SessionListItem key={session.id} session={session} link={link} />
          ))
        ) : (
          <li className="font-subheading text-sm font-semibold uppercase text-gray-500">
            {emptyMessage}
          </li>
        )}
      </ul>
    </div>
  );
}

export default function CoachDashboard({
  user,
  upcomingSessions,
  sessionsNeedingNotes,
  newestFamily,
}) {
  return (
    <div className="flex flex-col space-y-12">
      <h1 className="font-brand text-4xl text-tfm-primary">
        {"Welcome back, " + user.profile.first_name + "!"}
      </h1>
      <div className="grid grid-cols-1 space-y-8 md:grid-cols-2 md:space-x-12 md:space-y-0">
        <SessionList
          title="Upcoming Sessions"
          description="Here are the next few sessions you have scheduled and may need to prepare for."
          sessions={upcomingSessions}
          emptyMessage="None scheduled"
          link={{
            href: "/sessions/",
            text: "View Details",
            icon: PencilIcon,
          }}
        />
        <SessionList
          title="Sessions Needing Notes"
          description="These sessions are in the past, but may need some attention."
          sessions={sessionsNeedingNotes}
          emptyMessage="You're all caught up!"
          link={{
            href: "/sessions/",
            text: "Add Notes",
            icon: PencilIcon,
          }}
        />
      </div>
      {/* intro to your newest family section */}
      {newestFamily && (
        <div className="space-y-2">
          <h2 className="font-brand text-3xl text-tfm-primary-900">
            The {newestFamily.family_name} Family
          </h2>
          <p className="pb-2 text-base tracking-tight text-gray-500">
            Say hello to your newest family! They are excited to get started
            with you.
          </p>
          <LinkButton
            href={`/family/${newestFamily.id}`}
            Icon={UserGroupIcon}
            primary
            small
          >
            View Family
          </LinkButton>
        </div>
      )}
    </div>
  );
}
