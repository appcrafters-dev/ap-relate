import {
  getSupabaseServerComponentClient,
  hasRole,
} from "lib/supabase/supbase.server";
import {
  dailyApi,
  getDailyRoomRecordings,
  getDailyRoomTranscriptions,
} from "lib/daily-video-server-client";
import { UserRoles } from "lib/models/enums";
import { notFound } from "next/navigation";
import FamilySession from "./family-workshop";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { data } = await getFamilySession(params.name);

  return {
    title: `Session - ${data?.session?.title} - Total Family Management`,
  };
}

async function getFamilySession(familySessionId) {
  const supabase = getSupabaseServerComponentClient();

  return supabase.client
    .from("family_sessions")
    .select(
      `*,
      calendar_quarter:planned_quarter_id(*),
      session:sessions(*, life_phases(title)),
      coach:coaches(*, ...user_roles(*, ...user_profiles(first_name, last_name)))
      `
    )
    .eq("id", familySessionId)
    .maybeSingle();
}

function getFamilySessionRecordings(name) {
  return dailyApi(`/recordings?room_name=${name}`);
}

export default async function SessionPage({ params }) {
  const isAdmin = await hasRole(UserRoles.CoachesAndAdmins);
  const { data: familySession, error } = await getFamilySession(params.name);

  if (error) {
    console.error("ERROR - getFamilySession:", error);
    return <p>Something went wrong, please try again later.</p>;
  }

  if (!familySession) return notFound();

  const recordings = isAdmin
    ? await getDailyRoomRecordings(familySession)
    : null;
  const transcripts = isAdmin
    ? await getDailyRoomTranscriptions(params.name)
    : [];
  if (transcripts && transcripts.length > 0) {
    recordings.transcripts = transcripts;
  }

  return (
    <FamilySession
      isAdmin={isAdmin}
      recordings={recordings}
      session={familySession}
    />
  );
}
