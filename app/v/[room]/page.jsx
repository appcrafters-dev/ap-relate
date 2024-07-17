import { getCurrentUser } from "lib/supabase/supbase.server";
import {
  generateDailyToken,
  getDailyRoom,
} from "lib/daily-video-server-client";
import { isUuid } from "lib/utils";
import RoomPage from "./room-page";
import VideoCallMessage from "@/components/video-call-layout";
import { getSupabaseRouteHandlerSecretClient } from "lib/supabase/supabase.edge";
import { UserRoles } from "lib/models/enums";

async function getRoomData(roomId) {
  const supabase = getSupabaseRouteHandlerSecretClient();

  const query = supabase.client
    .from("family_sessions")
    .select(
      `id, _frappe_id, short_id, status, ...sessions(title), scheduled_time, family:family_id(id, family_name, status)`
    );

  if (isUuid(roomId)) {
    query.eq("id", roomId);
  } else {
    query.or(`short_id.eq.${roomId}, _frappe_id.eq.${roomId}`);
  }

  const { data: session, error } = await query.maybeSingle();

  if (error || !session)
    return { error: error || "Session not found", data: null };

  const { room, error: roomError } = await getDailyRoom(session.id);

  if (roomError) return { error: roomError, data: null };

  return { data: { session, room }, error: null };
}

function getTokenForUser(user, roomId) {
  if (
    user &&
    user.profiles.some((p) => UserRoles.CoachesAndAdmins.includes(p.role))
  ) {
    const fullName = user.profile?.first_name
      ? `${user.profile.first_name} ${user.profile.last_name}`
      : "Coach";
    return generateDailyToken(roomId, fullName, true);
  }
  return null;
}

export default async function ShowRoomPage({ params }) {
  const user = await getCurrentUser();

  const { data, error } = await getRoomData(params.room);

  if (error) {
    return (
      <VideoCallMessage
        show={true}
        message={error.message || error}
        title="Oops! There was a problem."
        returnTo={{
          href: "/sessions",
          text: "View all sessions",
        }}
      />
    );
  }

  const token = await getTokenForUser(user, data.room?.name);

  return (
    <RoomPage roomName={data.room.name} token={token} session={data.session} />
  );
}
