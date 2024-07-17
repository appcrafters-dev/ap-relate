"use client";

import { Button } from "@/components/ui/buttons";
import { ErrorBox } from "@/components/ui/errors";
import { TfmFormHeading, TfmFormSelect } from "@/components/ui/forms";
import { PlusIcon } from "@heroicons/react/24/solid";
import { getSupabaseClientComponentClient } from "lib/supabase/supabase.client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewSessionForm({
  searchParams,
  families = [],
  coaches = [],
  sessions = [],
}) {
  const [formHandler, setFormHandler] = useState({
    error: null,
    loading: false,
  });
  const [form, setForm] = useState({
    family_id: searchParams.family_id ?? "",
    coach_id: searchParams.coach_id ?? "",
    session_id: searchParams.session_id ?? "",
  });

  const supabase = getSupabaseClientComponentClient();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormHandler({ error: null, loading: true });
    const { data, error } = await supabase.client
      .from("family_sessions")
      .insert([
        {
          ...form,
          status: "Planned",
        },
      ])
      .select("id")
      .maybeSingle();
    if (error) {
      return setFormHandler({ error: error.message, loading: false });
    } else {
      console.log(data);
      router.push("/sessions/" + data.id ?? "");
      setFormHandler({ error: null, loading: false });
    }
  };

  return (
    <form className="mx-auto max-w-md space-y-4 p-4" onSubmit={handleSubmit}>
      <TfmFormHeading>New Session</TfmFormHeading>
      <TfmFormSelect
        label="Family"
        id="family_id"
        required
        value={form.family_id}
        onChange={(e) => setForm({ ...form, family_id: e.target.value })}
      >
        <option value="">Select a family</option>
        {families
          .sort((a, b) => a.family_name.localeCompare(b.family_name))
          .map((family) => (
            <option key={family.id} value={family.id}>
              {family.family_name} <small>({family.id})</small>
            </option>
          ))}
      </TfmFormSelect>
      <TfmFormSelect
        label="Coach"
        id="coach_id"
        required
        value={form.coach_id}
        onChange={(e) => setForm({ ...form, coach_id: e.target.value })}
      >
        <option value="">Select a coach</option>
        {coaches
          .sort(
            (a, b) =>
              a.first_name.localeCompare(b.first_name) ||
              a.last_name.localeCompare(b.last_name)
          )
          .map((coach) => (
            <option key={coach.id} value={coach.id}>
              {coach.first_name} {coach.last_name}
            </option>
          ))}
      </TfmFormSelect>
      <TfmFormSelect
        label="Session"
        id="session_id"
        required
        value={form.session_id}
        onChange={(e) => setForm({ ...form, session_id: e.target.value })}
      >
        <option value="">Select a session</option>
        {sessions
          .sort((a, b) => a.number - b.number)
          .map((session) => (
            <option key={session.id} value={session.id}>
              {session.number} - {session.title}
            </option>
          ))}
      </TfmFormSelect>
      <Button type="submit" primary fullWidth Icon={PlusIcon}>
        Add Session
      </Button>
      {formHandler.error && <ErrorBox msg={formHandler.error} />}
    </form>
  );
}
