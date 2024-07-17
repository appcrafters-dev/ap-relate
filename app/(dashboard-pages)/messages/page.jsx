import {
  getConversationAgents,
  getCurrentUser,
  getSupabaseServerComponentClient,
} from "lib/supabase/supbase.server";

import { LinkButton } from "@/components/ui/buttons";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
import ConversationFilters from "./components/filters";
import ConversationList from "./components/conversation-list";

export default async function MessagesPage({ searchParams }) {
  const supabase = getSupabaseServerComponentClient();
  const user = await getCurrentUser();

  const { assigned_to, status, sort } = searchParams;

  let query = supabase.client
    .from("conversations")
    .select(
      `
      *,
      conversation_read_statuses(*),
      conversation_ccs(*),
      from_details:from_user_profile_id(first_name, last_name, email, avatar_url, id),
      assigned_to:assigned_to_user_profile_id(first_name, last_name, email, avatar_url, id)
    `
    )
    .eq(
      "conversation_read_statuses.user_profile_id",
      user?.profile?.user_profile_id
    );

  if (assigned_to)
    query =
      assigned_to == "none"
        ? query.filter("assigned_to_user_profile_id", "is", null)
        : query.filter("assigned_to_user_profile_id", "eq", assigned_to);

  if (status) query = query.filter("status", "eq", status);

  query = query.order("updated_at", {
    ascending: sort ? sort === "asc" : false,
  });

  const { data: conversations = [], error } = await query;

  const { agents } = await getConversationAgents();

  if (error) throw new Error(error.message);

  // return <pre>{JSON.stringify({ conversations, agents }, null, 2)}</pre>;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <ConversationFilters {...{ searchParams, user, conversations, agents }} />
      <ConversationList conversations={conversations} />
      <LinkButton
        fullWidth
        href="/messages/new"
        primary
        Icon={PencilSquareIcon}
      >
        Compose Message
      </LinkButton>
    </div>
  );
}
