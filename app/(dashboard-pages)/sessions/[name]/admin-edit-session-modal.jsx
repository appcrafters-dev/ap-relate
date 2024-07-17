"use client";

import { Button } from "@/components/ui/buttons";
import { useEffect, useState } from "react";
import Modal from "../../components/modal";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { TfmFormHeading, TfmFormSelect } from "@/components/ui/forms";
import { getSupabaseClientComponentClient } from "lib/supabase/supabase.client";
import { SessionStatus } from "lib/models/enums";
import { useRouter } from "next/navigation";
import { ErrorBox } from "@/components/ui/errors";

export default function AdminEditSessionModal({ session }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: session.id || "",
    coach_id: session.coach_id || "",
    status: session.status || "",
  });
  const supabase = getSupabaseClientComponentClient();
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase.client
      .from("coaches")
      .select("id, ...user_roles(*, ...user_profiles(first_name, last_name))")
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
        } else {
          setCoaches(data);
          setForm({
            id: session.id || "",
            coach_id: session.coach_id || "",
            status: session.status || "",
          });
        }
      });
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.client
      .from("family_sessions")
      .update({ coach_id: form.coach_id, status: form.status })
      .eq("id", session.id);
    if (error) {
      setError(error.message);
    } else {
      setOpen(false);
      window.location.reload();
    }
    setLoading(false);
  };

  const router = useRouter();

  const handleDelete = async () => {
    if (session.status !== SessionStatus.Planned) {
      return setError("Only sessions with a Planned status can be deleted.");
    }
    if (
      !confirm(
        "Are you sure you want to delete this session? This action cannot be undone."
      )
    ) {
      return;
    }
    setLoading(true);
    const { error } = await supabase.client
      .from("family_sessions")
      .delete()
      .eq("id", session.id);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setOpen(false);
      setLoading(false);
      // go back to the previous page
      router.back();
    }
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)} primary Icon={LockClosedIcon}>
        Edit
      </Button>
      <Modal open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <TfmFormHeading>Edit Session</TfmFormHeading>
          <TfmFormSelect
            label="Coach"
            id="coach_id"
            value={form.coach_id}
            onChange={handleChange}
            disabled={form.status !== SessionStatus.Planned}
          >
            <option value="">Select a coach</option>
            {coaches.map((coach) => (
              <option key={coach.id} value={coach.id}>
                {coach.first_name} {coach.last_name}
              </option>
            ))}
          </TfmFormSelect>
          <TfmFormSelect
            label="Status"
            id="status"
            value={form.status}
            onChange={handleChange}
            disabled={form.status === SessionStatus.Scheduled}
          >
            {Object.values(SessionStatus)
              .filter((status) => status !== SessionStatus.Scheduled)
              .map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
          </TfmFormSelect>
          <Button type="submit" primary>
            Save
          </Button>
          {error && <ErrorBox msg={error} />}
        </form>
        <div className="space-y-4 p-4">
          <TfmFormHeading>Delete Session</TfmFormHeading>
          <p>Warning: this action cannot be undone.</p>
          <Button danger onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
