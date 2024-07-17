import {
  getSupabaseServerComponentClient,
  isUserRoleRestricted,
} from "lib/supabase/supbase.server";

import SessionLibrary from "./library-page";
import { notFound } from "next/navigation";
import { UserRoles } from "lib/models/enums";

async function getSessionLibrary() {
  const supabase = getSupabaseServerComponentClient();

  return supabase.client
    .from("sessions")
    .select("*, life_phases(title)")
    .eq("status", "Active");
}

export default async function SessionLibraryPage() {
  if (await isUserRoleRestricted(UserRoles.CoachesAndAdmins)) notFound();

  const { data, error } = await getSessionLibrary();

  if (error) {
    console.error("ERROR - getSessionLibrary:", error);
    return <p>Something went wrong, please try again later.</p>;
  }

  return <SessionLibrary sessions={data} />;
}
