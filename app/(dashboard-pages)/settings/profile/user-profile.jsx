"use client";
import { Button } from "@/components/ui/buttons";
import { ErrorBox } from "@/components/ui/errors";
import {
  TfmAvatarUploader,
  TfmCheckbox,
  TfmFormColumns,
  TfmFormHeading,
  TfmInput,
} from "@/components/ui/forms";
import Spinner from "@/components/ui/spinner";
import { phoneFormat } from "lib/utils";

import { useState } from "react";
import { getSupabaseClientComponentClient } from "lib/supabase/supabase.client";
import Link from "next/link";

function getContactUrl(email) {
  const params = new URLSearchParams();
  params.set("subject", "Change Email Request");
  params.set(
    "message",
    `I would like to change my email address from ${email} to: `
  );
  return "/messages/new?" + params.toString();
}

export default function UserProfile({ profile }) {
  const [form, setForm] = useState({
    first_name: profile.first_name,
    last_name: profile.last_name,
    email: profile.email,
    phone: profile.phone,
    allow_sms: profile.allow_sms,
  });

  const [formHandlerState, setFormHandlerState] = useState({
    loading: false,
    error: null,
    success: false,
  });

  const [avatar, setAvatar] = useState(profile.avatar_url);

  const supabase = getSupabaseClientComponentClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormHandlerState({ loading: true, error: null, success: false });

    const { error } = await supabase.client
      .from("user_profiles")
      .update({
        ...form,
        avatar_url: avatar,
      })
      .eq("id", profile.user_profile_id);

    if (error)
      return setFormHandlerState({
        success: false,
        loading: false,
        error: error.message || "Sorry, something went wrong.",
      });

    return setFormHandlerState({
      error: null,
      loading: false,
      success: true,
    });
  };

  const contactUrl = getContactUrl(profile.email);

  return (
    <form className="max-w-lg space-y-4" onSubmit={handleSubmit}>
      <TfmFormHeading>Profile</TfmFormHeading>
      <TfmFormColumns>
        <TfmInput
          label="First Name"
          id="first_name"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
        />
        <TfmInput
          label="Last Name"
          id="last_name"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
        />
      </TfmFormColumns>
      <TfmInput
        label="Email"
        id="email"
        type="email"
        defaultValue={form.email}
        helpText={
          <>
            If you need to change your email address, please{" "}
            <Link href={contactUrl}>send us a message</Link>.
          </>
        }
        disabled
      />
      <TfmInput
        label="Phone"
        id="phone"
        type="tel"
        value={form.phone}
        onChange={(e) =>
          setForm({ ...form, phone: phoneFormat(e.target.value) })
        }
      />
      <TfmAvatarUploader
        src={avatar}
        setSrc={setAvatar}
        label="Avatar"
        fileName={`user-avatar-${profile.id}`}
      />
      <TfmFormHeading>Notifications</TfmFormHeading>
      <TfmCheckbox
        label="Allow us to send text messages to my phone number above for important updates and reminders (standard messaging rates apply). We will never share your phone number with third parties or use it for marketing purposes."
        id="allow_sms"
        checked={form.allow_sms}
        onChange={(e) =>
          setForm({ ...form, allow_sms: e.target.checked ? true : false })
        }
      />
      <Button type="submit" primary disabled={formHandlerState.loading}>
        {formHandlerState.loading ? <Spinner /> : "Save Profile"}
      </Button>
      {(formHandlerState.error || formHandlerState.success) && (
        <ErrorBox
          msg={
            formHandlerState.error
              ? formHandlerState.error
              : "Profile updated successfully"
          }
          success={formHandlerState.success}
        />
      )}
    </form>
  );
}
