import {
  dailyApi,
  getDailyRoomTranscriptions,
} from "lib/daily-video-server-client";
import {
  getSupabaseServerComponentClient,
  isUserRoleRestricted,
} from "lib/supabase/supbase.server";
import RecordingPage from "./recordings-page";
import WebVTT from "node-webvtt";
import { UserRoles } from "lib/models/enums";
import { notFound } from "next/navigation";
import { isUuid } from "lib/utils";

export const metadata = {
  title: "Recording",
};

async function getRecordingLink(id) {
  return await dailyApi(`/recordings/${id}/access-link`);
}

async function getRecordingAndTranscripts(id) {
  const { data: recordingData } = await dailyApi(`/recordings/${id}`);

  const transcripts = await getDailyRoomTranscriptions(recordingData.room_name);
  const filteredTranscripts = transcripts.filter(
    (t) => t.mtgSessionId === recordingData.mtgSessionId
  );
  const transcriptData = filteredTranscripts.length
    ? filteredTranscripts[0]
    : null;

  if (transcriptData?.transcriptId) {
    const { data: transcript } = await dailyApi(
      `/transcript/${transcriptData.transcriptId}/access-link`
    );
    transcriptData.link = transcript.link;
  }

  return { recordingData, transcriptData };
}

async function getVttTranscriptCues(url) {
  // Download the .vtt file
  const response = await fetch(url);
  const vttText = await response.text();

  // Parse the .vtt file
  const vtt = WebVTT.parse(vttText);

  return vtt.cues || [];
}

export default async function Recording({ params }) {
  if (await isUserRoleRestricted(UserRoles.CoachesAndAdmins)) notFound();

  const { data } = await getRecordingLink(params.id);
  const { recordingData, transcriptData } = await getRecordingAndTranscripts(
    params.id
  );

  console.log("recordingData", recordingData);
  console.log("transcriptData", transcriptData);

  const supabase = getSupabaseServerComponentClient();
  const query = supabase.client
    .from("family_sessions")
    .select(
      `id, _frappe_id, short_id, status, ...sessions(title), scheduled_time, family:family_id(id, family_name, status)`
    );

  if (isUuid(recordingData?.room_name)) {
    query.eq("id", recordingData?.room_name);
  } else {
    query.or(
      `short_id.eq.${recordingData?.room_name}, _frappe_id.eq.${recordingData?.room_name}`
    );
  }

  const { data: sessionData, error: sessionError } = await query.maybeSingle();

  console.log("sessionData", sessionData);
  console.log("sessionError", sessionError);

  const cues = transcriptData
    ? await getVttTranscriptCues(transcriptData.link)
    : [];

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <RecordingPage
        recordingAccessLink={data.download_link}
        transcriptCues={cues}
        sessionData={sessionData}
      />
    </div>
  );
}
