import { isUserRoleRestricted } from "lib/supabase/supbase.server";
import { UserRoles } from "lib/models/enums";
import { notFound } from "next/navigation";
import { dailyApi } from "lib/daily-video-server-client";
import Transcript from "./transcript-page";
import WebVTT from "node-webvtt";

export const metadata = {
  title: "Transcript",
};

async function getTranscript(id) {
  return await dailyApi(`/transcript/${id}/access-link`);
}

export default async function TranscriptPage({ params }) {
  if (await isUserRoleRestricted(UserRoles.CoachesAndAdmins)) notFound();

  const { data } = await getTranscript(params.id);

  // Download the .vtt file
  const response = await fetch(data.link);
  const vttText = await response.text();

  // Parse the .vtt file
  const vtt = WebVTT.parse(vttText);

  return <Transcript cues={vtt.cues} />;
}
