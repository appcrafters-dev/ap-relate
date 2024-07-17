import { Button, LinkButton } from "@/components/ui/buttons";
import { TfmFormSelect, TfmInput, TfmTextEditor } from "@/components/ui/forms";

import { getConversationAgents, hasRole } from "lib/supabase/supbase.server";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import { startConversation } from "../actions";
import AssignmentSelector from "./assign-selector";
import { UserRoles } from "lib/models/enums";

export default async function NewConversationForm({ searchParams }) {
  const { subject, message } = searchParams;
  const { agents, error } = await getConversationAgents();
  const showInternal = await hasRole(UserRoles.CoachesAndAdmins);

  if (error) throw new Error(error.message);

  return (
    <form className="mx-auto max-w-xl space-y-4" action={startConversation}>
      <h1 className="text-2xl font-semibold">New Message</h1>
      <TfmInput id="subject" label="Subject" defaultValue={subject} />
      <TfmTextEditor id="html_content" label="Message" defaultValue={message} />
      <div className="flex w-full">
        <AssignmentSelector agentList={agents} isNew showLabel />
      </div>
      {showInternal && (
        <TfmFormSelect id="is_internal" label="Is Internal">
          <option value="false">Public</option>
          <option value="true">Internal Note</option>
        </TfmFormSelect>
      )}
      <Button type="submit" fullWidth primary Icon={PaperAirplaneIcon}>
        Send
      </Button>
      <LinkButton href="/messages" fullWidth>
        Cancel
      </LinkButton>
    </form>
  );
}
