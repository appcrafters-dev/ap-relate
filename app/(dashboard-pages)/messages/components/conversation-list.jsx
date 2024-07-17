import Badge from "@/components/ui/badge";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { InboxIcon } from "@heroicons/react/24/outline";
import { localDateTime, relativeDate } from "lib/date";
import Link from "next/link";

export default function ConversationList({ conversations }) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <InboxIcon className="h-12 w-12 text-gray-400" />
        <p className="text-gray-500">No messages</p>
      </div>
    );
  }

  return (
    <ul
      role="list"
      className="-mx-4 divide-y divide-gray-100 overflow-hidden bg-white shadow sm:mx-0 sm:rounded"
    >
      {conversations.map((msg) => {
        const isUnread =
          !msg.conversation_read_statuses.length ||
          new Date(msg.conversation_read_statuses[0].last_read_at) <
            new Date(msg.updated_at);

        return (
          <li
            key={msg.id}
            className="relative flex justify-between gap-x-6 px-4 py-5 transition-colors hover:bg-gray-50 sm:px-6"
          >
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="font-semibold leading-8 text-gray-900">
                  <Link href={"/messages/" + msg.id}>
                    <span className="absolute inset-x-0 -top-px bottom-0" />
                    <span className="inline-flex items-center gap-x-1.5">
                      {msg.subject || "No Subject"}{" "}
                      {isUnread && <Badge color="green">New</Badge>}
                    </span>
                  </Link>
                </p>
                <p className="mt-1 flex text-sm leading-6 text-gray-500">
                  <span className="relative truncate">
                    {msg.from_details.first_name}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-x-4">
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                <p className="text-sm leading-6 text-gray-900">#{msg.id}</p>

                {msg.updated_at ? (
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    <span className="ml-1">Last updated </span>
                    <time
                      dateTime={msg.updated_at}
                      title={localDateTime(msg.updated_at)}
                    >
                      {relativeDate(msg.updated_at)}
                    </time>
                  </p>
                ) : (
                  <div className="mt-1 flex items-center gap-x-1.5">
                    <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-xs leading-5 text-gray-500">Online</p>
                  </div>
                )}
              </div>
              <ChevronRightIcon
                className="h-5 w-5 flex-none text-gray-400"
                aria-hidden="true"
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
