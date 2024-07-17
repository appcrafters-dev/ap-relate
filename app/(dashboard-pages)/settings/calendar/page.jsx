import { googleCalendar, googleClient } from "lib/google-oauth-client";
import CalendarSettingsPage from "./calendar-page";
import {
  getCurrentUser,
  getSupabaseServerComponentClient,
  isUserRoleRestricted,
} from "lib/supabase/supbase.server";
import { notFound } from "next/navigation";
import { UserRoles } from "lib/models/enums";

async function fetchCalendars(coachId) {
  const supabase = getSupabaseServerComponentClient();

  const { data } = await supabase.client
    .from("calendar_accounts")
    .select()
    .eq("coach_id", coachId);

  const calendarAccounts = [];

  for (const account of data) {
    try {
      googleClient.setCredentials({ refresh_token: account.refresh_token });
      const { data: googleCalendars } =
        await googleCalendar.calendarList.list();

      calendarAccounts.push({
        id: account.id,
        calendars: googleCalendars.items.map((cal) => ({
          id: cal.id,
          name: cal.summary,
        })),
      });
    } catch (err) {
      // TODO: handle expired token
      continue;
    }
  }

  return { data: calendarAccounts, error: null };
}

export default async function Calendar() {
  if (await isUserRoleRestricted(UserRoles.CoachesAndAdmins)) notFound();

  const user = await getCurrentUser();

  const { data } = await fetchCalendars(user.profile.id);

  return <CalendarSettingsPage calendars={data} coach={user.profile} />;
}
