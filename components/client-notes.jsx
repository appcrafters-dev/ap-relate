import { LockClosedIcon } from "@heroicons/react/20/solid";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/buttons";
import { ErrorBox } from "@/components/ui/errors";
import { TfmTextEditor } from "@/components/ui/forms";
import Spinner from "@/components/ui/spinner";

export default function ClientNotesForm({ session }) {
  const user = useUser();
  const supabase = createPagesBrowserClient();

  const [formHandlerState, setFormHandlerState] = useState({
    loading: false,
    error: null,
    success: false,
  });

  const [fetchState, setFetchState] = useState({
    loading: true,
    error: null,
  });

  const [form, setForm] = useState({ note: "", id: null });

  // Fetch the note for this user and session
  const fetchNote = async () => {
    setFetchState({ loading: true, error: null });
    const { data, error } = await supabase.client
      .from("client_session_notes")
      .select()
      .eq("user_id", user.id)
      .eq("session_name", session.name)
      .order("created_at", { ascending: false });

    if (error) {
      console.log({ error });
      return setFetchState({ loading: false, error: error.message });
    }

    if (data && data.length) {
      console.log({ data });
      setForm((prev) => ({
        ...prev,
        note: data[0].note,
        id: data[0].id,
      }));
    }
    setFetchState({ loading: false, error: null });
  };

  // Fetch the note on mount
  useEffect(() => {
    fetchNote();
  }, []);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormHandlerState({ ...formHandlerState, success: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormHandlerState({ loading: true, error: null, success: false });

    if (form.id) {
      const { data, error } = await supabase.client
        .from("client_session_notes")
        .update({ note: form.note })
        .eq("id", form.id)
        .select()
        .single();

      if (error) {
        console.log({ error });
        return setFormHandlerState({
          success: false,
          loading: false,
          error: error.message,
        });
      }

      if (data) {
        console.log({ data });
        return setFormHandlerState({
          error: null,
          loading: false,
          success: true,
        });
      }
    }

    const { data, error } = await supabase.client
      .from("client_session_notes")
      .insert({
        user_id: user.id,
        session_name: session.name,
        note: form.note,
      })
      .select()
      .single();

    if (error) {
      console.log({ error });
      return setFormHandlerState({
        success: false,
        loading: false,
        error: error.message,
      });
    }

    if (data) {
      console.log({ data });
      setFormHandlerState({
        error: null,
        loading: false,
        success: true,
      });
      setForm((prev) => ({
        ...prev,
        note: data.note,
        id: data.id,
      }));
    }
  };

  if (fetchState.loading) return <Spinner />;

  if (fetchState.error) return <ErrorBox msg={fetchState.error} />;

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <TfmTextEditor
        id="note"
        value={form.note}
        onChange={(value) => handleChange("note", value)}
        label="Private Notes"
        helpText="These notes are only visible to you."
      />
      <Button type="submit" primary disabled={formHandlerState.loading}>
        {!formHandlerState.loading && (
          <LockClosedIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
        )}
        {formHandlerState.loading ? <Spinner /> : "Save Private Notes"}
      </Button>
      {formHandlerState.error && <ErrorBox msg={formHandlerState.error} />}
      {formHandlerState.success && (
        <ErrorBox msg="Notes saved successfully" success />
      )}
    </form>
  );
}
