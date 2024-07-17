import {
  getCurrentUser,
  getSupabaseRouteHandlerClient,
} from "lib/supabase/supabase.edge";
import { googleCalendar, googleClient } from "lib/google-oauth-client";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { UserRoles } from "lib/models/enums";

export async function GET(req) {
  const supabase = getSupabaseRouteHandlerClient();
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) return NextResponse.json({ error: "No code" }, { status: 400 });

  const user = await getCurrentUser();

  if (!user || !UserRoles.CoachesAndAdmins.includes(user.profile.role)) {
    console.error(
      `Unauthorized user: ${user?.profile?.id} ${user?.profile?.role}`
    );
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // get the refresh token
  const { tokens } = await googleClient.getToken(code);
  console.log("tokens", tokens);

  // get the calendar ID from google
  googleClient.setCredentials(tokens);
  const { data: calendarList } = await googleCalendar.calendarList.list();
  console.log("calendarList", calendarList);

  // delete the old refresh token if calendar ids exist in the db
  const { error: deleteError } = await supabase.client
    .from("calendar_accounts")
    .delete()
    .eq("coach_id", user.profile.coach_id)
    .in(
      "calendar_ids",
      calendarList.items.map((cal) => cal.id)
    );

  if (deleteError) console.error("deleteError", deleteError);

  if (tokens.refresh_token) {
    const { error } = await supabase.client.from("calendar_accounts").insert({
      coach_id: user.profile.id,
      refresh_token: tokens.refresh_token,
      calendar_ids: calendarList.items.map((cal) => cal.id),
    });

    if (error) return NextResponse.json({ error: error }, { status: 500 });
  }

  return redirect("/settings/calendar");
}
