import { googleClient } from "lib/google-oauth-client";
import { NextResponse } from "next/server";

export async function GET() {
  // generate a url that asks permissions for Blogger and Google Calendar scopes
  const scopes = [
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/calendar.events",
  ];

  const url = googleClient.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent select_account",
  });

  if (!url) {
    return NextResponse.json(
      { error: "Error generating url" },
      { status: 500 }
    );
  }

  return NextResponse.json(url);
}
