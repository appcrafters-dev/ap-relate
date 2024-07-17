import { googleCalendar, googleClient } from "lib/google-oauth-client";
import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT } from "lib/constants";
import moment from "moment-timezone";
import { NextResponse } from "next/server";
import { getSupabaseRouteHandlerSecretClient } from "lib/supabase/supabase.edge";
import { Novu } from "@novu/node";
import { UserRoles } from "lib/models/enums";

function handleError(message = "Sorry, something went wrong", status = 500) {
  console.error(message);
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req, { params: { familySessionId } }) {
  const body = await req.json();

  for (const key of [
    "startTime",
    "durationMinutes",
    "timeZone",
    "coachId",
    "eventTitle",
    "eventDescription",
    "attendees",
  ]) {
    if (!body[key]) return handleError(`Missing required field: ${key}`, 400);
  }

  const { startTime, coachId } = body;

  const supabase = getSupabaseRouteHandlerSecretClient();

  const { data: coach, error: coachError } = await supabase.client
    .from("user_profiles_view")
    .select("*")
    .eq("id", coachId)
    .maybeSingle();

  if (coachError) return handleError(coachError.message);

  console.debug("coach", coach);

  const { data: calendarAccounts, error: calendarAccountError } =
    await supabase.client
      .from("calendar_accounts")
      .select()
      .eq("coach_id", coachId);

  if (calendarAccountError) return handleError(calendarAccountError.message);

  console.debug("calendarAccounts", calendarAccounts);
  console.debug("default_calendar_id", coach.default_calendar_id);

  const account = calendarAccounts?.find((account) =>
    account.calendar_ids.includes(coach.default_calendar_id)
  );

  if (!account) return handleError("Coach's calendar is not configured");

  googleClient.setCredentials({ refresh_token: account.refresh_token });

  const eventPayload = {
    summary: body.eventTitle,
    description: body.eventDescription,
    attendees: body.attendees
      .filter(
        // Only include attendees with email addresses
        (attendee) => attendee.email
      )
      .map(({ email, displayName }) => ({
        email,
        displayName,
        responseStatus: "needsAction",
      })),
    location: "https://totalfamily.io/v/" + body.shortId,
    start: {
      dateTime: moment(body.startTime).format(),
      timeZone: body.timeZone,
    },
    end: {
      dateTime: moment(body.startTime)
        .add(body.durationMinutes, "minutes")
        .format(),
      timeZone: body.timeZone,
    },
  };

  console.debug("eventPayload", eventPayload);

  let calEvent;

  if (body.googleEventId) {
    calEvent = await googleCalendar.events.update({
      calendarId: coach.default_calendar_id,
      eventId: body.googleEventId,
      sendUpdates: "all",
      requestBody: eventPayload,
    });
  } else {
    calEvent = await googleCalendar.events.insert({
      calendarId: coach.default_calendar_id,
      sendUpdates: "all",
      requestBody: eventPayload,
    });
  }

  if (!calEvent) return handleError("Failed to create calendar event");

  if (calEvent && calEvent.status != 200)
    return handleError(JSON.stringify(calEvent.data));

  const { data: session, error: sessionUpdateError } = await supabase.client
    .from("family_sessions")
    .update({
      google_event_id: calEvent.data.id,
      status: "Scheduled",
      scheduled_time: moment(startTime)
        .tz("UTC")
        .format(`${DEFAULT_DATE_FORMAT} ${DEFAULT_TIME_FORMAT}`),
      attendees: body.attendees,
      primary_email: body.attendees[0].email,
    })
    .eq("id", familySessionId)
    .select("*, ...sessions(*)")
    .single();

  if (sessionUpdateError) return handleError(sessionUpdateError.message);

  const novu = new Novu(process.env.NOVU_API_KEY);

  const { data: family, error: familyError } = await supabase.client
    .from("families")
    .select(
      `
      id,
      coach:assigned_coach_id(...user_profiles_view(*)),
      partner:partner_id(id, company_legal_name, company_logo_url), 
      members:user_profiles_view(*)
    `
    )
    .eq("id", session.family_id)
    .maybeSingle();

  if (!family || familyError)
    return handleError(familyError.message || "Family not found");

  const members = [
    ...family.members.filter(
      (m) => m.role === UserRoles.HeadOfHousehold && m.email
    ),
    coach,
  ];

  await Promise.all(
    members.map(async (member) => {
      await novu
        .trigger("session-scheduled-confirmation", {
          to: {
            subscriberId: member.user_profile_id,
            email: member.email,
            firstName: member.first_name,
            lastName: member.last_name,
          },
          payload: {
            coach,
            session: {
              ...session,
              formatted_scheduled_time: moment
                .utc(session.scheduled_time + "Z")
                .tz(body.timeZone)
                .format("dddd, MMMM Do, YYYY [at] h:mm A z"),
              is_rescheduled: body.googleEventId ? true : false,
            },
            partner: family.partner ? family.partner : null,
          },
        })
        .catch((e) => {
          console.debug(e);
          return handleError("Failed to send email notification");
        });
    })
  );

  moment.tz.setDefault();

  return NextResponse.json({ calEvent, session }, { status: 200 });
}
