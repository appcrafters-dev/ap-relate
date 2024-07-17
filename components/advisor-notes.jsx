import { LockClosedIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { Button } from "@/components/ui/buttons";
import { ErrorBox } from "@/components/ui/errors";
import { TfmFormSelect, TfmTextEditor } from "@/components/ui/forms";
import Spinner from "@/components/ui/spinner";
import { getSupabaseClientComponentClient } from "lib/supabase/supabase.client";

export default function AdvisorNotesForm({ session }) {
  const stripClasses = (html) => {
    return html
      ? html.replace(/<div class="ql-editor read-mode">|<\/div>/g, "")
      : "";
  };

  const [formHandlerState, setFormHandlerState] = useState({
    loading: false,
    error: null,
    success: false,
  });

  const [form, setForm] = useState({
    call_summary: stripClasses(session.call_summary),
    coach_insights: stripClasses(session.coach_insights),
    coach_suggestions: stripClasses(session.coach_suggestions),
    status: session.status,
  });

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormHandlerState({ ...formHandlerState, success: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormHandlerState({ loading: true, error: null, success: false });
    const { data, error } = await updateFamilySession(session.id, form);

    if (error)
      return setFormHandlerState({
        success: false,
        loading: false,
        error: error.message || "Something went wrong",
      });

    setFormHandlerState({
      error: null,
      loading: false,
      success: true,
    });

    setForm((prev) => ({
      ...prev,
      call_summary: stripClasses(data.call_summary),
      coach_insights: stripClasses(data.coach_insights),
      coach_suggestions: stripClasses(data.coach_suggestions),
      status: data.status,
    }));
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <TfmTextEditor
        id="call_summary"
        value={form.call_summary}
        onChange={(value) => handleChange("call_summary", value)}
        label="Call Summary"
        helpText="2-3 paragraphs, or bullet points"
      />
      <TfmTextEditor
        id="coach_insights"
        value={form.coach_insights}
        onChange={(value) => handleChange("coach_insights", value)}
        label="Coach Insights"
        helpText="Anything that was said that you'd like to highlight or unsaid that you think is worth noting here"
      />
      <TfmTextEditor
        id="coach_suggestions"
        value={form.coach_suggestions}
        onChange={(value) => handleChange("coach_suggestions", value)}
        label="Coach Suggestions"
        helpText="Your thoughts on things this family might benefit from at TFM, future topics we need to cover, any other ideas, etc."
      />
      {session.status === "Planned" || session.status === "Scheduled" ? (
        <TfmFormSelect
          name="status"
          value={form.status}
          onChange={(e) => handleChange("status", e.target.value)}
          label="Session Status"
          helpText={`If you've completed the session with the family, please select Completed here, otherwise leave it as ${session.status}`}
        >
          <option value={session.status}>{session.status}</option>
          <option value="Completed">Completed</option>
        </TfmFormSelect>
      ) : null}
      <Button type="submit" primary disabled={formHandlerState.loading}>
        {!formHandlerState.loading && (
          <LockClosedIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
        )}
        {formHandlerState.loading ? <Spinner /> : "Save Coach Notes"}
      </Button>
      {formHandlerState.error && <ErrorBox msg={formHandlerState.error} />}
      {formHandlerState.success && (
        <ErrorBox msg="Coach Notes saved successfully" success />
      )}
    </form>
  );
}

export function updateFamilySession(id, body) {
  const sessionFields = {
    call_summary: body.call_summary,
    coach_insights: body.coach_insights,
    coach_suggestions: body.coach_suggestions,
    status: body.status,
  };

  const supabase = getSupabaseClientComponentClient();

  return supabase.client
    .from("family_sessions")
    .update(sessionFields)
    .eq("id", id)
    .select()
    .single();
}
