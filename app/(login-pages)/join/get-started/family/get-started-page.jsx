"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HomeIcon } from "@heroicons/react/20/solid";
import { Button } from "@/components/ui/buttons";
import { ErrorBox } from "@/components/ui/errors";
import {
  TfmAvatarUploader,
  TfmFormColumns,
  TfmFormSelect,
  TfmInput,
} from "@/components/ui/forms";
import { getSupabaseClientComponentClient } from "lib/supabase/supabase.client";
import { phoneFormat } from "lib/utils";

export default function FamilyGetStartedPage({ profile, user, lifePhases }) {
  const supabase = getSupabaseClientComponentClient();
  const router = useRouter();
  console.log("profile", profile);

  const [form, setForm] = useState({
    first_name: profile.first_name || "",
    last_name: profile.last_name || "",
    phone: profile.phone || "",
    birth_date: profile.birth_date || "",
    occupation: profile.occupation || "",
    life_phase_id: null,
  });

  const [formHandlerState, setFormHandlerState] = useState({
    loading: false,
    error: null,
  });

  const [avatar, setAvatar] = useState(profile.avatar_url);

  const upsertUserProfile = async (args) => {
    const { data, error } = await supabase.client
      .from("user_profiles")
      .upsert(args)
      .select()
      .single();

    if (error) throw error;

    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormHandlerState({ loading: true, error: null });

    const args = {
      ...(profile.user_profile_id && { id: profile.user_profile_id }),
      user_id: user.id,
      avatar_url: avatar,
      email: user.email,
      ...form,
    };

    delete args.life_phase_id;

    try {
      const userProfile = await upsertUserProfile(args);
      const { error: newFamilyError } = await supabase.client.rpc(
        "onboard_new_family",
        {
          user_profile_id: userProfile.id,
          family_name: userProfile.last_name,
          life_phase_id: form.life_phase_id,
        }
      );

      if (newFamilyError) throw newFamilyError;

      router.push("/dashboard");
      setFormHandlerState({
        error: null,
        loading: false,
      });
    } catch (error) {
      setFormHandlerState({
        loading: false,
        error: error.message || "Sorry, something went wrong.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="font-brand text-4xl font-bold italic text-tfm-primary">
        Complete your profile
      </h1>
      <p className="text-gray-500">
        Let us get to know you a little better. Please provide your personal
        information below.
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <TfmFormColumns>
          <TfmInput
            label="First Name"
            id="first_name"
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            required
          />
          <TfmInput
            label="Last Name"
            id="last_name"
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            required
          />
        </TfmFormColumns>
        <TfmFormColumns>
          <TfmInput
            label="Phone"
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: phoneFormat(e.target.value) })
            }
          />
          <TfmInput
            label="Birthday"
            id="birth_date"
            type="date"
            value={form.birth_date}
            onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
            required
          />
        </TfmFormColumns>
        <TfmInput
          label="Occupation"
          id="occupation"
          value={form.occupation}
          onChange={(e) => setForm({ ...form, occupation: e.target.value })}
          required
        />
        <TfmAvatarUploader
          src={avatar}
          setSrc={setAvatar}
          label="Choose a Profile Picture"
          fileName={`user-avatar-${profile.id}`}
        />
        <TfmFormSelect
          id="life_phase_id"
          label="Life Phase"
          value={form.life_phase_id}
          helpText={
            !form.life_phase_id
              ? "How would you describe your family's current life phase?"
              : lifePhases.find((phase) => phase.id === form.life_phase_id)
                  ?.description
          }
          onChange={(e) => {
            setForm({
              ...form,
              life_phase_id: e.target.value,
            });
          }}
        >
          <option></option>
          {lifePhases.map((phase) => (
            <option key={phase.id} value={phase.id}>
              {phase.title}
            </option>
          ))}
        </TfmFormSelect>
        {formHandlerState.error && <ErrorBox msg={formHandlerState.error} />}
        <Button
          type="submit"
          primary
          fullWidth
          loading={formHandlerState.loading}
          Icon={HomeIcon}
        >
          Continue to Dashboard
        </Button>
      </form>
    </div>
  );
}
