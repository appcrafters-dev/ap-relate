"use client";

import { ArrowLeftOnRectangleIcon, CheckIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { Button, LinkButton } from "@/components/ui/buttons";
import { TfmStarRating, TfmTextArea } from "@/components/ui/forms";
import {
  getCurrentUser,
  getSupabaseClientComponentClient,
} from "lib/supabase/supabase.client";

const defaultHandlerState = {
  loading: false,
  error: null,
  success: false,
};

export default function VideoCallReview({ room, userName }) {
  const [form, setForm] = useState({
    rating: 0,
    feedback: "",
  });

  const [formHandler, setFormHandler] = useState(defaultHandlerState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormHandler({ ...defaultHandlerState, loading: true });

    const user = await getCurrentUser();

    const body = {
      family_session_id: room,
      user_id: user ? user.id : null,
      // display_name: userName,
      ...form,
    };
    const { error } = await insertReview(body);

    if (error) {
      console.error(error);
      return setFormHandler({
        ...defaultHandlerState,
        error,
      });
    }

    setFormHandler({ ...defaultHandlerState, success: true });
  };

  return formHandler.success ? (
    <div className="z-50 mx-auto flex w-full max-w-md flex-col space-y-4 p-4">
      <p className="text-center">Thank you for your feedback!</p>
      <LinkButton primary href="/dashboard">
        Return to your dashboard
      </LinkButton>
    </div>
  ) : (
    <form className="space-y-4 py-4" onSubmit={handleSubmit}>
      <TfmStarRating
        id="rating"
        label="How would you rate this session?"
        value={form.rating}
        onChange={(val) => {
          setForm((prev) => ({ ...prev, rating: val }));
        }}
        required
      />
      <TfmTextArea
        id="feedback"
        label="Comments"
        value={form.feedback}
        onChange={(e) => {
          setForm((prev) => ({ ...prev, feedback: e.target.value }));
        }}
        helpText="Please provide any additional feedback here."
      />
      <Button
        type="submit"
        loading={formHandler.loading}
        Icon={CheckIcon}
        primary
      >
        Submit Feedback
      </Button>
      <Button
        onClick={() => window.location.reload()}
        Icon={ArrowLeftOnRectangleIcon}
      >
        Join again
      </Button>
    </form>
  );
}

function insertReview(body) {
  const supabase = getSupabaseClientComponentClient();
  return supabase.client.from("session_reviews").insert(body);
}
