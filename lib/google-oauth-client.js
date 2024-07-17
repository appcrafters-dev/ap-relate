import { google } from "googleapis";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL } =
  process.env;

export const googleClient = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL
);

export const googleCalendar = google.calendar({
  version: "v3",
  auth: googleClient,
});
