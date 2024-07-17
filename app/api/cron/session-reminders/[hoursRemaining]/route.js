import { Novu } from "@novu/node";
import { localDateTime } from "lib/date";
import { SessionStatus } from "lib/models/enums";
import { getSupabaseRouteHandlerSecretClient } from "lib/supabase/supabase.edge";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ALLOWED_HOURS_REMAINING = ["168", "120", "24"];
const TOLERANCE_IN_MINUTES = 15;

const MINUTE_IN_MILLISECONDS = 60 * 1000;
const HOUR_IN_MILLISECONDS = 60 * MINUTE_IN_MILLISECONDS;
const TOLERANCE_IN_MILLISECONDS = TOLERANCE_IN_MINUTES * MINUTE_IN_MILLISECONDS;

export async function GET(req, { params }) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`)
    return new NextResponse("Unauthorized", {
      status: 401,
    });

  const { hoursRemaining } = params;

  if (!ALLOWED_HOURS_REMAINING.includes(hoursRemaining))
    return NextResponse.json(
      { error: "Invalid hours remaining" },
      { status: 400 }
    );

  const now = new Date();

  // Lower bound is the current time plus the hours remaining minus the tolerance
  const lowerBound = new Date(
    now.getTime() +
      hoursRemaining * HOUR_IN_MILLISECONDS -
      TOLERANCE_IN_MILLISECONDS
  );

  // Upper bound is the current time plus the hours remaining plus the tolerance
  const upperBound = new Date(
    now.getTime() +
      hoursRemaining * HOUR_IN_MILLISECONDS +
      TOLERANCE_IN_MILLISECONDS +
      HOUR_IN_MILLISECONDS
  );

  const triggerNames = {
    168: "session-reminder-one-week",
    120: "session-reminder-five-days",
    24: "session-reminder-one-day",
    // 1: "session-reminder-one-hour",
  };

  const supabase = getSupabaseRouteHandlerSecretClient();
  const { data: sessions, error: sessionsError } = await supabase.client
    .from("family_sessions")
    .select(
      `
    id,
    short_id,
    _frappe_id,
    status,
    scheduled_time,
    family_id,
    session:sessions(title, description), 
    coach:coaches(*, ...user_roles(*, ...user_profiles(email, first_name, last_name))),
    family:families(id, family_members:family_members(*,...user_roles(...user_profiles(email, first_name, last_name))))
    `
    )
    .eq("status", SessionStatus.Scheduled)
    .gte("scheduled_time", lowerBound.toISOString())
    .lte("scheduled_time", upperBound.toISOString())
    .or(
      `last_reminder_in_hours.is.null,last_reminder_in_hours.neq.${hoursRemaining}`
    );

  if (sessionsError)
    return NextResponse.json({ error: sessionsError }, { status: 500 });

  if (!sessions || sessions.length === 0)
    return NextResponse.json({ status: 200 });

  const novu = new Novu(process.env.NOVU_API_KEY);

  for (const session of sessions) {
    const members = [
      ...session.family.family_members.filter(
        (m) => m.role === "Head of Household" && m.email
      ),
      session.coach,
    ];
    const { coach, family, partner } = session;

    const triggerPayloads = members.map((member) => ({
      name: triggerNames[hoursRemaining],
      to: {
        subscriberId: member.user_profile_id,
        email: member.email,
        firstName: member.first_name,
        lastName: member.last_name,
      },
      payload: {
        session: {
          ...session,
          formatted_scheduled_time: localDateTime(session.scheduled_time + "Z"),
        },
        partner: partner ? partner : null,
        coach,
        family,
      },
    }));

    await novu.events
      .bulkTrigger(triggerPayloads)
      .catch((e) => console.debug(e));

    await supabase.client
      .from("family_sessions")
      .update({ last_reminder_in_hours: hoursRemaining })
      .eq("id", session.id);
  }

  return NextResponse.json({ status: 200 });
}
