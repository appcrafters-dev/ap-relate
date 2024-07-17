"use client";

import { Button } from "@/components/ui/buttons";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { getSupabaseClientComponentClient } from "lib/supabase/supabase.client";
import { useState } from "react";

function getAvatar(agent) {
  return agent?.avatar_url ? (
    <img
      src={agent?.avatar_url}
      className="mr-1.5 h-7 w-7 rounded-full object-cover sm:mr-3"
      alt={`${agent?.first_name} ${agent?.last_name} avatar`}
    />
  ) : (
    <span className="mr-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-xs sm:mr-3">
      {agent?.first_name?.charAt(0)}
      {agent?.last_name?.charAt(0)}
    </span>
  );
}

export default function AssignmentSelector({
  agentList = [],
  conversation = null,
  showLabel = false,
  isNew = false,
}) {
  const agent =
    conversation && agentList.length
      ? agentList.find(
          (agent) =>
            agent.user_profile_id == conversation.assigned_to_user_profile_id
        )
      : { first_name: "Unassigned" };

  const [selectedAgent, setSelectedAgent] = useState(
    agent || { first_name: "Unassigned", last_name: "" }
  );

  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseClientComponentClient();

  const handleChange = async (e) => {
    // If the conversation is new, we don't need to update the database
    if (isNew) return setSelectedAgent(e);

    setLoading(true);

    const { error } = await supabase.client
      .from("conversations")
      .update({
        assigned_to_user_profile_id: e.user_profile_id,
      })
      .eq("id", conversation.id)
      .select()
      .single();

    if (error) {
      setLoading(false);
      alert("Sorry, there was an error assigning this conversation.");
    }

    setSelectedAgent(e);
    setLoading(false);
  };

  return (
    <div className="relative w-full max-w-sm">
      <Listbox value={selectedAgent} onChange={handleChange}>
        <Listbox.Label
          className={
            showLabel
              ? "mb-2 block font-subheading text-sm font-semibold uppercase tracking-wider text-tfm-primary-900"
              : "sr-only"
          }
        >
          Assign to
        </Listbox.Label>
        <Listbox.Button
          as={Button}
          loading={loading}
          Icon={() => getAvatar(selectedAgent)}
        >
          {selectedAgent.first_name} {selectedAgent.last_name}
          {/* <UserCircleIcon className="-ml-.5 mr-2 h-5 w-5" aria-hidden="true" /> */}
          <ChevronUpDownIcon className="ml-1.5 h-5 w-5" />
        </Listbox.Button>
        <Listbox.Options className="absolute right-0 z-10 mt-2 grid max-h-60 w-full max-w-sm origin-top-right overflow-auto rounded-l bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          <p className="sticky top-0 border-b bg-gray-50 px-4 py-2 font-subheading text-sm font-semibold uppercase text-gray-900">
            Select an Agent to Assign
          </p>
          {agentList
            .sort((prev, next) =>
              prev.first_name.localeCompare(next.first_name)
            )
            .map((agent) => (
              <Listbox.Option
                key={agent.user_profile_id}
                value={agent}
                className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 hover:text-gray-900"
              >
                <div className="flex items-center">
                  {getAvatar(agent)}
                  <div className="flex flex-col font-semibold">
                    {agent.first_name} {agent.last_name}
                    <span className="text-xs font-normal text-gray-500">
                      {agent.role}
                    </span>
                  </div>
                </div>
              </Listbox.Option>
            ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
}
