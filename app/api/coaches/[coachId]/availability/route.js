import { googleCalendar, googleClient } from "lib/google-oauth-client";
import {
  generateAvailableTimeSlots,
  changeWorkingHoursTimezone,
} from "lib/date";

import moment from "moment-timezone";
import {
  getCurrentUser,
  getSupabaseRouteHandlerSecretClient,
} from "lib/supabase/supabase.edge";
import { NextResponse } from "next/server";

export async function POST(req, { params: { coachId } }) {
  const supabase = getSupabaseRouteHandlerSecretClient();
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();

  // request body validation
  for (const key of ["startTime", "endTime", "timeZone", "sessionDuration"]) {
    if (!body[key]) {
      console.log(`${key} is required`);
      return NextResponse.json(
        { error: `${key} is required` },
        { status: 400 }
      );
    }
  }

  let { startTime, endTime, timeZone, sessionDuration } = body;

  // all times created should be in the user's timezone
  moment.tz.setDefault(timeZone);

  startTime = moment(startTime);
  endTime = moment(endTime);

  const { data: calendarCredentials, error: credError } = await supabase.client
    .from("calendar_accounts")
    .select()
    .eq("coach_id", coachId);

  const { data: coach, error: coachError } = await supabase.client
    .from("user_profiles_view")
    .select("*")
    .eq("id", coachId)
    .maybeSingle();

  console.log("coach", coach);

  if (credError || coachError) {
    return NextResponse.json(
      { error: credError || coachError },
      { status: 500 }
    );
  }

  const { working_hours, timezone: advisorTimeZone, minimum_notice } = coach;
  const busyHours = [];

  for (const credential of calendarCredentials) {
    try {
      googleClient.setCredentials({ refresh_token: credential.refresh_token });

      const { data: calendarList } = await googleCalendar.calendarList.list();

      // filter out the calendar_ids that are not in the advisor's selected calendars
      const filteredCalendarList = calendarList.items.filter((cal) =>
        coach.selected_calendar_ids.includes(cal.id)
      );

      const { data: freeBusy } = await googleCalendar.freebusy.query({
        requestBody: {
          timeMin: startTime.clone(),
          timeMax: endTime.clone(),
          timeZone,
          items: filteredCalendarList.map((cal) => ({
            id: cal.id,
          })),
        },
      });

      for (const calendarId in freeBusy.calendars) {
        const { busy, errors } = freeBusy.calendars[calendarId];

        // TODO: handle errors
        if (errors) console.log(calendarId, errors);

        busyHours.push(...busy);
      }
    } catch (error) {
      // TODO: handle expired token
      console.error("Caught error:", error);
      continue;
    }
  }

  // working hours converted to the user's timezone
  const workingHours = changeWorkingHoursTimezone(
    working_hours,
    advisorTimeZone,
    timeZone
  );

  const availableTimeSlots = generateAvailableTimeSlots(
    startTime,
    endTime,
    sessionDuration,
    workingHours,
    busyHours,
    minimum_notice
  );

  // reset timezone to default
  moment.tz.setDefault();

  // if troubleshoot is true, return all the data
  if (body.troubleshoot) {
    // check if the advisorId matches the user's id
    const user = await getCurrentUser();

    if (user.id !== body.advisorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    } else {
      return NextResponse.json(
        {
          data: {
            advisorSettings: user.profile,
            busyHours,
            availableTimeSlots,
          },
        },
        { status: 200 }
      );
    }
  }

  // otherwise, return only the available time slots
  return NextResponse.json(availableTimeSlots, { status: 200 });
}
