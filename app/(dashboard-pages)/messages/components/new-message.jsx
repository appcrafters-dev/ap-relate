"use client";

import { Button } from "@/components/ui/buttons";
import { TfmFormSelect, TfmTextEditor } from "@/components/ui/forms";
import { isAdminRole } from "lib/utils";
import { AddMessage } from "../[id]/actions";
import { ArrowUturnLeftIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

export default function AddMessageForm({ conversationId, subject, user }) {
  const addMessageWithId = AddMessage.bind(null, conversationId);
  const isAdmin = isAdminRole(user.app_metadata.role);

  const [isInternal, setIsInternal] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { message: newMessage } = await addMessageWithId(formData);
    resetForm();
    if (newMessage) window.location.reload();
  };

  const resetForm = () => {
    setIsInternal(false);
    setMessage("");
    setLoading(false);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        type="hidden"
        name="subject"
        id="subject"
        defaultValue={subject || null}
      />
      <TfmTextEditor
        id="html_content"
        label={isInternal ? "Add an internal note" : "Add a comment"}
        value={message}
        onChange={(value) => setMessage(value)}
      />
      {isAdmin && (
        <TfmFormSelect
          id="is_internal"
          label="Visibility"
          helpText="Only Coaches and Admins can view internal notes."
          value={isInternal}
          onChange={(e) => setIsInternal(e.target.value)}
        >
          <option value="false">Public</option>
          <option value="true">Internal Note</option>
        </TfmFormSelect>
      )}
      <div className="flex justify-end">
        <Button
          type="submit"
          fullWidth
          primary
          Icon={ArrowUturnLeftIcon}
          loading={loading}
        >
          Reply
        </Button>
      </div>
    </form>
  );
}
