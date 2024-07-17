"use client";
import { Button } from "@/components/ui/buttons";
import { ErrorBox } from "@/components/ui/errors";
import {
  TfmAvatarUploader,
  TfmFormColumns,
  TfmFormHeading,
  TfmInput,
  TfmTextArea,
} from "@/components/ui/forms";
import Spinner from "@/components/ui/spinner";
import { phoneFormat } from "lib/utils";

import { useState } from "react";
import { getSupabaseClientComponentClient } from "lib/supabase/supabase.client";

async function updateCoachProfile(coachId, body) {
  const userProfile = {
    first_name: body.first_name,
    last_name: body.last_name,
    phone: body.phone,
    avatar_url: body.avatar_url,
  };

  const coachProfile = {
    short_bio: body.short_bio,
  };

  const supabase = getSupabaseClientComponentClient();

  console.info("- Updating coach profile...", coachId);

  // Update coach profile
  const { data: updatedCoach, error: updateCoachError } = await supabase.client
    .from("coaches")
    .update(coachProfile)
    .eq("id", coachId)
    .select("*, ...user_roles(user_profile_id)")
    .single();

  if (updateCoachError) {
    console.error(
      " - Skipping, Error updating coach profile...",
      updateCoachError
    );

    return { data: null, error: updateCoachError };
  }

  console.info("- Updating user profile...", userProfile);
  // Update User Profile
  const { data: updatedUserProfile, error: userProfileError } =
    await supabase.client
      .from("user_profiles")
      .update(userProfile)
      .eq("id", updatedCoach.user_profile_id)
      .select()
      .single();

  if (userProfileError) {
    console.error(
      " - Skipping, Error updating user profile...",
      userProfileError
    );

    return { data: null, error: userProfileError };
  }

  console.info("- Done!");

  return { data: updatedUserProfile, error: null };
}

export default function CoachProfile({ profile }) {
  const [form, setForm] = useState({
    first_name: profile.first_name,
    last_name: profile.last_name,
    email: profile.email,
    phone: profile.phone || "",
    short_bio: profile.short_bio || "",
  });

  const [formHandlerState, setFormHandlerState] = useState({
    loading: false,
    error: null,
    success: null,
  });

  const [avatar, setAvatar] = useState(profile.avatar_url);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormHandlerState({ loading: true, error: null, success: false });

    const { error } = await updateCoachProfile(profile.id, {
      ...form,
      avatar_url: avatar,
    });

    if (error)
      return setFormHandlerState({
        success: false,
        loading: false,
        error: error.message || "Sorry, there was a problem.",
      });

    setFormHandlerState({
      error: null,
      loading: false,
      success: true,
    });
  };

  return (
    <form className="max-w-lg space-y-8" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <TfmFormHeading>Contact Information</TfmFormHeading>
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
      </div>
      <div className="space-y-4">
        <TfmFormHeading>Coach Profile</TfmFormHeading>
        <TfmAvatarUploader
          src={avatar}
          setSrc={setAvatar}
          label="Avatar"
          fileName={`user-avatar-${profile.id}`}
        />
        <TfmTextArea
          label="Short Bio"
          id="short_bio"
          value={form.short_bio}
          onChange={(e) => setForm({ ...form, short_bio: e.target.value })}
          helpText="Share a little about yourself. Families assigned to you will see this."
        />
      </div>
      <div className="space-y-4">
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
      </div>
    </form>
  );
}
