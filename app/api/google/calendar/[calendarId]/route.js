import { googleClient } from "lib/google-oauth-client";
import { getSupabaseRouteHandlerClient } from "lib/supabase/supabase.edge";
import { NextResponse } from "next/server";

export async function DELETE(req, { params: { calendarId } }) {
  console.info("Revoking calendar account...", calendarId);
  const supabase = getSupabaseRouteHandlerClient();

  const { data: calendarAccount, error } = await supabase.client
    .from("calendar_accounts")
    .select()
    .eq("id", calendarId)
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching calendar account", error);
    return NextResponse.json({ error }, { status: 500 });
  }

  if (!calendarAccount) return NextResponse.json({}, { status: 204 });

  // Revoke
  console.info("Revoking calendar account...", calendarAccount.id);
  googleClient.setCredentials({ refresh_token: calendarAccount.refresh_token });

  const { token } = await googleClient.getAccessToken();

  await fetch(`https://oauth2.googleapis.com/revoke`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `token=${token}`,
  });

  console.info("Revoked calendar account", calendarAccount.id);
  // delete the credential from the database
  const { error: revokeError } = await supabase.client
    .from("calendar_accounts")
    .delete()
    .eq("id", calendarId);

  if (revokeError) {
    console.error("Error revoking calendar account", revokeError);
    return NextResponse.json({ error: revokeError }, { status: 500 });
  }

  return NextResponse.json({ message: "success" }, { status: 200 });
}
