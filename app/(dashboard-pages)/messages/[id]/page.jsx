import {
  getConversationAgents,
  getCurrentUser,
  getSupabaseServerComponentClient,
} from "lib/supabase/supbase.server";
import { Button, LinkButton } from "@/components/ui/buttons";
import { localDateTime, relativeDate } from "lib/date";
import { classNames, isAdminRole } from "lib/utils";
import { MarkConversationAsUnread } from "./actions";
import AddMessageForm from "../components/new-message";
import MarkAsRead from "../components/mark-as-read";
import {
  ArrowLeftIcon,
  CheckBadgeIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/20/solid";

import AssignmentSelector from "../components/assign-selector";
import { ErrorBox } from "@/components/ui/errors";
import TipTapEditor from "@/components/ui/text-editor";
import { notFound } from "next/navigation";

export default async function MessageDetailPage({ params }) {
  const supabase = getSupabaseServerComponentClient();
  const user = await getCurrentUser();
  const { agents } = await getConversationAgents();
  const isAdmin = isAdminRole(user.app_metadata.role);
  const MarkAsUnreadWithId = MarkConversationAsUnread.bind(null, params.id);

  const { data: conversation, error } = await supabase.client
    .from("conversations")
    .select(
      `*, messages(*, user_profile:user_profile_id(first_name, last_name, email, avatar_url)), conversation_ccs(*), from_details:from_user_profile_id(first_name, last_name, email, avatar_url), assigned_to:assigned_to_user_profile_id(first_name, last_name, email, avatar_url)`
    )
    .eq("id", params.id)
    .single();

  if (error)
    return (
      <ErrorBox
        msg={error.message || "Sorry, there was a problem loading the page."}
      />
    );

  if (!conversation) return notFound();

  // return <pre>{JSON.stringify(conversation, null, 2)}</pre>;

  return (
    <>
      <div className="sticky top-0 z-10 mx-auto max-w-2xl space-y-4 border-b bg-tfm-bg py-4">
        <ul className="w-full items-center justify-between space-y-2 sm:inline-flex sm:space-y-0 md:space-x-4">
          <li>
            <LinkButton href="/messages" Icon={ArrowLeftIcon}>
              View All
            </LinkButton>
          </li>
          <li>
            <form action={MarkAsUnreadWithId}>
              <Button type="submit" Icon={EnvelopeIcon}>
                Mark Unread
              </Button>
            </form>
          </li>
          {isAdmin && (
            <li>
              <AssignmentSelector
                conversation={conversation}
                agentList={agents}
              />
            </li>
          )}
        </ul>
        <h1 className="text-3xl font-semibold">
          {conversation.subject || "No Subject"}
        </h1>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          {conversation.from_details.first_name ||
            conversation.from_details.email}
          {/* cc */}
          {conversation.conversation_ccs.map((cc) => (
            <span key={cc.id} className="text-sm text-gray-600">
              , {cc.cc_details.first_name || cc.cc_details.email}
            </span>
          ))}{" "}
          &bull;{" "}
          {localDateTime(
            conversation.messages.length
              ? conversation.messages[0].timestamp
              : conversation.updated_at
          )}{" "}
          &bull;{" "}
          <span title={"Message ID: " + conversation.id}>
            #{conversation.id}
          </span>
        </p>
      </div>
      <div className="mx-auto max-w-xl space-y-4 pb-8">
        <TipTapEditor />
        <div className="grid">
          <ul role="list" className="space-y-4 py-4">
            {conversation.messages.map((message) => (
              <li
                key={message.id}
                className={classNames(
                  "rounded px-4 py-6 shadow sm:px-6",
                  message.is_internal ? "bg-yellow-50" : "bg-white"
                )}
              >
                <div className="sm:flex sm:items-baseline sm:justify-between">
                  <h3 className="inline-flex items-center space-x-2 text-base font-medium">
                    <span
                      className={
                        agents.find((agent) => agent.id == message.sender_id)
                          ? "capitalize text-gray-900"
                          : "text-gray-900"
                      }
                    >
                      {agents.find((agent) => agent.id == message.sender_id)
                        ? message.user_profile.first_name.split("@").shift()
                        : message.user_profile.first_name}
                    </span>

                    {message.is_internal ? (
                      <span className="inline-flex items-center rounded-lg bg-gray-100 px-1.5 py-1 font-brand text-xs font-semibold uppercase text-gray-800">
                        <LockClosedIcon
                          className="-ml-0.5 mr-1 h-3.5 w-3.5 text-tfm-primary"
                          aria-hidden="true"
                        />
                        Internal Note
                      </span>
                    ) : (
                      agents.find(
                        (agent) => agent.id == message.user_profile_id
                      ) && (
                        <span className="inline-flex items-center rounded-lg bg-gray-100 px-1.5 py-1 font-brand text-xs font-semibold uppercase text-gray-800">
                          <CheckBadgeIcon
                            className="-ml-0.5 mr-1 h-4 w-4 text-tfm-primary"
                            aria-hidden="true"
                          />
                          TFM
                        </span>
                      )
                    )}
                  </h3>
                  <p className="mt-1 whitespace-nowrap text-sm text-gray-600 sm:ml-3 sm:mt-0">
                    <time
                      dateTime={message.timestamp}
                      title={localDateTime(message.timestamp)}
                    >
                      {" "}
                      {relativeDate(message.timestamp)}
                    </time>
                  </p>
                </div>
                <div
                  className="prose prose-sm mt-4 space-y-6 text-sm text-gray-800"
                  dangerouslySetInnerHTML={{
                    __html: message.html_content,
                  }}
                />
              </li>
            ))}
          </ul>
        </div>

        <AddMessageForm
          conversationId={params.id}
          user={user}
          subject={conversation.subject}
        />
        <MarkAsRead messageId={params.id} />
      </div>
    </>
  );
}
